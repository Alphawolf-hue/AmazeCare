using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AmazeCareAPI.Dtos;
using System.Security.Claims;
using AmazeCareAPI.Services.Interface;

namespace AmazeCareAPI.Controllers
{
    [Authorize(Roles = "Patient")]
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientController(IPatientService patientService)
        {
            _patientService = patientService;
        }
        [HttpGet("check-username")]
        public async Task<IActionResult> CheckUsernameAvailability([FromQuery] string username)
        {
            var (isAvailable, message) = await _patientService.CheckUsernameAvailabilityAsync(username);
            return Ok(new { Username = username, IsAvailable = isAvailable, Message = message });
        }

        [HttpGet("GetPersonalInfo")]
        public async Task<IActionResult> GetPersonalInfo()

        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var personalInfo = await _patientService.GetPersonalInfoAsync(userId);

            if (personalInfo == null)
                return NotFound("User not found.");

           

            return Ok(personalInfo);
        }


        [HttpPut("UpdatePersonalInfo")]
        public async Task<IActionResult> UpdatePersonalInfo([FromBody] UpdatePersonalInfoDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid details provided.");

            int? userId = GetUserIdFromToken(); // Get nullable userId from token

            if (userId == null)
                return Unauthorized("User ID not found in token."); // Handle null case (e.g., unauthorized)

            var (isSuccess, message) = await _patientService.UpdatePersonalInfoAsync(userId.Value, updateDto);
            if (!isSuccess)
                return BadRequest(message);

            return Ok(message);
        }

        [HttpGet("SearchDoctors")]
        public async Task<IActionResult> SearchDoctors([FromQuery] string? specialization = null)
        {
            var doctors = await _patientService.SearchDoctors(specialization);

            if (doctors == null || !doctors.Any())
                return NotFound("No doctors found for the specified specialization");

            return Ok(doctors);
        }

        [HttpGet("DoctorSchedule/{doctorId}")]
        public async Task<IActionResult> GetDoctorSchedule(int doctorId)
        {
            var schedule = await _patientService.GetDoctorScheduleAsync(doctorId);

            if (schedule == null || schedule.Count == 0)
                return NotFound("No Schedule found for the specified doctor.");

            return Ok(schedule);
        }

        [HttpPost("ScheduleAppointment")]
        public async Task<IActionResult> ScheduleAppointment( AppointmentBookingDto bookingDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var (appointment, message) = await _patientService.ScheduleAppointment(userId, bookingDto);

            if (appointment == null)
            {
                return BadRequest(message); 
            }

            return Ok(new { appointment, message }); 
        }


        //[HttpPut("RescheduleAppointment/{appointmentId}")]
        //public async Task<IActionResult> RescheduleAppointment(int appointmentId, [FromBody] AppointmentRescheduleDto rescheduleDto)
        //{
        //    var userId = GetUserIdFromToken();
        //    if (userId == null)
        //        return Unauthorized("User not authenticated.");

        //    var (appointment, message) = await _patientService.RescheduleAppointment(userId.Value, appointmentId, rescheduleDto);

        //    if (appointment == null)
        //        return BadRequest(message); 

        //    return Ok(new { appointment, message }); 
        //}
        [HttpPut("RescheduleAppointment/{appointmentId}")]
        public async Task<IActionResult> RescheduleAppointment(int appointmentId, [FromBody] AppointmentRescheduleDto rescheduleDto)
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized("User not authenticated.");

            var (appointment, message) = await _patientService.RescheduleAppointment(userId.Value, appointmentId, rescheduleDto);

            if (appointment == null)
                return BadRequest(message);

            return Ok(new { appointment, message });
        }



        [HttpGet("GetMedicalHistory")]
        public async Task<IActionResult> GetMedicalHistory()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized("User ID not found in token.");

            var medicalHistory = await _patientService.GetMedicalHistory(userId.Value);

            if (medicalHistory == null || !medicalHistory.Any())
                return NotFound("No medical history found.");

            return Ok(medicalHistory);
        }

        [HttpGet("GetTestDetails")]
        public async Task<IActionResult> GetTestDetails()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized("User ID not found in token.");

            var testDetails = await _patientService.GetTestDetails(userId.Value);
            return Ok(testDetails);
        }

        [HttpGet("GetPrescriptionDetails")]
        public async Task<IActionResult> GetPrescriptionDetails()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized("User ID not found in token.");

            var prescriptionDetails = await _patientService.GetPrescriptionDetails(userId.Value);
            return Ok(prescriptionDetails);
        }

        [HttpGet("GetBillingDetails")]
        public async Task<IActionResult> GetBillingDetails()
        {
            var userId = GetUserIdFromToken();
            if (userId == null)
                return Unauthorized("User ID not found in token.");

            var billingDetails = await _patientService.GetBillingDetails(userId.Value);
            return Ok(billingDetails);
        }

        [HttpGet("GetAppointments")]
        public async Task<IActionResult> GetAppointments()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var appointments = await _patientService.GetAppointments(userId);

            if (appointments == null || !appointments.Any())
                return NotFound("No appointments found.");

            return Ok(appointments);
        }

        [HttpPost("CancelAppointment/{appointmentId}")]
        public async Task<IActionResult> CancelAppointment(int appointmentId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _patientService.CancelAppointment(userId, appointmentId);

            if (!result)
                return BadRequest("Unable to cancel the appointment.");

            return Ok("Appointment canceled successfully.");
        }

        [HttpGet("PatientBills")]
        public async Task<IActionResult> GetPatientBills()
        {
            var userId = GetUserIdFromToken(); 
            if (userId == null)
                return Unauthorized("User not found.");

            var bills = await _patientService.GetBillsByPatientIdAsync(userId.Value);
            return Ok(bills);
        }



        private int? GetUserIdFromToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId) ? userId : (int?)null;
        }
    }
}
