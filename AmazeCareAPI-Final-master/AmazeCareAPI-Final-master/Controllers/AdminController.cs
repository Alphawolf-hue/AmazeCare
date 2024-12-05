// Controllers/AdminController.cs
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using AmazeCareAPI.Services.Interface;
using AmazeCareAPI.Dtos;
using Microsoft.AspNetCore.Authorization;
using AmazeCareAPI.Services.Interface;
using AmazeCareAPI.Models;

namespace AmazeCareAPI.Controllers
{
    //[Authorize(Roles = "Administrator")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("CheckUsername")]
        public async Task<IActionResult> CheckUsernameAvailability([FromQuery] string username)
        {
            var (isAvailable, message) = await _adminService.CheckUsernameAvailabilityAsync(username);
            return Ok(new { Username = username, IsAvailable = isAvailable, Message = message });
        }

       
        [HttpPost("RegisterAdmin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] AdminRegistrationDto registrationDto)
        {
            try
            {
                var admin = await _adminService.RegisterAdmin(
                    registrationDto.Username,
                    registrationDto.Password,
                    registrationDto.FullName,
                    registrationDto.Email
                );

                return CreatedAtAction(nameof(RegisterAdmin), new { id = admin.AdminID }, admin);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("RegisterDoctor")]
        public async Task<IActionResult> RegisterDoctor([FromBody] DoctorRegistrationDto doctorDto)
        {
            try
            {
                var doctor = await _adminService.RegisterDoctor(doctorDto);
                return Ok(new { message = "Doctor registered successfully.", doctor });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("specializations")]
        public async Task<IActionResult> GetAllSpecializations()
        {
            var specializations = await _adminService.GetAllSpecializationsAsync();

            if (specializations == null || !specializations.Any())
                return NotFound("No specializations found.");

            return Ok(specializations);
        }

        [HttpGet("GetDoctorDetails/{doctorId}")]
        public async Task<IActionResult> GetDoctorDetails(int doctorId)
        {
            var doctor = await _adminService.GetDoctorDetails(doctorId);
            if (doctor == null)
                return NotFound($"Doctor with ID {doctorId} not found.");
            return Ok(doctor);
        }


        [HttpPut("UpdateDoctor/{doctorId}")]
        public async Task<IActionResult> UpdateDoctor(int doctorId, [FromBody] DoctorUpdateDto doctorDto)
        {
            var success = await _adminService.UpdateDoctorDetails(doctorId, doctorDto);
            if (!success) return NotFound(new { message = "Doctor not found." });
            return Ok(new { message = "Doctor updated successfully." });
        }

        [HttpDelete("DeleteDoctor/{userId}/{doctorId}")]
        public async Task<IActionResult> DeleteDoctor(int userId, int doctorId)
        {
            var result = await _adminService.DeleteDoctor(userId, doctorId);
            if (!result)
            {
                return NotFound(new { message = "Doctor not found or invalid user ID." });
            }
            return Ok(new { message = "Doctor deleted successfully. Associated appointments canceled." });
        }


        [HttpGet("GetPatientDetails/{patientId}")]
        public async Task<IActionResult> GetPatientDetails(int patientId)
        {
            try
            {
                var patient = await _adminService.GetPatientDetails(patientId);
                return Ok(patient);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
        [HttpPost("UpdatePatient")]
        public async Task<IActionResult> UpdatePatient([FromBody] PatientDto patientDto)
        {
            try
            {
                var patient = await _adminService.UpdatePatient(patientDto);
                return Ok(patient);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("DeletePatient/{userId}/{patientId}")]
        public async Task<IActionResult> DeletePatient(int userId, int patientId)
        {
            var result = await _adminService.DeletePatient(userId, patientId);
            if (!result)
            {
                return NotFound(new { message = "Patient not found or invalid user ID." });
            }
            return Ok(new { message = "Patient deleted successfully. Associated appointments canceled." });
        }


        [HttpGet("ViewAppointmentDetails/{appointmentId}")]
        public async Task<IActionResult> ViewAppointmentDetails(int appointmentId)
        {
            var appointment = await _adminService.ViewAppointmentDetails(appointmentId);

            if (appointment == null)
                return NotFound("Appointment not found");

            return Ok(appointment);
        }

        //[HttpPut("doctor/{doctorId}/UpdateSchedule/{scheduleId}")]
        //public async Task<IActionResult> UpdateDoctorSchedule(int doctorId, int scheduleId, [FromBody] UpdateScheduleDto scheduleDto)
        //{
        //    try
        //    {
        //        await _adminService.UpdateSchedule(doctorId, scheduleId, scheduleDto.StartDate, scheduleDto.EndDate);
        //        return Ok("Schedule updated successfully.");
        //    }
        //    catch (KeyNotFoundException ex)
        //    {
        //        return NotFound(ex.Message);
        //    }
        //}
        //[HttpPut("doctor/{doctorId}/schedule/{scheduleId}/cancel")]
        //public async Task<IActionResult> CancelDoctorSchedule(int doctorId, int scheduleId)
        //{
        //    try
        //    {
        //        var result = await _adminService.CancelSchedule(doctorId, scheduleId);
        //        return Ok(result);
        //    }
        //    catch (KeyNotFoundException ex)
        //    {
        //        return NotFound(ex.Message);
        //    }
        //}

        [HttpPut("admin/RescheduleAppointment/{appointmentId}")]
        public async Task<IActionResult> RescheduleAppointment(int appointmentId, [FromBody] AppointmentRescheduleDto rescheduleDto)
        {
            try
            {
                var appointment = await _adminService.RescheduleAppointment(appointmentId, rescheduleDto);

                if (appointment == null)
                    return NotFound("Appointment not found.");

                return Ok(appointment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("DoctorSchedule/GetAll/{doctorId}")]
        public async Task<IActionResult> GetSchedulesWithDoctorName(int doctorId)
        {
            var schedules = await _adminService.GetSchedulesWithDoctorNameAsync(doctorId);
            return Ok(schedules);
        }

        [HttpPut("DoctorSchedule/Update/{scheduleId}")]
        public async Task<IActionResult> UpdateSchedule(int scheduleId, [FromBody] UpdateScheduleDto updateDto)
        {
            var success = await _adminService.UpdateScheduleByAdminAsync(scheduleId, updateDto);

            if (!success)
                return NotFound("Schedule not found.");

            return Ok("Schedule updated successfully.");
        }

        [HttpPut("DoctorSchedule/{scheduleId}/cancel")]
        public async Task<IActionResult> CancelSchedule(int scheduleId)
        {
            var success = await _adminService.CancelScheduleByAdminAsync(scheduleId);

            if (!success)
                return NotFound("Schedule not found or already completed.");

            return Ok("Schedule canceled successfully.");
        }

        [HttpPut("DoctorSchedule/{scheduleId}/completed")]
        public async Task<IActionResult> MarkScheduleAsCompleted(int scheduleId)
        {
            var success = await _adminService.MarkScheduleAsCompletedAsync(scheduleId);

            if (!success)
                return NotFound("Schedule not found or it is already cancelled.");

            return Ok("Schedule marked as completed successfully.");
        }

        [HttpGet("GetAllBilling")]
        public async Task<IActionResult> GetBillingDetails()
        {
            var billingDetails = await _adminService.GetBillingDetailsWithNamesAsync();
            return Ok(billingDetails);
        }

        [HttpPut("Billing/{billingId}/pay")]
        public async Task<IActionResult> MarkBillAsPaid(int billingId)
        {
            var success = await _adminService.MarkBillAsPaidAsync(billingId);

            if (!success)
                return NotFound("Billing record not found or already marked as paid.");

            return Ok("Bill marked as paid successfully.");
        }

        [HttpGet("GetAllMedications")]
        public async Task<IActionResult> GetAllMedications()
        {
            var medications = await _adminService.GetAllMedicationsAsync();
            return Ok(medications);
        }
        [HttpPost("AddMedications")]
        public async Task<IActionResult> AddMedication([FromBody] CreateUpdateMedicationDto createMedicationDto)
        {
            await _adminService.AddMedicationAsync(createMedicationDto);
            return Ok("Medication added successfully.");
        }

        [HttpPut("UpdateMedications/{medicationId}")]
        public async Task<IActionResult> UpdateMedication(int medicationId, [FromBody] CreateUpdateMedicationDto updateMedicationDto)
        {
            var success = await _adminService.UpdateMedicationAsync(medicationId, updateMedicationDto);
            if (!success)
                return NotFound("Medication not found.");

            return Ok("Medication updated successfully.");
        }

        [HttpGet("GetAllTests")]
        public async Task<IActionResult> GetAllTests()
        {
            var tests = await _adminService.GetAllTestsAsync();
            return Ok(tests);
        }

        [HttpPost("AddTests")]
        public async Task<IActionResult> AddTest([FromBody] CreateUpdateTestDto createTestDto)
        {
            await _adminService.AddTestAsync(createTestDto);
            return Ok("Test added successfully.");
        }
        [HttpPut("UpdateTests/{testId}")]
        public async Task<IActionResult> UpdateTest(int testId, [FromBody] CreateUpdateTestDto updateTestDto)
        {
            var success = await _adminService.UpdateTestAsync(testId, updateTestDto);
            if (!success)
                return NotFound("Test not found.");

            return Ok("Test updated successfully.");
        }








    }
}
