using AmazeCare.Dtos;
using AmazeCare.Models;
using AmazeCare.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AmazeCare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowAllOrigins")]
    public class AuthController : ControllerBase
    {
        private readonly AuthenticationService _authenticationService;

        public AuthController(AuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        // Login endpoint to authenticate user and generate a token
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            if (login == null || string.IsNullOrEmpty(login.Username) || string.IsNullOrEmpty(login.Password))
            {
                return BadRequest("Username and password are required.");
            }

            // Authenticate the user and generate the token
            var token = await _authenticationService.AuthenticateUserAsync(login.Username, login.Password);
            if (token == null)
            {
                return Unauthorized(); // Authentication failed
            }

            return Ok(new { Token = token }); // Return the JWT token
        }
    }
}