using AmazeCare.Controllers;
using AmazeCare.Models;
using AmazeCare.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System.Threading.Tasks;

namespace AmazeCare.Tests
{
    [TestFixture]
    public class UserControllerTests
    {
        private Mock<IUserService> _userServiceMock;
        private UserController _userController;

        [SetUp]
        public void Setup()
        {
            _userServiceMock = new Mock<IUserService>();
            _userController = new UserController(_userServiceMock.Object);
        }

        [Test]
        public async Task Register_ShouldReturnOk_WhenUserIsRegistered()
        {
            // Arrange
            var registerModel = new RegisterModel { Username = "JohnDoe", Password = "password", ConfirmPassword = "password", RoleId = 1 };
            var user = new User { UserID = 1, Username = "JohnDoe" };
            _userServiceMock.Setup(service => service.RegisterAsync(It.IsAny<User>())).ReturnsAsync(user);

            // Act
            var result = await _userController.Register(registerModel);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.AreEqual(new { message = "User registered successfully.", userId = user.UserID }, okResult.Value);
        }

        [Test]
        public async Task Register_ShouldReturnBadRequest_WhenPasswordsDoNotMatch()
        {
            // Arrange
            var registerModel = new RegisterModel { Username = "JohnDoe", Password = "password", ConfirmPassword = "differentpassword", RoleId = 1 };

            // Act
            var result = await _userController.Register(registerModel);

            // Assert
            var badRequestResult = result as BadRequestObjectResult;
            Assert.NotNull(badRequestResult);
            Assert.AreEqual(400, badRequestResult.StatusCode);
            Assert.AreEqual("Passwords do not match.", badRequestResult.Value);
        }

        [Test]
        public async Task Register_ShouldReturnBadRequest_WhenRegistrationFails()
        {
            // Arrange
            var registerModel = new RegisterModel { Username = "JohnDoe", Password = "password", ConfirmPassword = "password", RoleId = 1 };
            _userServiceMock.Setup(service => service.RegisterAsync(It.IsAny<User>())).ReturnsAsync((User)null);

            // Act
            var result = await _userController.Register(registerModel);

            // Assert
            var badRequestResult = result as BadRequestObjectResult;
            Assert.NotNull(badRequestResult);
            Assert.AreEqual(400, badRequestResult.StatusCode);
            Assert.AreEqual("User registration failed.", badRequestResult.Value);
        }
    }
}
