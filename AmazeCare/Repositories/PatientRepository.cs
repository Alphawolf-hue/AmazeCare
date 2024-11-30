using AmazeCare.Data;
using AmazeCare.Models;

namespace AmazeCare.Repositories
{
    public class PatientRepository:IPatientRepository
    {
        private readonly AmazeCareDbContext _context;

        public PatientRepository(AmazeCareDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Patient> GetAllPatients() => _context.Patients.ToList();

        public void AddPatient(Patient patient) => _context.Patients.Add(patient);
    }
}
