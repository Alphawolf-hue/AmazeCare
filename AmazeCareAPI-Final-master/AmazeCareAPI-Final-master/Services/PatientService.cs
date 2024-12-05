
using AmazeCareAPI.Data;
using AmazeCareAPI.Dtos;
using AmazeCareAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AmazeCareAPI.Services.Interface;
using AmazeCareAPI.Repositories.Interface;

namespace AmazeCareAPI.Services
{
    public class PatientService : IPatientService
    {
        private readonly IPatientRepository _patientRepository;

        public PatientService(IPatientRepository patientRepository)
        {
            _patientRepository = patientRepository;
        }
        public async Task<(bool IsAvailable, string Message)> CheckUsernameAvailabilityAsync(string username)
        {
            bool isAvailable = await _patientRepository.IsUsernameAvailableAsync(username);
            string message = isAvailable
                ? "Username is available."
                : "Username is already taken. Please choose a different username.";

            return (isAvailable, message);
        }

        public async Task<PatientPersonalInfoDto?> GetPersonalInfoAsync(int userId)
        {
            
            var user = await _patientRepository.GetUserByIdAsync(userId);
            if (user == null) return null;

            var patient = await _patientRepository.GetPatientByUserIdAsync(userId);
            if (patient == null) return null;

            
            return new PatientPersonalInfoDto
            {
                UserId = user.UserID,
                Username = user.Username,
                PasswordPlaceholder = "********", 
                FullName = patient.FullName,
                Email = patient.Email,
                DateOfBirth = patient.DateOfBirth,
                Gender = patient.Gender,
                ContactNumber = patient.ContactNumber,
                Address = patient.Address,
                MedicalHistory = patient.MedicalHistory
            };
        }

        public async Task<(bool IsSuccess, string Message)> UpdatePersonalInfoAsync(int userId, UpdatePersonalInfoDto updateDto)
        {
            
            var user = await _patientRepository.GetUserByIdAsync(userId);
            if (user == null) return (false, "User not found.");

            if (!string.Equals(user.Username, updateDto.Username, StringComparison.OrdinalIgnoreCase))
            {
                var (isAvailable, message) = await CheckUsernameAvailabilityAsync(updateDto.Username);
                if (!isAvailable)
                    return (false, message);
            }

            user.Username = updateDto.Username;

            if (!string.IsNullOrWhiteSpace(updateDto.NewPassword))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateDto.NewPassword);
            }

            await _patientRepository.UpdateUserAsync(user);

            var patient = await _patientRepository.GetPatientByUserIdAsync(userId);
            if (patient == null) return (false, "Patient record not found.");

            patient.FullName = updateDto.FullName;
            patient.Email = updateDto.Email;
            patient.ContactNumber = updateDto.ContactNumber;
            patient.Address = updateDto.Address;
            patient.MedicalHistory = updateDto.MedicalHistory;
            patient.DateOfBirth = updateDto.DateOfBirth;
            patient.Gender = updateDto.Gender;

            await _patientRepository.UpdatePatientAsync(patient);
            await _patientRepository.SaveChangesAsync();

            return (true, "Personal information updated successfully.");
        }


       
        //Appointment
        public async Task<(Appointment appointment, string message)> ScheduleAppointment(int userId, AppointmentBookingDto bookingDto)
        {
            var patient = await _patientRepository.GetPatientByUserIdAsync(userId);
            if (patient == null)
                return (null, "Patient not found.");

            bool isOnSchedule = await _patientRepository.IsDoctorOnSchedule(bookingDto.DoctorID, bookingDto.AppointmentDate);
            if (!isOnSchedule)
                return (null, "The selected appointment date and time docotor is not available");

            var appointment = new Appointment
            {
                PatientID = patient.PatientID,
                DoctorID = bookingDto.DoctorID,
                AppointmentDate = bookingDto.AppointmentDate,
                Symptoms = bookingDto.Symptoms,
                Status = "Requested"
            };

            await _patientRepository.AddAppointmentAsync(appointment);
            await _patientRepository.SaveChangesAsync();

            return (appointment, "Appointment requested successfully.");
        }
        // Medical records
        public async Task<List<PatientMedicalRecordDto>> GetMedicalHistory(int userId)
        {
            var patient = await _patientRepository.GetPatientByUserIdAsync(userId);
            if (patient == null) return null;

            return await _patientRepository.GetMedicalHistoryAsync(patient.PatientID);
        }
        // Serach Doctor using specilaization
        public async Task<IEnumerable<DoctorDto>> SearchDoctors(string specialization = null)
        {
            return await _patientRepository.SearchDoctorsAsync(specialization);
        }
        // get all appointment
        public async Task<IEnumerable<AppointmentWithDoctorDto>> GetAppointments(int userId)
        {
            var patient = await _patientRepository.GetPatientByUserIdAsync(userId);
            if (patient == null) return null;

            return await _patientRepository.GetAppointmentsByPatientIdAsync(patient.PatientID);
        }
        //cancel appointment
        public async Task<bool> CancelAppointment(int userId, int appointmentId)
        {
            var patient = await _patientRepository.GetPatientByUserIdAsync(userId);
            if (patient == null) return false;

            var appointment = await _patientRepository.GetAppointmentByIdAsync(patient.PatientID, appointmentId);
            if (appointment == null || appointment.Status == "Canceled") return false;

            appointment.Status = "Canceled";
            await _patientRepository.UpdateAppointmentAsync(appointment);
            await _patientRepository.SaveChangesAsync();

            return true;
        }
        // get test details
        public async Task<List<PatientTestDetailDto>> GetTestDetails(int userId)
        {
            var patientId = await _patientRepository.GetPatientIdByUserIdAsync(userId);
            return await _patientRepository.GetTestDetailsByPatientIdAsync(patientId);
        }
        // get prescriptons
        public async Task<List<PatientPrescriptionDetailDto>> GetPrescriptionDetails(int userId)
        {
            var patientId = await _patientRepository.GetPatientIdByUserIdAsync(userId);
            return await _patientRepository.GetPrescriptionDetailsByPatientIdAsync(patientId);
        }
        // get bills
        public async Task<List<BillingDto>> GetBillingDetails(int userId)
        {
            var patientId = await _patientRepository.GetPatientIdByUserIdAsync(userId);
            return await _patientRepository.GetBillingDetailsByPatientIdAsync(patientId);
        }
        // reschedule appointment
        //public async Task<(Appointment? appointment, string message)> RescheduleAppointment(int userId, int appointmentId, AppointmentRescheduleDto rescheduleDto)
        //{
        //    var patientId = await _patientRepository.GetPatientIdByUserIdAsync(userId);
        //    var appointment = await _patientRepository.GetAppointmentByIdAndPatientIdAsync(appointmentId, patientId);

        //    if (appointment == null)
        //        return (null, "Appointment not found or unauthorized access.");

        //    var isOnSchedule = await _patientRepository.IsDoctorOnScheduleAsync(appointment.DoctorID, rescheduleDto.NewAppointmentDate);
        //    if (!isOnSchedule)
        //        return (null, "The docotor is not available on chosen date");

        //    appointment.AppointmentDate = rescheduleDto.NewAppointmentDate;
        //    await _patientRepository.UpdateAppointmentAsync(appointment);
        //    await _patientRepository.SaveChangesAsync();

        //    return (appointment, "Appointment rescheduled successfully.");
        //}

        public async Task<(Appointment? appointment, string message)> RescheduleAppointment(int userId, int appointmentId, AppointmentRescheduleDto rescheduleDto)
        {
            var patientId = await _patientRepository.GetPatientIdByUserIdAsync(userId);

            var appointment = await _patientRepository.GetAppointmentByIdAndPatientIdAsync(appointmentId, patientId);

            if (appointment == null)
                return (null, "Appointment not found or unauthorized access.");

            if (appointment.Status != "Requested" && appointment.Status != "Scheduled")
                return (null, "Only requested or scheduled appointments can be rescheduled.");

            var isOnSchedule = await _patientRepository.IsDoctorOnScheduleAsync(appointment.DoctorID, rescheduleDto.NewAppointmentDate);
            if (!isOnSchedule)
                return (null, "The doctor is not available on the chosen date.");

            appointment.AppointmentDate = rescheduleDto.NewAppointmentDate;
            appointment.Status = "Requested";

            await _patientRepository.UpdateAppointmentAsync(appointment);
            await _patientRepository.SaveChangesAsync();

            return (appointment, "Appointment rescheduled successfully and status updated to 'Requested'.");
        }


        public async Task<List<ScheduleDto>> GetDoctorScheduleAsync(int doctorId)
        {
            var schedule = await _patientRepository.GetDoctorScheduleAsync(doctorId);

            return schedule.Select(h => new ScheduleDto
            {
                ScheduleID = h.ScheduleID,
                DoctorID = h.DoctorID,
                StartDate = h.StartDate,
                EndDate = h.EndDate,
            }).ToList();
        }

        public async Task<IEnumerable<PatientBillingDetailsDto>> GetBillsByPatientIdAsync(int userId)
        {
            var patientId = await _patientRepository.GetPatientIdByUserIdAsync(userId);
            var bills = await _patientRepository.GetBillsByPatientIdAsync(patientId);

            return bills.Select(b => new PatientBillingDetailsDto
            {
                BillingID = b.BillingID,
                PatientID = b.PatientID,
                PatientName = b.Patient.FullName, 
                DoctorID = b.Doctor.DoctorID,
                DoctorName = b.Doctor.FullName,
                ConsultationFee = b.ConsultationFee,
                TotalTestsPrice = b.TotalTestsPrice,
                TotalMedicationsPrice = b.TotalMedicationsPrice,
                GrandTotal = b.GrandTotal,
                BillingDate = b.BillingDate,
                Status = b.Status
            }).ToList();
        }

    }
}
