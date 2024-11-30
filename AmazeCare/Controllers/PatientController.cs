using AmazeCare.Models;
using AmazeCare.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AmazeCare.Controllers
{
    [Authorize(Roles = "Patient,Admin")]
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllPatients()
        {
            var patients = await _patientService.GetAllPatientsAsync();
            return Ok(new { message = "Successfully Retrieved All Patients", data = patients });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatientById(int id)
        {
            try
            {
                var patient = await _patientService.GetPatientByIdAsync(id);
                if (patient == null) return NotFound();
                return Ok(new { message = "Successfully Retrieved Patient", data = patient });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while retrieving the patient", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreatePatient([FromBody] Patient patient)
        {
            try
            {
                if (patient.UserId == null) { return BadRequest(new { message = "UserId is required" }); }
                var createdPatient = await _patientService.CreatePatientAsync(patient);
                return CreatedAtAction(nameof(GetPatientById), new { id = createdPatient.Id }, new { message = "Successfully Created", data = createdPatient });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while creating the patient", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] Patient patient)
        {
            try
            {
                if (id != patient.Id) return BadRequest(new { message = "Patient ID mismatch" });

                var updatedPatient = await _patientService.UpdatePatientAsync(patient);
                if (updatedPatient == null) return NotFound(new { message = "Patient Not Found" });

                return Ok(new { message = "Successfully Updated", data = updatedPatient });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An error occurred while Updating the patient", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var result = await _patientService.DeletePatientAsync(id);
            if (!result) return NotFound(new { message = "Patient Not Found" });

            return Ok(new { message = "Successfully Deleted" });
        }
    }
}
