using AmazeCare.Models;

namespace AmazeCare.Repositories
{
    public interface IPatientRepository
    {
        IEnumerable<Patient> GetAllPatients();
        void AddPatient(Patient patient);
    }
}
