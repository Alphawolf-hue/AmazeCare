using AmazeCare.Models;

namespace AmazeCare.Repositories
{
    public interface IDoctorRepository
    {
        IEnumerable<Doctor> GetAllDoctors();
        void AddDoctor(Doctor doctor);
    }
}
