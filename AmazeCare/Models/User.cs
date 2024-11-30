using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace AmazeCare.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserID { get; set; }

        [Required]
        [MaxLength(100)]
        public string Username { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [ForeignKey(nameof(Role))]
        public int RoleId { get; set; }
        public Role Role { get; set; } // Navigation property
    }
}
