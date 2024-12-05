﻿namespace AmazeCareAPI.Dtos
{
    public class PatientBillingDetailsDto
    {
        public int BillingID { get; set; }
        public int PatientID { get; set; }
        public string PatientName { get; set; }
        public int DoctorID {  get; set; }
        public string DoctorName { get; set; } // Doctor's full name
        public decimal ConsultationFee { get; set; }
        public decimal TotalTestsPrice { get; set; }
        public decimal TotalMedicationsPrice { get; set; }
        public decimal GrandTotal { get; set; }

        public DateTime BillingDate { get; set; }
        public string Status { get; set; }
    }
}
