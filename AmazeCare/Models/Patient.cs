namespace AmazeCare.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string ContactInfo { get; set; }
        public int? UserId { get; set; }
        public User? User { get; set; }
        public List<Appointment>? Appointments { get; set; }
        public List<Prescription>? Prescriptions { get; set; }
    }
}
