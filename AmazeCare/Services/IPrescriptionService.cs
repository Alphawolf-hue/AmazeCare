using AmazeCare.Models;

namespace AmazeCare.Services
{
    public interface IPrescriptionService
    {
        Task<IEnumerable<Prescription>> GetAllPrescriptionsAsync();
        Task<Prescription?> GetPrescriptionByIdAsync(int id);
        Task<Prescription> CreatePrescriptionAsync(Prescription prescription);
        Task<Prescription?> UpdatePrescriptionAsync(Prescription prescription);
        Task<bool> DeletePrescriptionAsync(int id);
    }
}
