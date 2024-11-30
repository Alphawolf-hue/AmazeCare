using AmazeCare.Models;
using Microsoft.AspNetCore.Identity;

namespace AmazeCare.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetUserByUsernameAsync(string username);
        Task<bool> ValidateUserCredentialsAsync(string username, string password);
        Task<bool> RegisterUserAsync(string username, string password, string role);
        Task<int?> GetRoleIdByNameAsync(string roleName);
    }
}
