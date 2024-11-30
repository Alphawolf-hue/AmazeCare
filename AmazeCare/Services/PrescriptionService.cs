using AmazeCare.Models;
using AmazeCare.Repositories;

namespace AmazeCare.Services
{
    public class PrescriptionService:IPrescriptionService
    {
        private readonly IPrescriptionRepository _prescriptionRepository;

        public PrescriptionService(IPrescriptionRepository prescriptionRepository)
        {
            _prescriptionRepository = prescriptionRepository;
        }

        public async Task<IEnumerable<Prescription>> GetAllPrescriptionsAsync()
        {
            return await _prescriptionRepository.GetAllPrescriptionsAsync();
        }

        public async Task<Prescription?> GetPrescriptionByIdAsync(int id)
        {
            return await _prescriptionRepository.GetPrescriptionByIdAsync(id);
        }

        public async Task<Prescription> CreatePrescriptionAsync(Prescription prescription)
        {
            return await _prescriptionRepository.CreatePrescriptionAsync(prescription);
        }

        public async Task<Prescription?> UpdatePrescriptionAsync(Prescription prescription)
        {
            return await _prescriptionRepository.UpdatePrescriptionAsync(prescription);
        }

        public async Task<bool> DeletePrescriptionAsync(int id)
        {
            return await _prescriptionRepository.DeletePrescriptionAsync(id);
        }
    }
}
