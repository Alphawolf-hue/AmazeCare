using AmazeCare.Dtos;
using Microsoft.AspNetCore.Identity;

namespace AmazeCare.Services
{
    public interface IAuthenticationService
    {
        Task<string> GenerateJwtToken(string username); 
        Task<bool> ValidateUserCredentials(string username, string password);
    }
}
