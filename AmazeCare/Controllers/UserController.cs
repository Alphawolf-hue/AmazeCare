using AmazeCare.Dtos;
using AmazeCare.Models;
using AmazeCare.Services;
using AmazeCare.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace AmazeCare.Controllers
{
    [EnableCors("AllowAllOrigins")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // Register User
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel registerModel)
        {
            if (registerModel == null)
            {
                return BadRequest("Invalid data.");
            }
            if (registerModel.Password != registerModel.ConfirmPassword)
            {
                return BadRequest("Passwords do not match.");
            }
            // Map RegisterModel to User
            var user = new User
            {
                Username = registerModel.Username,
              
                PasswordHash = registerModel.Password, 
                
                RoleId=registerModel.RoleId,
            };

            var result = await _userService.RegisterAsync(user);

            if (result == null)
            {
                return BadRequest("User registration failed.");
            }

            return Ok(new { message = "User registered successfully.", userId = result.UserID});
        }
    }
}
