using AmazeCare.Data;
using AmazeCare.Models;
using Microsoft.EntityFrameworkCore;

namespace AmazeCare.Repositories
{
    public class PrescriptionRepository : IPrescriptionRepository
    {
        private readonly AmazeCareDbContext _context;

        public PrescriptionRepository(AmazeCareDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Prescription>> GetAllPrescriptionsAsync()
        {
            return await _context.Prescriptions.ToListAsync();
        }

        public async Task<Prescription?> GetPrescriptionByIdAsync(int id)
        {
            return await _context.Prescriptions.FindAsync(id);
        }

        public async Task<Prescription> CreatePrescriptionAsync(Prescription prescription)
        {
            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();
            return prescription;
        }

        public async Task<Prescription?> UpdatePrescriptionAsync(Prescription prescription)
        {
            _context.Prescriptions.Update(prescription);
            await _context.SaveChangesAsync();
            return prescription;
        }

        public async Task<bool> DeletePrescriptionAsync(int id)
        {
            var prescription = await _context.Prescriptions.FindAsync(id);
            if (prescription == null) return false;

            _context.Prescriptions.Remove(prescription);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
