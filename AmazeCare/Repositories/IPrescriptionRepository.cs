using AmazeCare.Models;

namespace AmazeCare.Repositories
{
    public interface IPrescriptionRepository
    {
        Task<IEnumerable<Prescription>> GetAllPrescriptionsAsync();
        Task<Prescription?> GetPrescriptionByIdAsync(int id);
        Task<Prescription> CreatePrescriptionAsync(Prescription prescription);
        Task<Prescription?> UpdatePrescriptionAsync(Prescription prescription);
        Task<bool> DeletePrescriptionAsync(int id);
    }
}
