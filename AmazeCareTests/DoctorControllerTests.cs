using AmazeCare.Controllers;
using AmazeCare.Models;
using AmazeCare.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AmazeCareTests
{
    [TestFixture]
    public class DoctorControllerTests
    {
        private Mock<IDoctorService> _doctorServiceMock;
        private DoctorController _doctorController;

        [SetUp]
        public void Setup()
        {
            _doctorServiceMock = new Mock<IDoctorService>();
            _doctorController = new DoctorController(_doctorServiceMock.Object);
        }

        [Test]
        public async Task GetAllDoctors_ShouldReturnAllDoctors()
        {
            // Arrange
            var doctors = new List<Doctor> { new Doctor { Id = 1, Name = "Ricard Pruna" , Specialization="Physio" } };
            _doctorServiceMock.Setup(service => service.GetAllDoctorsAsync()).ReturnsAsync(doctors);

            // Act
            var result = await _doctorController.GetAllDoctors();

            // Assert
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.AreEqual(doctors, okResult.Value);
        }

        [Test]
        public async Task GetDoctorById_ShouldReturnDoctor_WhenDoctorExists()
        {
            // Arrange
            var doctor = new Doctor { Id = 1, Name = "Ricard Pruna" ,Specialization= "Physio" };
            _doctorServiceMock.Setup(service => service.GetDoctorByIdAsync(It.IsAny<int>())).ReturnsAsync(doctor);

            // Act
            var result = await _doctorController.GetDoctorById(1);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.AreEqual(doctor, ((dynamic)okResult.Value));
        }

        [Test]
        public async Task GetDoctorById_ShouldReturnNotFound_WhenDoctorDoesNotExist()
        {
            // Arrange
            _doctorServiceMock.Setup(service => service.GetDoctorByIdAsync(It.IsAny<int>())).ReturnsAsync((Doctor)null);

            // Act
            var result = await _doctorController.GetDoctorById(1);

            // Assert
            Assert.IsInstanceOf<NotFoundObjectResult>(result);
        }

        [Test]
        public async Task CreateDoctor_ShouldReturnCreatedDoctor()
        {
            // Arrange
            var doctor = new Doctor { Id = 1, Name = "Dr. John Doe" };
            _doctorServiceMock.Setup(service => service.CreateDoctorAsync(It.IsAny<Doctor>())).ReturnsAsync(doctor);

            // Act
            var result = await _doctorController.CreateDoctor(doctor);

            // Assert
            var createdResult = result as CreatedAtActionResult;
            Assert.NotNull(createdResult);
            Assert.AreEqual(201, createdResult.StatusCode);
            Assert.AreEqual(doctor, ((dynamic)createdResult.Value));
        }

        [Test]
        public async Task UpdateDoctor_ShouldReturnOk_WhenDoctorIsUpdated()
        {
            // Arrange
            var doctor = new Doctor { Id = 1, Name = "Dr. John Doe" };
            _doctorServiceMock.Setup(service => service.UpdateDoctorAsync(It.IsAny<Doctor>())).ReturnsAsync(doctor);

            // Act
            var result = await _doctorController.UpdateDoctor(1, doctor);

            // Assert
            var okResult = result as NoContentResult;
            Assert.NotNull(okResult);
            Assert.AreEqual(204, okResult.StatusCode);
        }

        [Test]
        public async Task UpdateDoctor_ShouldReturnNotFound_WhenDoctorDoesNotExist()
        {
            // Arrange
            var doctor = new Doctor { Id = 1, Name = "Dr. John Doe" };
            _doctorServiceMock.Setup(service => service.UpdateDoctorAsync(It.IsAny<Doctor>())).ReturnsAsync((Doctor)null);

            // Act
            var result = await _doctorController.UpdateDoctor(1, doctor);

            // Assert
            Assert.IsInstanceOf<NotFoundResult>(result);
        }

        [Test]
        public async Task DeleteDoctor_ShouldReturnNoContent_WhenDoctorIsDeleted()
        {
            // Arrange
            _doctorServiceMock.Setup(service => service.DeleteDoctorAsync(It.IsAny<int>())).ReturnsAsync(true);

            // Act
            var result = await _doctorController.DeleteDoctor(1);

            // Assert
            var noContentResult = result as NoContentResult;
            Assert.NotNull(noContentResult);
            Assert.AreEqual(204, noContentResult.StatusCode);
        }

        [Test]
        public async Task DeleteDoctor_ShouldReturnNotFound_WhenDoctorDoesNotExist()
        {
            // Arrange
            _doctorServiceMock.Setup(service => service.DeleteDoctorAsync(It.IsAny<int>())).ReturnsAsync(false);

            // Act
            var result = await _doctorController.DeleteDoctor(1);

            // Assert
            Assert.IsInstanceOf<NotFoundResult>(result);
        }
    }
}
