using AmazeCare.Data;
using AmazeCare.Models;
using Microsoft.EntityFrameworkCore;

namespace AmazeCare.Services
{
    public class AdminService
    {
        private readonly AmazeCareDbContext _context;

        public AdminService(AmazeCareDbContext context)
        {
            _context = context;
        }

        // Doctor methods
        public async Task<IEnumerable<Doctor>> GetAllDoctorsAsync()
        {
            return await _context.Doctors.ToListAsync();
        }

        public async Task<Doctor> GetDoctorByIdAsync(int id)
        {
            return await _context.Doctors.FindAsync(id);
        }

        public async Task<Doctor> CreateDoctorAsync(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();
            return doctor;
        }

        public async Task<Doctor> UpdateDoctorAsync(Doctor doctor)
        {
            _context.Doctors.Update(doctor);
            await _context.SaveChangesAsync();
            return doctor;
        }
        public async Task<IEnumerable<Doctor>> GetDoctorsBySpecialtyAsync(string specialization)
        {
            return await _context.Doctors
                .Where(d => d.Specialization.Contains(specialization))
                .ToListAsync();
        }

        public async Task<bool> DeleteDoctorAsync(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return false;

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();
            return true;
        }

        // Patient methods
        public async Task<IEnumerable<Patient>> GetAllPatientsAsync()
        {
            return await _context.Patients.ToListAsync();
        }

        public async Task<Patient> GetPatientByIdAsync(int id)
        {
            return await _context.Patients.FindAsync(id);
        }

        public async Task<Patient> CreatePatientAsync(Patient patient)
        {
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task<Patient> UpdatePatientAsync(Patient patient)
        {
            _context.Patients.Update(patient);
            await _context.SaveChangesAsync();
            return patient;
        }

        public async Task<bool> DeletePatientAsync(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
                return false;

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Administrator>> GetAllAdminsAsync() 
        {
            return await _context.Administrators.ToListAsync(); 
        }
        public async Task<Administrator> GetAdminByIdAsync(int id) 
        {
            return await _context.Administrators.FindAsync(id); 
        }
        public async Task<Administrator> CreateAdminAsync(Administrator admin)
        {
            _context.Administrators.Add(admin); 
            await _context.SaveChangesAsync(); 
            return admin;
        }
        public async Task<Administrator> UpdateAdminAsync(Administrator admin) 
        { 
            _context.Administrators.Update(admin);
            await _context.SaveChangesAsync(); 
            return admin;
        }
    }
}
