using AmazeCare.Models;

namespace AmazeCare.Services
{
    public interface IPatientService
    {
        Task<IEnumerable<Patient>> GetAllPatientsAsync();
        Task<Patient> GetPatientByIdAsync(int id);
        Task<Patient> CreatePatientAsync(Patient patient);
        Task<Patient> UpdatePatientAsync(Patient patient);
        Task<bool> DeletePatientAsync(int id);
    }
}
