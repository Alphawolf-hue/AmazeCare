using AmazeCare.Data;
using AmazeCare.Models;
using AmazeCare.Repositories;
using Microsoft.EntityFrameworkCore;

namespace AmazeCare.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly AmazeCareDbContext _context;

        public DoctorService(AmazeCareDbContext context)
        {
            _context = context;
        }

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

        public async Task<bool> DeleteDoctorAsync(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return false;

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<IEnumerable<Doctor>> GetDoctorsBySpecialtyAsync(string specialization)
        {
            return await _context.Doctors
                .Where(d => d.Specialization.Contains(specialization))
                .ToListAsync();
        }
    }
}
