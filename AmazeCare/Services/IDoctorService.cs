using AmazeCare.Models;

namespace AmazeCare.Services
{
    public interface IDoctorService
    {
        Task<IEnumerable<Doctor>> GetAllDoctorsAsync();
        Task<Doctor> GetDoctorByIdAsync(int id);
        Task<Doctor> CreateDoctorAsync(Doctor doctor);
        Task<Doctor> UpdateDoctorAsync(Doctor doctor);
        Task<bool> DeleteDoctorAsync(int id);
        Task<IEnumerable<Doctor>> GetDoctorsBySpecialtyAsync(string specialization);
    }
}
