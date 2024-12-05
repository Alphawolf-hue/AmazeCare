﻿using AmazeCareAPI.Dtos;
using AmazeCareAPI.Models;
using AmazeCareAPI.Services;
using AmazeCareAPI.Services.Interface;
using Microsoft.AspNetCore.Mvc;


namespace AmazeCareAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("check-username")]
        public async Task<IActionResult> CheckUsernameAvailability([FromQuery] string username)
        {
            var (isAvailable, message) = await _userService.CheckUsernameAvailabilityAsync(username);
            return Ok(new { Username = username, IsAvailable = isAvailable, Message = message });
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterPatient([FromBody] PatientRegistrationDto registrationDto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid registration details provided.");
            // if username not available break 
            var (isAvailable, message) = await _userService.CheckUsernameAvailabilityAsync(registrationDto.Username);
            if (!isAvailable)
                return BadRequest(message); 

            var user = new User
            {
                Username = registrationDto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registrationDto.Password),
                RoleID = 1 
            };

            try
            {
                var patient = await _userService.RegisterPatient(user, registrationDto.FullName, registrationDto.Email,
                    registrationDto.DateOfBirth, registrationDto.Gender, registrationDto.ContactNumber,
                    registrationDto.Address, registrationDto.MedicalHistory);

                return CreatedAtAction(nameof(RegisterPatient), new { id = patient.PatientID }, patient);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}