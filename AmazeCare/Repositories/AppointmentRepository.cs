using AmazeCare.Data;
using AmazeCare.Models;
using Microsoft.EntityFrameworkCore;

namespace AmazeCare.Repositories
{
    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly AmazeCareDbContext _context;

        public AppointmentRepository(AmazeCareDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Appointment> GetAllAppointments() => _context.Appointments.ToList();

        public void AddAppointment(Appointment appointment) => _context.Appointments.Add(appointment);
    }
}
