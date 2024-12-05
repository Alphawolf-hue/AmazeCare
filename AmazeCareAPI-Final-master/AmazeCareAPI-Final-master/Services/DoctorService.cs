using AmazeCareAPI.Data;
using AmazeCareAPI.Dtos;
using AmazeCareAPI.Models;
using AmazeCareAPI.Repositories.Interface;
using AmazeCareAPI.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace AmazeCareAPI.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly IDoctorRepository _doctorRepository;

        public DoctorService(IDoctorRepository doctorRepository)
        {
            _doctorRepository = doctorRepository;
        }

        public async Task<int?> GetDoctorIdAsync(int userId)
        {
            return await _doctorRepository.GetDoctorIdByUserIdAsync(userId);
        }


        public async Task<List<AppointmentWithPatientDto>> GetAppointmentsByStatus(int doctorId, string status)
        {
            return await _doctorRepository.GetAppointmentsByStatusAsync(doctorId, status);
        }

        public async Task<bool> ApproveAppointmentRequest(int doctorId, int appointmentId)
        {
            // Fetch the appointment based on the doctor ID and appointment ID
            var appointment = await _doctorRepository.GetRequestedAppointmentAsync(doctorId, appointmentId);
            if (appointment == null)
                return false; // Return false if the appointment is not found or not in the "Requested" state

            // Update the appointment status to "Scheduled"
            appointment.Status = "Scheduled";
            await _doctorRepository.UpdateAppointmentAsync(appointment);

            return true; // Indicate success
        }

        public async Task<bool> CancelScheduledAppointment(int doctorId, int appointmentId)
        {
            var appointment = await _doctorRepository.GetScheduledAppointmentAsync(doctorId, appointmentId);
            if (appointment == null)
                return false;

            appointment.Status = "Canceled";
            await _doctorRepository.UpdateAppointmentAsync(appointment);

            return true;
        }

        public async Task<bool> UpdateMedicalRecord(int doctorId, int recordId, int patientId, UpdateMedicalRecordDto updateDto)
        {
            var medicalRecord = await _doctorRepository.GetMedicalRecordAsync(doctorId, recordId, patientId);
            if (medicalRecord == null)
                return false;
            if (!string.IsNullOrEmpty(updateDto.Symptoms))
                medicalRecord.Symptoms = updateDto.Symptoms;

            if (!string.IsNullOrEmpty(updateDto.PhysicalExamination))
                medicalRecord.PhysicalExamination = updateDto.PhysicalExamination;

            if (!string.IsNullOrEmpty(updateDto.TreatmentPlan))
                medicalRecord.TreatmentPlan = updateDto.TreatmentPlan;

            if (updateDto.FollowUpDate.HasValue)
                medicalRecord.FollowUpDate = updateDto.FollowUpDate.Value;

            await _doctorRepository.UpdateMedicalRecordAsync(medicalRecord);
            return true;
        }
        public async Task<ConductConsultationResponseDto> ConductConsultation(int doctorId, int appointmentId, CreateMedicalRecordDto recordDto, decimal consultationFee)
        {
            
            var appointment = await _doctorRepository.GetScheduledAppointmentAsync(doctorId, appointmentId);
            if (appointment == null || appointment.Status != "Scheduled")
                return null;

            
            var medicalRecord = new MedicalRecord
            {
                AppointmentID = appointment.AppointmentID,
                DoctorID = doctorId,
                PatientID = appointment.PatientID,
                Symptoms = recordDto.Symptoms,
                PhysicalExamination = recordDto.PhysicalExamination,
                TreatmentPlan = recordDto.TreatmentPlan,
                FollowUpDate = recordDto.FollowUpDate,
                TotalPrice = 0
            };

            await _doctorRepository.AddMedicalRecordAsync(medicalRecord);

            decimal totalTestsPrice = 0;
            decimal totalMedicationsPrice = 0;

            // Add Tests 
            if (recordDto.TestIDs != null && recordDto.TestIDs.Any())
            {
                var selectedTests = await _doctorRepository.GetTestsByIdsAsync(recordDto.TestIDs);
                var medicalRecordTests = selectedTests.Select(test => new MedicalRecordTest
                {
                    RecordID = medicalRecord.RecordID,
                    TestID = test.TestID
                }).ToList();

                await _doctorRepository.AddMedicalRecordTestsAsync(medicalRecordTests);
                totalTestsPrice = selectedTests.Sum(t => t.TestPrice);
                medicalRecord.TotalPrice += totalTestsPrice;
            }

            // Add Prescription
            var prescriptions = new List<Prescription>();
            if (recordDto.Prescriptions != null && recordDto.Prescriptions.Any())
            {
                foreach (var prescriptionDto in recordDto.Prescriptions)
                {
                    var medication = await _doctorRepository.GetMedicationByIdAsync(prescriptionDto.MedicationID);
                    if (medication != null)
                    {
                        var prescription = new Prescription
                        {
                            RecordID = medicalRecord.RecordID,
                            MedicationID = prescriptionDto.MedicationID,
                            Dosage = prescriptionDto.Dosage,
                            DurationDays = prescriptionDto.DurationDays,
                            Quantity = prescriptionDto.Quantity,
                            TotalPrice = medication.PricePerUnit * prescriptionDto.Quantity,
                            MedicationName = medication.MedicationName
                        };
                        prescriptions.Add(prescription);
                        totalMedicationsPrice += prescription.TotalPrice;
                    }
                }
                await _doctorRepository.AddPrescriptionsAsync(prescriptions);
                medicalRecord.TotalPrice += totalMedicationsPrice;
            }

            await _doctorRepository.UpdateMedicalRecordTotalPriceAsync(medicalRecord);

            // Create Bill 
            var billing = new Billing
            {
                PatientID = appointment.PatientID,
                DoctorID = doctorId,
                MedicalRecordID = medicalRecord.RecordID,
                ConsultationFee = consultationFee,
                TotalTestsPrice = totalTestsPrice,
                TotalMedicationsPrice = totalMedicationsPrice,
                GrandTotal = consultationFee + totalTestsPrice + totalMedicationsPrice,
                Status = "Pending",
                BillingDate = DateTime.Now,
            };
            // get billing just egenrated
            await _doctorRepository.AddBillingAsync(billing);
            //update medical records billinID
            medicalRecord.BillingID = billing.BillingID;
            await _doctorRepository.UpdateBillingAsync(billing);
            // update prescriptoin billing id
            foreach (var prescription in prescriptions)
            {
                prescription.BillingID = billing.BillingID;
            }

            await _doctorRepository.UpdatePrescriptionBillingIdsAsync(prescriptions);

            // Update the appointment status
            appointment.Status = "Completed";
            await _doctorRepository.UpdateAppointmentAsync(appointment);
            // Prepare the Response DTO
            var response = new ConductConsultationResponseDto
            {
                RecordID = medicalRecord.RecordID,
                BillingDetails = new BillingDto
                {
                    BillingID = billing.BillingID,
                    ConsultationFee = billing.ConsultationFee,
                    TotalTestsPrice = billing.TotalTestsPrice,
                    TotalMedicationsPrice = billing.TotalMedicationsPrice,
                    GrandTotal = billing.GrandTotal,
                    Status = billing.Status,
                    BillingDate = DateTime.Now
                }
            };

            return response;
        }

       
        public async Task<List<PatientMedicalRecordDto>> GetMedicalRecordsByPatientIdAsync(int patientId)
        {
            var records = await _doctorRepository.GetAppointmentsWithMedicalRecordsAndDetailsAsync(patientId);

            var result = records.Select(a => new PatientMedicalRecordDto
            {
                MedicalRecordID = a.MedicalRecord?.RecordID,
                AppointmentDate = a.AppointmentDate,
                DoctorName = a.Doctor?.FullName, 
                Symptoms = a.MedicalRecord?.Symptoms, 
                PhysicalExamination = a.MedicalRecord?.PhysicalExamination, 
                TreatmentPlan = a.MedicalRecord?.TreatmentPlan, 
                FollowUpDate = a.MedicalRecord?.FollowUpDate, 
                Tests = a.MedicalRecord?.MedicalRecordTests?.Select(mt => new TestDto
                {
                    TestName = mt.Test?.TestName, 
                    TestPrice = mt.Test.TestPrice 
                }).ToList() ?? new List<TestDto>(), 
                Prescriptions = a.MedicalRecord?.Prescriptions?.Select(p => new PrescriptionDto
                {
                    MedicationName = p.MedicationName,
                    Dosage = p.Dosage,
                    DurationDays = p.DurationDays,
                    Quantity = p.Quantity
                }).ToList() ?? new List<PrescriptionDto>(),
                BillingDetails = a.MedicalRecord?.Billing != null ? new BillingDto
                {
                    BillingID = a.MedicalRecord.Billing.BillingID,
                    ConsultationFee = a.MedicalRecord.Billing.ConsultationFee,
                    TotalTestsPrice = a.MedicalRecord.Billing.TotalTestsPrice,
                    TotalMedicationsPrice = a.MedicalRecord.Billing.TotalMedicationsPrice,
                    GrandTotal = a.MedicalRecord.Billing.GrandTotal,
                    Status = a.MedicalRecord.Billing.Status,
                    BillingDate = a.MedicalRecord.Billing.BillingDate
                } : null
            }).ToList();

            return result;
        }

       

        public async Task<bool> UpdateBillingStatusAsync(int billingId, int doctorId)
        {
            var billing = await _doctorRepository.GetBillingByIdAndDoctorIdAsync(billingId, doctorId);

            if (billing == null || billing.Status == "Paid")
                return false;

            billing.Status = "Paid";
            await _doctorRepository.UpdateBillingAsync(billing);
            return true;
        }
        public async Task<List<TestDto>> GetTestsAsync()
        {
            return await _doctorRepository.GetAllTestsAsync();
        }
        public async Task<List<MedicationDto>> GetMedicationsAsync()
        {
            return await _doctorRepository.GetAllMedicationsAsync();
        }
        public async Task<bool> AddScheduleAsync(int doctorId, CreateScheduleDto scheduleDto)
        {
            var schedule = new DoctorSchedule
            {
                DoctorID = doctorId,
                StartDate = scheduleDto.StartDate,
                EndDate = scheduleDto.EndDate,
                Status = "Scheduled"
            };

            await _doctorRepository.AddScheduleAsync(schedule);
            return true;
        }
        public async Task<bool> UpdateScheduleAsync(int scheduleId, int doctorId, UpdateScheduleDto updateDto)
        {
            var schedule = await _doctorRepository.GetScheduleByIdAndDoctorIdAsync(scheduleId, doctorId);

            if (schedule == null)
                return false;

            schedule.StartDate = updateDto.StartDate;
            schedule.EndDate = updateDto.EndDate;
            schedule.Status = updateDto.Status;

            await _doctorRepository.UpdateScheduleAsync(schedule);
            return true;
        }
        public async Task<IEnumerable<ScheduleDto>> GetSchedulesAsync(int doctorId)
        {
            return await _doctorRepository.GetSchedulesByDoctorIdAsync(doctorId);
        }
        public async Task<bool> CancelScheduleAsync(int scheduleId, int doctorId)
        {
            var schedule = await _doctorRepository.GetScheduleByIdAndDoctorIdAsync(scheduleId, doctorId);

            if (schedule == null || schedule.Status == "Completed")
                return false;

            schedule.Status = "Cancelled";
            await _doctorRepository.UpdateScheduleAsync(schedule);
            return true;
        }
        public async Task<bool> CompleteScheduleAsync(int scheduleId, int doctorId)
        {
            var schedule = await _doctorRepository.GetScheduleByIdAndDoctorIdAsync(scheduleId, doctorId);

            if (schedule == null || schedule.Status == "Cancelled")
                return false;

            schedule.Status = "Completed";
            await _doctorRepository.UpdateScheduleAsync(schedule);
            return true;
        }


        public async Task<(bool Success, string Message)> RescheduleAppointmentAsync(int doctorId, int appointmentId, AppointmentRescheduleDto rescheduleDto)
        {
            var appointment = await _doctorRepository.GetAppointmentByIdAndDoctorIdAsync(appointmentId, doctorId);

            if (appointment == null)
                return (false, "Appointment not found or unauthorized access.");

            if (rescheduleDto.NewAppointmentDate <= DateTime.Now)
                return (false, "The new appointment date and time must be in the future.");

            bool isOnSchedule = await _doctorRepository.IsOnScheduleAsync(doctorId, rescheduleDto.NewAppointmentDate);

            if (!isOnSchedule)
                return (false, "The new appointment date conflicts with the doctor's .");

            appointment.AppointmentDate = rescheduleDto.NewAppointmentDate;
            await _doctorRepository.UpdateAppointmentAsync(appointment);

            return (true, "Appointment rescheduled successfully.");
        }

        public async Task<IEnumerable<DoctorBillingDetailsDto>> GetBillsByDoctorIdAsync(int doctorId)
        {
            var bills = await _doctorRepository.GetBillsByDoctorIdAsync(doctorId);

            return bills.Select(b => new DoctorBillingDetailsDto
            {
                BillingID = b.BillingID,
                DoctorID = b.DoctorID,
                DoctorName = b.Doctor.FullName, 
                PatientID= b.PatientID,
                PatientName = b.Patient.FullName, 
                ConsultationFee = b.ConsultationFee,
                TotalTestsPrice = b.TotalTestsPrice,
                TotalMedicationsPrice = b.TotalMedicationsPrice,
                GrandTotal = b.GrandTotal,
                Status = b.Status,
                BillingDate = b.BillingDate
            }).ToList();
        }


    }
}
