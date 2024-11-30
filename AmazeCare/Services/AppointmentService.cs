using AmazeCare.Data;
using AmazeCare.Models;
using AmazeCare.Repositories;
using Microsoft.EntityFrameworkCore;

namespace AmazeCare.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly AmazeCareDbContext _context;

        public AppointmentService(AmazeCareDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Appointment>> GetAllAppointmentsAsync()
        {
            return await _context.Appointments.ToListAsync();
        }

        public async Task<Appointment> GetAppointmentByIdAsync(int id)
        {
            return await _context.Appointments.FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Appointment> CreateAppointmentAsync(Appointment appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<Appointment> UpdateAppointmentAsync(Appointment appointment)
        {
            var existingAppointment = await _context.Appointments.FindAsync(appointment.Id);
            if (existingAppointment == null) return null;

            _context.Entry(existingAppointment).CurrentValues.SetValues(appointment);
            await _context.SaveChangesAsync();
            return existingAppointment;
        }

        public async Task<bool> DeleteAppointmentAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return false;

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
