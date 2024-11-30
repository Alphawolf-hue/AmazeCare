using AmazeCare.Models;
using AmazeCare.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AmazeCare.Controllers
{
    [Authorize(Roles = "Doctor")]
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class PrescriptionController : ControllerBase
    {
        private readonly IPrescriptionService _prescriptionService;

        public PrescriptionController(IPrescriptionService prescriptionService)
        {
            _prescriptionService = prescriptionService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Prescription>>> GetAllPrescriptions()
        {
            var prescriptions = await _prescriptionService.GetAllPrescriptionsAsync();
            return Ok(prescriptions);
        }
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<Prescription>> GetPrescriptionById(int id)
        {
            var prescription = await _prescriptionService.GetPrescriptionByIdAsync(id);
            if (prescription == null) return NotFound();
            return Ok(prescription);
        }

        [HttpPost]
        public async Task<ActionResult<Prescription>> CreatePrescription([FromBody] Prescription prescription)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var createdPrescription = await _prescriptionService.CreatePrescriptionAsync(prescription);
            return CreatedAtAction(nameof(GetPrescriptionById), new { id = createdPrescription.Id }, createdPrescription);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePrescription(int id, Prescription prescription)
        {
            if (id != prescription.Id) return BadRequest();
            var updatedPrescription = await _prescriptionService.UpdatePrescriptionAsync(prescription);
            if (updatedPrescription == null) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrescription(int id)
        {
            var result = await _prescriptionService.DeletePrescriptionAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
