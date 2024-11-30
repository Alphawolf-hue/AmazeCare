using AmazeCare.Models;

namespace AmazeCare.Repositories
{
    public interface IAppointmentRepository
    {
        IEnumerable<Appointment> GetAllAppointments();
        void AddAppointment(Appointment appointment);
    }
}
