using System.ComponentModel.DataAnnotations;

namespace AmazeCare.Models
{
    public class Prescription
    {
        public int Id { get; set; }

        // Nullable foreign key
        public int? PatientId { get; set; }
        public Patient? Patient { get; set; }
        public int AppointmentId { get; set; }
        public Appointment? Appointment { get; set; }

        public string Medications { get; set; }
    }
}
