using AmazeCare.Data;
using AmazeCare.Models;
using AmazeCare.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AmazeCare.Services
{
    public class UserService : IUserService
    {
        private readonly AmazeCareDbContext _context;

        public UserService(AmazeCareDbContext context)
        {
            _context = context;
        }

        public async Task<User> RegisterAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> LoginAsync(string username, string password)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Username == username && u.PasswordHash == password);
        }
    }
}
