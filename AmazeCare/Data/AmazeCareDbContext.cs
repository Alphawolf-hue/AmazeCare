using AmazeCare.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AmazeCare.Data
{
    public class AmazeCareDbContext:IdentityDbContext<ApplicationUser>
    {
        public AmazeCareDbContext(DbContextOptions<AmazeCareDbContext> options) : base(options) { }
        public DbSet<Administrator> Administrators { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Seed roles
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleId = 1, RoleName = "Admin" },
                new Role { RoleId = 2, RoleName = "Doctor" },
                new Role { RoleId = 3, RoleName = "Patient" }
            );

            // Configure Appointment -> Patient relationship
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Cascade);  // Cascade delete

            // Configure Appointment -> Doctor relationship
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.NoAction);  // Set to NULL on Doctor deletion

            // Configure Prescription -> Patient relationship
            modelBuilder.Entity<Prescription>()
                .HasOne(p => p.Patient)
                .WithMany(p => p.Prescriptions)
                .HasForeignKey(p => p.PatientId)
                .OnDelete(DeleteBehavior.NoAction);  // Set to NULL on Patient deletion

            // Configure Prescription -> Appointment relationship
            modelBuilder.Entity<Prescription>()
                .HasOne(p => p.Appointment)
                .WithMany(a => a.Prescriptions)
                .HasForeignKey(p => p.AppointmentId)
                .OnDelete(DeleteBehavior.Cascade);  // Cascade delete on Appointment deletion

            modelBuilder.Entity<Doctor>().
                HasOne(d => d.User)
                .WithMany().HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Patient>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);

        }
    }
}
