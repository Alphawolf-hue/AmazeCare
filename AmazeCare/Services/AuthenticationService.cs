using AmazeCare.Data;
using AmazeCare.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace AmazeCare.Services
{
    public class AuthenticationService
    {
        private readonly AmazeCareDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthenticationService(AmazeCareDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Authenticate user by validating username and password directly with the database
        public async Task<string> AuthenticateUserAsync(string username, string password)
        {
            // Fetch user by username
            var user = await _context.Users.Include(u => u.Role)
                                          .FirstOrDefaultAsync(u => u.Username == username);

            // Check if the user exists and password matches
            if (user == null || user.PasswordHash != password) // Compare plaintext password
            {
                return null; // Authentication failed
            }

            // Generate JWT token after successful authentication
            var token = GenerateJwtToken(user);
            return token;
        }

        // Generate JWT token with user details and role name
        private string GenerateJwtToken(User user)
        {
            // Add claims for user details and role
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserID.ToString()), // User ID
                new Claim(ClaimTypes.Name, user.Username),                      // Username
                new Claim(ClaimTypes.Role, user.Role.RoleName)                   // Role name
            };

            // Key and credentials for signing the token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Create the JWT token
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1), // Token expires in 1 hour
                signingCredentials: creds);

            // Return the token as a string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}