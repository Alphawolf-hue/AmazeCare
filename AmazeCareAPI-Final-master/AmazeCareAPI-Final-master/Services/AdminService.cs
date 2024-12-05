using AmazeCareAPI.Models;
using AmazeCareAPI.Data;
using Microsoft.EntityFrameworkCore;
using AmazeCareAPI.Dtos;
using AmazeCareAPI.Services.Interface;
using AmazeCareAPI.Repositories.Interface;

namespace AmazeCareAPI.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _adminRepository;

        public AdminService(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        public async Task<(bool IsAvailable, string Message)> CheckUsernameAvailabilityAsync(string username)
        {
            bool isAvailable = await _adminRepository.IsUsernameAvailableAsync(username);
            string message = isAvailable ? "Username is available." : "Username is already taken.";
            return (isAvailable, message);
        }

        public async Task<Administrator> RegisterAdmin(string username, string password, string fullName, string email)
        {
            var (isAvailable, message) = await CheckUsernameAvailabilityAsync(username);
            if (!isAvailable) throw new InvalidOperationException(message);

            var user = new User
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                RoleID = 3
            };
            await _adminRepository.CreateUserAsync(user);

            var admin = new Administrator
            {
                UserID = user.UserID,
                FullName = fullName,
                Email = email
            };
            await _adminRepository.CreateAdminAsync(admin);

            return admin;
        }

        public async Task<IEnumerable<SpecializationDto>> GetAllSpecializationsAsync()
        {
            var specializations = await _adminRepository.GetAllSpecializationsAsync();

            return specializations.Select(s => new SpecializationDto
            {
                SpecializationID = s.SpecializationID,
                SpecializationName = s.SpecializationName
            }).ToList();
        }


        public async Task<Doctor> RegisterDoctor(DoctorRegistrationDto doctorDto)
        {
            var (isAvailable, message) = await CheckUsernameAvailabilityAsync(doctorDto.Username);
            if (!isAvailable) throw new InvalidOperationException(message);

            var user = new User
            {
                Username = doctorDto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(doctorDto.Password),
                RoleID = 2
            };
            await _adminRepository.CreateUserAsync(user);

            var doctor = new Doctor
            {
                UserID = user.UserID,
                FullName = doctorDto.FullName,
                Email = doctorDto.Email,
                ExperienceYears = doctorDto.ExperienceYears,
                Qualification = doctorDto.Qualification,
                Designation = doctorDto.Designation
            };
            await _adminRepository.CreateDoctorAsync(doctor, doctorDto.SpecializationIds);

            return doctor;
        }

        public async Task<bool> UpdateDoctorDetails(int doctorId, DoctorUpdateDto doctorDto)
        {
            var doctor = await _adminRepository.GetDoctorWithSpecializationsAsync(doctorId);

            if (doctor == null) return false;

            if (!string.IsNullOrEmpty(doctorDto.FullName)) doctor.FullName = doctorDto.FullName;
            if (!string.IsNullOrEmpty(doctorDto.Email)) doctor.Email = doctorDto.Email;
            if (doctorDto.ExperienceYears.HasValue) doctor.ExperienceYears = doctorDto.ExperienceYears.Value;
            if (!string.IsNullOrEmpty(doctorDto.Qualification)) doctor.Qualification = doctorDto.Qualification;
            if (!string.IsNullOrEmpty(doctorDto.Designation)) doctor.Designation = doctorDto.Designation;

            if (doctorDto.SpecializationIds != null && doctorDto.SpecializationIds.Any())
            {
                await _adminRepository.UpdateDoctorSpecializationsAsync(doctorId, doctorDto.SpecializationIds);
            }

            await _adminRepository.SaveAsync();
            return true;
        }

        public async Task<bool> DeleteDoctor(int userId, int doctorId)
        {
            var doctor = await _adminRepository.GetDoctorByIdAndUserIdAsync(doctorId, userId);
            if (doctor == null) return false;

            doctor.UserID = null;
            doctor.Designation = "Inactive";

            var scheduledAppointments = await _adminRepository.GetScheduledAppointmentsAsync(doctorId);
            foreach (var appointment in scheduledAppointments)
            {
                appointment.Status = "Canceled";
            }

            await _adminRepository.DeleteUserAsync(userId);
            await _adminRepository.SaveAsync();
            return true;
        }

        public async Task<Doctor> GetDoctorDetails(int doctorId)
        {
            return await _adminRepository.GetDoctorByIdAsync(doctorId);
        }

        public async Task<Patient> UpdatePatient(PatientDto patientDto)
        {
            var patient = await _adminRepository.GetPatientByIdAsync(patientDto.PatientID);
            if (patient == null) throw new KeyNotFoundException($"Patient with ID {patientDto.PatientID} not found.");

            if (!string.IsNullOrEmpty(patientDto.FullName)) patient.FullName = patientDto.FullName;
            if (!string.IsNullOrEmpty(patientDto.Email)) patient.Email = patientDto.Email;
            patient.DateOfBirth = patientDto.DateOfBirth;
            if (!string.IsNullOrEmpty(patientDto.ContactNumber)) patient.ContactNumber = patientDto.ContactNumber;
            if (!string.IsNullOrEmpty(patientDto.Address)) patient.Address = patientDto.Address;
            if (!string.IsNullOrEmpty(patientDto.MedicalHistory)) patient.MedicalHistory = patientDto.MedicalHistory;

            await _adminRepository.SaveAsync();
            return patient;
        }

        public async Task<Patient> GetPatientDetails(int patientId)
        {
            var patient = await _adminRepository.GetPatientByIdAsync(patientId);
            if (patient == null) throw new KeyNotFoundException($"Patient with ID {patientId} not found.");
            return patient;
        }


        public async Task<bool> DeletePatient(int userId, int patientId)
        {
            var patient = await _adminRepository.GetPatientByIdAndUserIdAsync(patientId, userId);
            if (patient == null) return false;

            patient.UserID = null;

            var scheduledAppointments = await _adminRepository.GetScheduledAppointmentsByPatientIdAsync(patientId);
            foreach (var appointment in scheduledAppointments)
            {
                appointment.Status = "Canceled";
            }

            await _adminRepository.DeleteUserAsync(userId);
            await _adminRepository.SaveAsync();
            return true;
        }


        public async Task<Appointment> RescheduleAppointment(int appointmentId, AppointmentRescheduleDto rescheduleDto)
        {
            var appointment = await _adminRepository.GetAppointmentWithDoctorByIdAsync(appointmentId);

            if (appointment == null)
                return null;

            bool isOnSchedule = await _adminRepository.IsDoctorOnScheduleAsync(appointment.DoctorID, rescheduleDto.NewAppointmentDate);

            if (!isOnSchedule)
                throw new InvalidOperationException("On new appointment date docotor is not on schedule.");

            appointment.AppointmentDate = rescheduleDto.NewAppointmentDate;
            await _adminRepository.SaveAsync();

            return appointment;
        }

        public async Task<Appointment> ViewAppointmentDetails(int appointmentId)
        {
            return await _adminRepository.GetAppointmentByIdAsync(appointmentId);
        }

        public async Task<IEnumerable<ScheduleWithDoctorDto>> GetSchedulesWithDoctorNameAsync(int doctorId)
        {
            var schedules = await _adminRepository.GetSchedulesWithDoctorDetailsAsync(doctorId);

            return schedules.Select(schedule => new ScheduleWithDoctorDto
            {
                ScheduleID = schedule.ScheduleID,
                DoctorID = schedule.DoctorID,
                DoctorName = schedule.Doctor.FullName,
                StartDate = schedule.StartDate,
                EndDate = schedule.EndDate,
                Status = schedule.Status
            });
        }
        public async Task<bool> UpdateScheduleByAdminAsync(int scheduleId, UpdateScheduleDto updateDto)
        {
            var schedule = await _adminRepository.GetScheduleByIdAsync(scheduleId);

            if (schedule == null)
                return false;

            schedule.StartDate = updateDto.StartDate;
            schedule.EndDate = updateDto.EndDate;
            schedule.Status = "Scheduled";

            await _adminRepository.UpdateScheduleAsync(schedule);
            return true;
        }

        public async Task<bool> CancelScheduleByAdminAsync(int scheduleId)
        {
            var schedule = await _adminRepository.GetScheduleByIdAsync(scheduleId);

            if (schedule == null || schedule.Status == "Completed")
                return false;

            schedule.Status = "Cancelled";
            await _adminRepository.UpdateScheduleAsync(schedule);
            return true;
        }

        public async Task<bool> MarkScheduleAsCompletedAsync(int scheduleId)
        {
            var schedule = await _adminRepository.GetScheduleByIdAsync(scheduleId);

            if (schedule == null || schedule.Status == "Cancelled")
                return false;

            schedule.Status = "Completed";
            await _adminRepository.UpdateScheduleAsync(schedule);

            return true;
        }



        // Method to update an existing schedule for a doctor with validation on DoctorID
        public async Task<bool> UpdateSchedule(int doctorId, int scheduleId, DateTime newStartDate, DateTime newEndDate)
        {
            var schedule = await _adminRepository.GetScheduleByIdAndDoctorIdAsync(scheduleId, doctorId);

            if (schedule == null)
                throw new KeyNotFoundException($"Schedule with ID {scheduleId} not found for Doctor ID {doctorId}.");

            schedule.StartDate = newStartDate;
            schedule.EndDate = newEndDate;

            await _adminRepository.SaveAsync();
            return true;
        }
        public async Task<string> CancelSchedule(int doctorId, int scheduleId)
        {
            var schedule = await _adminRepository.GetScheduleByIdAndDoctorIdAsync(scheduleId, doctorId);

            if (schedule == null)
                throw new KeyNotFoundException($"Schedule with ID {scheduleId} not found for Doctor ID {doctorId}.");

            if (schedule.Status == "Cancelled")
                return "Schedule is already cancelled.";

            if (schedule.Status == "Completed")
                return "Schedule is already completed and cannot be cancelled.";

            schedule.Status = "Cancelled";
            await _adminRepository.SaveAsync();
            return "Schedule cancelled successfully.";
        }

        public async Task<IEnumerable<BillingDetailsDto>> GetBillingDetailsWithNamesAsync()
        {
            var billings = await _adminRepository.GetBillingDetailsWithNamesAsync();

            return billings.Select(b => new BillingDetailsDto
            {
                BillingID = b.BillingID,
                PatientID = b.PatientID,
                PatientName = b.Patient.FullName,
                DoctorID = b.DoctorID,
                DoctorName = b.Doctor.FullName,
                ConsultationFee = b.ConsultationFee,
                TotalTestsPrice = b.TotalTestsPrice,
                TotalMedicationsPrice = b.TotalMedicationsPrice,
                GrandTotal = b.GrandTotal,
                Status = b.Status,
                BillingDate = b.BillingDate
            });
        }
        public async Task<bool> MarkBillAsPaidAsync(int billingId)
        {
            var billing = await _adminRepository.GetBillingByIdAsync(billingId);

            if (billing == null || billing.Status == "Paid")
                return false;

            billing.Status = "Paid";
            await _adminRepository.UpdateBillingAsync(billing);

            return true;
        }

        //tests
        public async Task<IEnumerable<TestDto>> GetAllTestsAsync()
        {
            var tests = await _adminRepository.GetAllTestsAsync();
            return tests.Select(t => new TestDto
            {
                TestID = t.TestID,
                TestName = t.TestName,
                TestPrice = t.TestPrice
            });
        }
        public async Task<bool> AddTestAsync(CreateUpdateTestDto createTestDto)
        {
            var test = new Test
            {
                TestName = createTestDto.TestName,
                TestPrice = createTestDto.TestPrice
            };

            await _adminRepository.AddTestAsync(test);
            return true;
        }

        public async Task<bool> UpdateTestAsync(int testId, CreateUpdateTestDto updateTestDto)
        {
            var test = await _adminRepository.GetTestByIdAsync(testId);
            if (test == null)
                return false;

            test.TestName = updateTestDto.TestName;
            test.TestPrice = updateTestDto.TestPrice;

            await _adminRepository.UpdateTestAsync(test);
            return true;
        }
        public async Task<IEnumerable<MedicationDto>> GetAllMedicationsAsync()
        {
            var medications = await _adminRepository.GetAllMedicationsAsync();
            return medications.Select(m => new MedicationDto
            {
                MedicationID = m.MedicationID,
                MedicationName = m.MedicationName,
                PricePerUnit = m.PricePerUnit
            });
        }

        public async Task<bool> AddMedicationAsync(CreateUpdateMedicationDto createMedicationDto)
        {
            var medication = new Medication
            {
                MedicationName = createMedicationDto.MedicationName,
                PricePerUnit = createMedicationDto.PricePerUnit
            };

            await _adminRepository.AddMedicationAsync(medication);
            return true;
        }

        public async Task<bool> UpdateMedicationAsync(int medicationId, CreateUpdateMedicationDto updateMedicationDto)
        {
            var medication = await _adminRepository.GetMedicationByIdAsync(medicationId);
            if (medication == null)
                return false;

            medication.MedicationName = updateMedicationDto.MedicationName;
            medication.PricePerUnit = updateMedicationDto.PricePerUnit;

            await _adminRepository.UpdateMedicationAsync(medication);
            return true;
        }



    }
}
