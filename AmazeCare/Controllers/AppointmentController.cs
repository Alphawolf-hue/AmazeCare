using AmazeCare.Models;
using AmazeCare.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AmazeCare.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        [Authorize(Roles ="Doctor,Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllAppointments()
        {
            try
            {
                var appointments = await _appointmentService.GetAllAppointmentsAsync();
                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving data: {ex.Message}");
            }
        }
        // GET: api/appointments/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAppointmentById(int id)
        {
            try
            {
                var appointment = await _appointmentService.GetAppointmentByIdAsync(id);
                if (appointment == null)
                    return NotFound();
                return Ok(appointment);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving data: {ex.Message}");
            }
        }

        // POST: api/appointments
        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] Appointment model)
        {
            try
            {
                var appointment = await _appointmentService.CreateAppointmentAsync(model);
                return CreatedAtAction(nameof(GetAppointmentById), new { id = appointment.Id }, appointment);
            }
            catch (Exception ex) 
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error creating appointment: {ex.Message}");
            }
        }
        [Authorize(Roles = "Doctor,Admin")]
        // PUT: api/appointments/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] Appointment model)
        {
            try
            {
                if (id != model.Id)
                    return BadRequest("ID mismatch.");

                var updatedAppointment = await _appointmentService.UpdateAppointmentAsync(model);
                if (updatedAppointment == null)
                    return NotFound($"Appointment with ID {id} not found.");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error updating appointment: {ex.Message}");
            }
        }
        [Authorize(Roles = "Doctor,Admin")]
        // DELETE: api/appointments/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            try
            {
                var result = await _appointmentService.DeleteAppointmentAsync(id);
                if (!result)
                    return NotFound($"Appointment with ID {id} not found.");

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting appointment: {ex.Message}");
            }
        }
    }
}
