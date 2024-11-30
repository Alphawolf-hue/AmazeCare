using AmazeCare.Data;
using AmazeCare.Models;

namespace AmazeCare.Repositories
{
    public class DoctorRepository:IDoctorRepository
    {
        private readonly AmazeCareDbContext _context;

        public DoctorRepository(AmazeCareDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Doctor> GetAllDoctors() => _context.Doctors.ToList();

        public void AddDoctor(Doctor doctor) => _context.Doctors.Add(doctor);
    }
}
