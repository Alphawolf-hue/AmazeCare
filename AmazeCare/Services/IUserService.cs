using AmazeCare.Models;

namespace AmazeCare.Services
{
    public interface IUserService
    {
        Task<User> RegisterAsync(User user);
        Task<User> LoginAsync(string username, string password);
    }
}
