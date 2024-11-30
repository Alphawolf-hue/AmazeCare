using AmazeCare.Data;
using AmazeCare.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace AmazeCare.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AmazeCareDbContext _context;
        private readonly string _secretKey;
        public UserRepository(AmazeCareDbContext context, IConfiguration configuration)
        {
            _context = context;
            _secretKey = configuration["Jwt:Key"];
        }

        public async Task<bool> ValidateUserCredentialsAsync(string username, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user == null)
                return false;

            // Compare hashed password
            return VerifyPassword(password, user.PasswordHash);
        }

        public async Task<User> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Username.Equals(username, StringComparison.OrdinalIgnoreCase));
        }

        public async Task<bool> RegisterUserAsync(string username, string password, string role)
        {
            var hashedPassword = HashPassword(password, _secretKey);

            var roleId = await GetRoleIdByNameAsync(role);
            if (roleId == null)
            {
                throw new ArgumentException($"Role '{role}' does not exist.");
            }

            var user = new User
            {
                Username = username,
                PasswordHash = hashedPassword,
                RoleId = roleId.Value // Assign the RoleId
            };

            _context.Users.Add(user);
            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<int?> GetRoleIdByNameAsync(string roleName)
        {
            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleName.Equals(roleName, StringComparison.OrdinalIgnoreCase));

            return role?.RoleId;
        }
        private string HashPassword(string password, string key) 
        { 
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key))) 
            { var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)); 
                return Convert.ToBase64String(hash); 
            } 
        }
        private bool VerifyPassword(string password, string storedHash) 
        { 
            var hashedPassword = HashPassword(password, _secretKey);
            return hashedPassword == storedHash;
        }
    }
    
}
