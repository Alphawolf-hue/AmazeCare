using AmazeCare.Controllers;
using AmazeCare.Models;
using AmazeCare.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AmazeCare.Tests
{
    [TestFixture]
    public class PatientControllerTests
    {
        private Mock<IPatientService> _patientServiceMock;
        private PatientController _patientController;

        [SetUp]
        public void Setup()
        {
            _patientServiceMock = new Mock<IPatientService>();
            _patientController = new PatientController(_patientServiceMock.Object);
        }

        [Test]
        public async Task GetAllPatients_ShouldReturnAllPatients()
        {
            // Arrange
            var patients = new List<Patient> { new Patient { Id = 1, Name = "John Doe" } };
            _patientServiceMock.Setup(service => service.GetAllPatientsAsync()).ReturnsAsync(patients);

            // Act
            var result = await _patientController.GetAllPatients();

            // Assert
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.AreEqual(new { message = "Successfully Retrieved All Patients", data = patients }, okResult.Value);
        }

        [Test]
        public async Task GetPatientById_ShouldReturnPatient_WhenPatientExists()
        {
            // Arrange
            var patient = new Patient { Id = 1, Name = "John Doe" };
            _patientServiceMock.Setup(service => service.GetPatientByIdAsync(It.IsAny<int>())).ReturnsAsync(patient);

            // Act
            var result = await _patientController.GetPatientById(1);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.AreEqual(new { message = "Successfully Retrieved Patient", data = patient }, okResult.Value);
        }

        [Test]
        public async Task GetPatientById_ShouldReturnNotFound_WhenPatientDoesNotExist()
        {
            // Arrange
            _patientServiceMock.Setup(service => service.GetPatientByIdAsync(It.IsAny<int>())).ReturnsAsync((Patient)null);

            // Act
            var result = await _patientController.GetPatientById(1);

            // Assert
            Assert.IsInstanceOf<NotFoundResult>(result);
        }

        [Test]
        public async Task CreatePatient_ShouldReturnCreatedPatient()
        {
            // Arrange
            var patient = new Patient { Id = 1, Name = "John Doe" };
            _patientServiceMock.Setup(service => service.CreatePatientAsync(It.IsAny<Patient>())).ReturnsAsync(patient);

            // Act
            var result = await _patientController.CreatePatient(patient);

            // Assert
            var createdResult = result as CreatedAtActionResult;
            Assert.NotNull(createdResult);
            Assert.AreEqual(201, createdResult.StatusCode);
            Assert.AreEqual(new { message = "Successfully Created", data = patient }, createdResult.Value);
        }

        [Test]
        public async Task UpdatePatient_ShouldReturnOk_WhenPatientIsUpdated()
        {
            // Arrange
            var patient = new Patient { Id = 1, Name = "John Doe" };
            _patientServiceMock.Setup(service => service.UpdatePatientAsync(It.IsAny<Patient>())).ReturnsAsync(patient);

            // Act
            var result = await _patientController.UpdatePatient(1, patient);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            Assert.AreEqual(new { message = "Successfully Updated", data = patient }, okResult.Value);
        }

        [Test]
        public async Task UpdatePatient_ShouldReturnNotFound_WhenPatientDoesNotExist()
        {
            // Arrange
            var patient = new Patient { Id = 1, Name = "John Doe" };
            _patientServiceMock.Setup(service => service.UpdatePatientAsync(It.IsAny<Patient>())).ReturnsAsync((Patient)null);

            // Act
            var result = await _patientController.UpdatePatient(1, patient);

            // Assert
            Assert.IsInstanceOf<NotFoundResult>(result);
        }

        [Test]
        public async Task DeletePatient_ShouldReturnOk_WhenPatientIsDeleted()
        {
            // Arrange
            _patientServiceMock.Setup(service => service.DeletePatientAsync(It.IsAny<int>())).ReturnsAsync(true);

            // Act
            var result = await _patientController.DeletePatient(1);

            // Assert
            var okResult = result as OkObjectResult;
            Assert.NotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
        }

        [Test]
        public async Task DeletePatient_ShouldReturnNotFound_WhenPatientDoesNotExist()
        {
            // Arrange
            _patientServiceMock.Setup(service => service.DeletePatientAsync(It.IsAny<int>())).ReturnsAsync(false);

            // Act
            var result = await _patientController.DeletePatient(1);

            // Assert
            Assert.IsInstanceOf<NotFoundResult>(result);
        }
    }
}
