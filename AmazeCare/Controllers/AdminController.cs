using AmazeCare.Models;
using AmazeCare.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;

namespace AmazeCare.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;

        public AdminController(AdminService adminService)
        {
            _adminService = adminService;
        }

        // Doctor endpoints
        [HttpGet("doctors")]
        public async Task<IActionResult> GetAllDoctors()
        {
            try
            {
                var doctors = await _adminService.GetAllDoctorsAsync();
                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving data: {ex.Message}");
            }
        }

        [HttpGet("doctors/{id}")]
        public async Task<IActionResult> GetDoctorById(int id)
        {
            try
            {
                var doctor = await _adminService.GetDoctorByIdAsync(id);
                if (doctor == null)
                    return NotFound($"Doctor with ID {id} not found.");
                return Ok(new { message = "Successfully Retrieved Doctor", data = doctor });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving data: {ex.Message}");
            }
        }

        [HttpPost("doctors")]
        public async Task<IActionResult> CreateDoctor([FromBody] Doctor doctor)
        {
            try
            {
                var createdDoctor = await _adminService.CreateDoctorAsync(doctor);
                return CreatedAtAction(nameof(GetDoctorById), new { id = createdDoctor.Id }, new { message = "Successfully Created", data = createdDoctor });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error Creating Doctor: {ex.Message}");
            }
        }

        [HttpPut("doctors/{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] Doctor doctor)
        {
            if (id != doctor.Id) return BadRequest();
            var updatedDoctor = await _adminService.UpdateDoctorAsync(doctor);
            if (updatedDoctor == null) return NotFound();
            return BadRequest("Failed to Update Doctor");
        }

        [HttpDelete("doctors/{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var result = await _adminService.DeleteDoctorAsync(id);
            if (!result) return NotFound( "Doctor ID not found in the system" );
            return Ok("Doctor ID has been successfully deleted");
        }

        [HttpGet("doctors/search")]
        public async Task<IActionResult> GetDoctorsBySpecialty([FromQuery] string specialization)
        {
            try
            {
                if (string.IsNullOrEmpty(specialization))
                    return BadRequest("Specialty is required.");

                var doctors = await _adminService.GetDoctorsBySpecialtyAsync(specialization);
                if (doctors == null || !doctors.Any())
                    return NotFound($"No doctors found for the specialty {specialization}.");

                return Ok(new { message = "Doctors retrieved successfully", data = doctors });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving doctors: {ex.Message}");
            }
        }

        // Patient endpoints
        [HttpGet("patients")]
        public async Task<IActionResult> GetAllPatients()
        {
            try
            {
                var patients = await _adminService.GetAllPatientsAsync();
                return Ok(patients);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving data: {ex.Message}");
            }
        }

        [HttpGet("patients/{id}")]
        public async Task<IActionResult> GetPatientById(int id)
        {
            try
            {
                var patient = await _adminService.GetPatientByIdAsync(id);
                if (patient == null)
                    return NotFound($"Patient with ID {id} not found.");
                return Ok(new { message = "Successfully Retrieved Patient", data = patient });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving data: {ex.Message}");
            }
        }

        [HttpPost("patients")]
        public async Task<IActionResult> CreatePatient([FromBody] Patient patient)
        {
            try
            {
                var createdPatient = await _adminService.CreatePatientAsync(patient);
                return CreatedAtAction(nameof(GetPatientById), new { id = createdPatient.Id }, new { message = "Successfully Created", data = createdPatient });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error Creating Patient: {ex.Message}");
            }
        }

        [HttpPut("patients/{id}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] Patient patient)
        {
            try
            {
                if (id != patient.Id) return BadRequest(new { message = "Patient ID mismatch" });

                var updatedPatient = await _adminService.UpdatePatientAsync(patient);
                if (updatedPatient == null) return NotFound(new { message = "Patient Not Found" });

                return Ok(new { message = "Successfully Updated", data = updatedPatient });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while Updating the patient", error = ex.Message });
            }
        }

        [HttpDelete("patients/{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var result = await _adminService.DeletePatientAsync(id);
            if (!result) return NotFound(new { message = "Patient Not Found" });
            return Ok(new { message = "Successfully Deleted" });
        }
        [HttpGet("admins")] public async Task<IActionResult> GetAllAdmins()
        { 
            try 
            { 
                var admins = await _adminService.GetAllAdminsAsync(); 
                return Ok(admins); 
            } 
            catch (Exception ex) 
            { 
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving data: {ex.Message}"); 
            }
        }
        [HttpGet("admins/{id}")] public async Task<IActionResult> GetAdminById(int id)
        { 
            try 
            {
                var admin = await _adminService.GetAdminByIdAsync(id); 
                if (admin == null) return NotFound($"Admin with ID {id} not found.");
                return Ok(new { message = "Successfully Retrieved Admin", data = admin });
            }
            catch (Exception ex)
            { 
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving data: {ex.Message}"); 
            } 
        }

        [HttpPost("admins")] public async Task<IActionResult> CreateAdmin([FromBody] Administrator admin)
        { 
            try 
            { 
                var createdAdmin = await _adminService.CreateAdminAsync(admin); 
                return CreatedAtAction(nameof(GetAdminById), new { id = createdAdmin.AdminID }, new { message = "Successfully Created", data = createdAdmin }); 
            } 
            catch (Exception ex) 
            { 
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error Creating Admin: {ex.Message}");
            } 
        }
        [HttpPut("admins/{id}")] public async Task<IActionResult> UpdateAdmin(int id, [FromBody] Administrator admin) 
        { 
            try 
            { 
                if (id != admin.AdminID) return BadRequest(new { message = "Admin ID mismatch" }); 
                var updatedAdmin = await _adminService.UpdateAdminAsync(admin); 
                if (updatedAdmin == null) return NotFound(new { message = "Admin Not Found" });
                return Ok(new { message = "Successfully Updated", data = updatedAdmin }); 
            } 
            catch (Exception ex)
            { 
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while Updating the admin", error = ex.Message });
            } 
        }
    }
}
