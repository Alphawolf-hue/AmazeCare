import React, { useState } from "react";
import { Form, Button, Spinner, Alert, InputGroup } from "react-bootstrap";
import { checkUsernameAvailability, registerAdmin } from "../../api/admin/adminAPI";
import { FaUser, FaLock, FaEnvelope, FaCheckCircle, FaTimesCircle ,FaUserShield } from "react-icons/fa";

const RegisterAdmin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
  });

  const [usernameMessage, setUsernameMessage] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const [passwordCriteria, setPasswordCriteria] = useState({
    hasUppercase: false,
    hasSpecialChar: false,
    hasMinLength: false,
  });

  const [emailValid, setEmailValid] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      validatePassword(value);
    }

    if (name === "email") {
      validateEmail(value);
    }
  };

  const validatePassword = (password) => {
    setPasswordCriteria({
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*]/.test(password),
      hasMinLength: password.length >= 8,
    });
  };

  const validateEmail = (email) => {
    setEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  };

  const handleCheckUsername = async () => {
    try {
      setLoading(true);
      const availability = await checkUsernameAvailability(formData.username);
      setUsernameAvailable(availability.isAvailable);
      setUsernameMessage(availability.message);
    } catch (error) {
      setUsernameAvailable(false);
      setUsernameMessage("Error checking username availability.");
    } finally {
      setLoading(false);
    }

    setTimeout(() => setUsernameMessage(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Object.values(passwordCriteria).every(Boolean)) {
      setAlertMessage("Password does not meet the required criteria.");
      setAlertType("danger");
      return;
    }

    if (!emailValid) {
      setAlertMessage("Please enter a valid email.");
      setAlertType("danger");
      return;
    }

    setRegisterLoading(true);
    try {
      await registerAdmin(formData);
      setAlertMessage("Admin registered successfully!");
      setAlertType("success");
      setFormData({
        username: "",
        password: "",
        fullName: "",
        email: "",
      });
      setUsernameAvailable(null);
      setPasswordCriteria({
        hasUppercase: false,
        hasSpecialChar: false,
        hasMinLength: false,
      });
      setEmailValid(false);
    } catch (error) {
      setAlertMessage("Error registering admin. Please try again.");
      setAlertType("danger");
    } finally {
      setRegisterLoading(false);
      setTimeout(() => setAlertMessage(null), 2000); // Hide alert after 2 seconds
    }
  };

  return (
    <div className="container text-dark mt-5 min-vh-100">
      <h2 className="text-dark"><FaUserShield className="me-3"/>Register New Admin</h2>

      {alertMessage && (
        <Alert variant={alertType} onClose={() => setAlertMessage(null)} dismissible>
          {alertMessage}
        </Alert>
      )}
            <hr class="border border-dark border-1 opacity-100"></hr>


      <Form onSubmit={handleSubmit}>
        {/* Username */}
        <Form.Group className="mb-3">
          <Form.Label className="h6">Username</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <FaUser />
            </InputGroup.Text>
            <Form.Control
              type="text"
              name="username"
              className="bg-light border-dark-subtle"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <Button
              variant="dark"
              onClick={handleCheckUsername}
              disabled={!formData.username || loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "Check Availability"}
            </Button>
          </InputGroup>
          {usernameMessage && (
            <div
              className={` fst-italic mt-2 text-${usernameAvailable ? "success" : "danger"}`}
              style={{ fontSize: "0.9rem" }}
            >
              {usernameMessage}
            </div>
          )}
        </Form.Group>

        {/* Password */}
        <Form.Group className="mb-3">
          <Form.Label className="h6">Password</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <FaLock />
            </InputGroup.Text>
            <Form.Control
              type="password"
              name="password"
              className="bg-light border-dark-subtle"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <ul className="mt-2 fst-italic" style={{ fontSize: "0.9rem" }}>
            <li className={passwordCriteria.hasUppercase ? "text-success" : "text-danger"}>
              {passwordCriteria.hasUppercase ? <FaCheckCircle /> : <FaTimesCircle />} At least one uppercase letter
            </li>
            <li className={passwordCriteria.hasSpecialChar ? "text-success" : "text-danger"}>
              {passwordCriteria.hasSpecialChar ? <FaCheckCircle /> : <FaTimesCircle />} At least one special character
            </li>
            <li className={passwordCriteria.hasMinLength ? "text-success" : "text-danger"}>
              {passwordCriteria.hasMinLength ? <FaCheckCircle /> : <FaTimesCircle />} Minimum 8 characters
            </li>
          </ul>
        </Form.Group>

        {/* Full Name */}
        <Form.Group className="mb-3">
          <Form.Label className="h6">Full Name</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <FaUser />
            </InputGroup.Text>
            <Form.Control
              type="text"
              name="fullName"
              className="bg-light border-dark-subtle"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </Form.Group>

        {/* Email */}
        <Form.Group className="mb-3">
          <Form.Label className="h6">Email</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <FaEnvelope />
            </InputGroup.Text>
            <Form.Control
              type="email"
              name="email"
              className="bg-light border-dark-subtle"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <div
            className={`fst-italic mt-2 ${emailValid ? "text-success" : "text-danger"}`}
            style={{ fontSize: "0.9rem" }}
          >
            {emailValid ? "Valid email format." : "Invalid email format."}
          </div>
        </Form.Group>

        {/* Submit Button */}
        <Button variant="dark" className="rounded-pill fst-italic" type="submit" disabled={registerLoading}>
          {registerLoading ? <Spinner animation="border" size="sm" /> : "Register Admin"}
        </Button>
      </Form>
    </div>
  );
};

export default RegisterAdmin;
