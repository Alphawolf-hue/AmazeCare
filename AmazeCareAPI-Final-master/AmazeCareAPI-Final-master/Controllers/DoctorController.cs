using AmazeCareAPI.Data;
using AmazeCareAPI.Dtos;
using AmazeCareAPI.Models;
using AmazeCareAPI.Services;
using AmazeCareAPI.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


[Authorize(Roles = "Doctor")]
[Route("api/[controller]")]
[ApiController]
public class DoctorController : ControllerBase
{
    private readonly IDoctorService _doctorService;
    //private readonly AmazeCareContext _context;

    public DoctorController(IDoctorService doctorService )
    {
        _doctorService = doctorService;
    }

    [HttpGet("GetAppointmentsByStatus")]
    public async Task<IActionResult> GetAppointmentsByStatus([FromQuery] string status)
    {
        var doctorId = await GetDoctorIdFromTokenAsync();
        if (doctorId == null)
            return Unauthorized("Doctor ID not found for the authenticated user.");

        if (string.IsNullOrWhiteSpace(status) || !new[] { "Completed", "Scheduled", "Canceled" , "Requested"}.Contains(status))
            return BadRequest("Invalid status. Valid values are 'Completed', 'Scheduled','Canceled' or'Requested'.");

        var appointments = await _doctorService.GetAppointmentsByStatus(doctorId.Value, status);
        if (appointments == null || !appointments.Any())
            return NotFound("No appointments found with the specified status.");

        return Ok(appointments);
    }
    [HttpPut("ApproveAppointment/{appointmentId}/approve")]
    public async Task<IActionResult> ApproveAppointmentRequest(int appointmentId)
    {
        var doctorId = await GetDoctorIdFromTokenAsync();
        if (doctorId == null)
            return Unauthorized("Doctor ID not found for the authenticated user.");

        var success = await _doctorService.ApproveAppointmentRequest(doctorId.Value, appointmentId);
        if (!success)
            return NotFound("Appointment not found or it is not in a requested state.");

        return Ok("Appointment approved successfully.");
    }


    [HttpPut("CancelAppointment/{appointmentId}/cancel")]
    public async Task<IActionResult> CancelScheduledAppointment(int appointmentId)
    {
        var doctorId = await GetDoctorIdFromTokenAsync();
        if (doctorId == null)
            return Unauthorized("Doctor ID not found for the authenticated user.");

        var success = await _doctorService.CancelScheduledAppointment(doctorId.Value, appointmentId);
        if (!success)
            return NotFound("Appointment not found or it is not scheduled.");

        return Ok("Appointment canceled successfully.");
    }

    [HttpPut("RescheduleAppointment/{appointmentId}")]
    public async Task<IActionResult> RescheduleAppointment(int appointmentId, [FromBody] AppointmentRescheduleDto rescheduleDto)
    {
        var doctorId = await GetDoctorIdFromTokenAsync();
        if (doctorId == null)
            return Unauthorized("Doctor ID not found for the authenticated user.");

        var (success, message) = await _doctorService.RescheduleAppointmentAsync(doctorId.Value, appointmentId, rescheduleDto);

        if (!success)
            return BadRequest(message);

        return Ok("Appointment rescheduled successfully.");
    }

    [HttpPost("appointments/{appointmentId}/consult")]
    public async Task<IActionResult> ConductConsultation(
    int appointmentId,
    [FromBody] CreateMedicalRecordDto recordDto,
    [FromQuery] decimal consultationFee)
    {
        var doctorId = await GetDoctorIdFromTokenAsync();
        if (doctorId == null)
            return Unauthorized("Doctor ID not found for the authenticated user.");

        var response = await _doctorService.ConductConsultation(doctorId.Value, appointmentId, recordDto, consultationFee);

        if (response == null)
            return BadRequest("Failed to conduct consultation. Ensure the appointment is scheduled and valid.");

        return Ok(new
        {
            Message = "Consultation completed successfully.",
            RecordID = response.RecordID,
            BillingDetails = response.BillingDetails
        });
    }



    // Get medical records 
    [HttpGet("GetPatientMedicalRecords/{patientId}/medical-records")]
    public async Task<IActionResult> GetPatientMedicalRecords(int patientId)
    {
        var doctorId = await GetDoctorIdFromTokenAsync();
        if (doctorId == null)
            return Unauthorized("Doctor ID not found for the authenticated user.");

        var records = await _doctorService.GetMedicalRecordsByPatientIdAsync(patientId);
        return Ok(records);
    }


    // Update Medical Record
    [HttpPut("UpdateMedicalRecord/{recordId}/{patientId}")]
    public async Task<IActionResult> UpdateMedicalRecord(int recordId, int patientId, [FromBody] UpdateMedicalRecordDto recordDto)
    {
        var doctorId = await GetDoctorIdFromTokenAsync();
        if (doctorId == null)
            return Unauthorized("Doctor ID not found for the authenticated user.");

        var success = await _doctorService.UpdateMedicalRecord(doctorId.Value, recordId, patientId, recordDto);
        if (!success)
            return NotFound("Medical record not found or unauthorized access.");

        return Ok("Medical record updated successfully.");
    }

    [HttpPut("billing/{billingId}/pay")]
    public async Task<IActionResult> UpdateBillingStatus(int billingId)
    {
        var doctorId = await GetDoctorIdFromTokenAsync();
        if (doctorId == null)
            return Unauthorized("Doctor ID not found for the authenticated user.");

        var success = await _doctorService.UpdateBillingStatusAsync(billingId, doctorId.Value);
        if (!success)
            return BadRequest("Billing record not found or already marked as 'Paid'.");

        return Ok("Billing status updated to 'Paid'.");
    }

    [HttpGet("GetBills")]
    public async Task<IActionResult> GetDoctorBills()
    {
        var doctorId = await GetDoctorIdFromTokenAsync(); // Retrieve doctor ID from token
        if (doctorId == null)
            return Unauthorized("Doctor not authenticated.");

        var bills = await _doctorService.GetBillsByDoctorIdAsync(doctorId.Value);
        return Ok(bills);
    }


    [HttpGet("GetAllMedications")]
    public async Task<ActionResult<IEnumerable<MedicationDto>>> GetMedications()
    {
        var medications = await _doctorService.GetMedicationsAsync();
        return Ok(medications);
    }
    [HttpGet("GetAllTests")]
    public async Task<ActionResult<IEnumerable<TestDto>>> GetTests()
    {
        var tests = await _doctorService.GetTestsAsync();
        return Ok(tests);
    }

    [HttpPost("CreateSchedule")]
    public async Task<IActionResult> AddSchedule([FromBody] CreateScheduleDto scheduleDto)
    {
        var doctorId = await GetDoctorIdFromTokenAsync();
        if (doctorId == null)
            return Unauthorized("Doctor ID not found for the authenticated user.");

        bool success = await _doctorService.AddScheduleAsync(doctorId.Value, scheduleDto);
        if (!success)
            return BadRequest("Failed to add schedule.");

        return Ok("Schedule added successfully.");
    }

    [HttpPut("UpdateSchedule/{scheduleId}")]
    public async Task<IActionResult> UpdateSchedule(int scheduleId, [FromBody] UpdateScheduleDto updateDto)
    {
        var doctorId = await GetDoctorIdFromTokenAsync();
        if (doctorId == null)
            return Unauthorized("Doctor ID not found for the authenticated user.");

        bool success = await _doctorService.UpdateScheduleAsync(scheduleId, doctorId.Value, updateDto);
        if (!success)
            return NotFound("Schedule not found or unauthorized access.");

        return Ok("Schedule updated successfully.");
    }

    [HttpGet("GetALLSchedules")]
    public async Task<IActionResult> GetSchedules()
    {
        var doctorId = await GetDoctorIdFromTokenAsync();
        if (doctorId == null)
            return Unauthorized("Doctor ID not found for the authenticated user.");

        var schedules = await _doctorService.GetSchedulesAsync(doctorId.Value);
        if (!schedules.Any())
            return NotFound("No Schedule found.");

        return Ok(schedules);
    }

    [HttpPut("CancelSchedule/{scheduleId}")]
    public async Task<IActionResult> CancelSchedule(int scheduleId)
    {
        var doctorId = await GetDoctorIdFromTokenAsync();
        if (doctorId == null)
            return Unauthorized("Doctor ID not found for the authenticated user.");

        bool success = await _doctorService.CancelScheduleAsync(scheduleId, doctorId.Value);
        if (!success)
            return NotFound("Schedule not found, unauthorized access, or already completed.");

        return Ok("Schedule cancelled successfully.");
    }

    [HttpPut("CompleteSchedules/{scheduleId}")]
    public async Task<IActionResult> CompleteSchedule(int scheduleId)
    {
        var doctorId = await GetDoctorIdFromTokenAsync();
        if (doctorId == null)
            return Unauthorized("Doctor ID not found for the authenticated user.");

        bool success = await _doctorService.CompleteScheduleAsync(scheduleId, doctorId.Value);
        if (!success)
            return NotFound("Schedule not found, unauthorized access, or already completed.");

        return Ok("Marked Completed successfully.");
    }



    private async Task<int?> GetDoctorIdFromTokenAsync()
    {
        // get userID from token
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token.");
        }
        // doctorid form usrid use
        var DoctorID = await _doctorService.GetDoctorIdAsync(userId);
        //var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserID == userId);
        return DoctorID;
    }

}

