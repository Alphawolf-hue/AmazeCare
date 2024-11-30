using AmazeCare.Models;
using AmazeCare.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AmazeCare.Controllers
{
    //[EnableCors("AllowAllOrigins")]
    [Authorize(Roles = "Doctor,Admin")]
    [Route("api/[controller]")]
    [ApiController]
    
    public class DoctorController : ControllerBase
    {
        private readonly IDoctorService _doctorService;

        public DoctorController(IDoctorService doctorService)
        {
            _doctorService = doctorService;
        }
        
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllDoctors()
        {
            try
            {
                var doctors = await _doctorService.GetAllDoctorsAsync();
                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving data: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDoctorById(int id)
        {
            try
            {
                var doctor = await _doctorService.GetDoctorByIdAsync(id);
                if (doctor == null)
                    return NotFound($"Doctor with ID {id} not found.");
                return Ok(new {message= "Succesfully Retrived Doctor",data=doctor});
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving data: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateDoctor([FromBody] Doctor doctor)
        {
            try
            {
                if (doctor.UserId == null) { return BadRequest(new { message = "UserId is required" }); }
                var createdDoctor = await _doctorService.CreateDoctorAsync(doctor);
                return CreatedAtAction(nameof(GetDoctorById), new { id = createdDoctor.Id }, new { message = "Successfully Created", data = createdDoctor });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error Creating Doctor: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] Doctor doctor)
        {
            if (id != doctor.Id) return BadRequest();
            var updatedDoctor = await _doctorService.UpdateDoctorAsync(doctor);
            if (updatedDoctor == null) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var result = await _doctorService.DeleteDoctorAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDoctorsBySpecialty([FromQuery] string specialization)
        {
            try
            {
                if (string.IsNullOrEmpty(specialization))
                    return BadRequest("Specialty is required.");

                var doctors = await _doctorService.GetDoctorsBySpecialtyAsync(specialization);
                if (doctors == null || !doctors.Any())
                    return NotFound($"No doctors found for the specialty {specialization}.");

                return Ok(new { message = "Doctors retrieved successfully", data = doctors });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving doctors: {ex.Message}");
            }
        }
    }
}
