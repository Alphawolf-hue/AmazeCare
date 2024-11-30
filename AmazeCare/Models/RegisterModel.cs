using System.ComponentModel.DataAnnotations;

namespace AmazeCare.Models
{
    public class RegisterModel
    {
        [Required]
        [StringLength(50, ErrorMessage = "Username must be between 3 and 50 characters.", MinimumLength = 3)]
        public string Username { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [StringLength(100, ErrorMessage = "Password must be at least 6 characters long.", MinimumLength = 6)]
        public string Password { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        public int RoleId { get; set; }
    }
}
