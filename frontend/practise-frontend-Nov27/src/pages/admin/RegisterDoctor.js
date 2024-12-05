import React, { useEffect, useState } from 'react';
import { checkUsernameAvailability, getAllSpecializations, registerDoctor } from '../../api/admin/adminAPI';
import { Alert, Form, Button, Spinner, Badge, InputGroup } from 'react-bootstrap';
import { FaUser, FaKey, FaEnvelope, FaBriefcase, FaUniversity, FaStethoscope, FaPlus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { FaUserDoctor } from "react-icons/fa6";


const RegisterDoctor = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    experienceYears: '',
    qualification: '',
    designation: '',
    specializationIds: [],
  });
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  const [usernameMessage, setUsernameMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(false);

  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUppercase: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const data = await getAllSpecializations();
        setSpecializations(data);
      } catch (error) {
        console.error('Error fetching specializations:', error);
      }
    };
    fetchSpecializations();
  }, []);

  const validatePassword = (password) => {
    const validations = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
    };
    setPasswordValidations(validations);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const addSpecialization = () => {
    if (!selectedSpecialization) return;

    const specializationId = Number(selectedSpecialization);
    if (!formData.specializationIds.includes(specializationId)) {
      setFormData({
        ...formData,
        specializationIds: [...formData.specializationIds, specializationId],
      });
    }
  };

  const removeSpecialization = (id) => {
    setFormData({
      ...formData,
      specializationIds: formData.specializationIds.filter((specId) => specId !== id),
    });
  };

  const checkUsername = async () => {
    if (!formData.username.trim()) {
      setUsernameMessage('Please enter a username.');
      return;
    }

    try {
      const { isAvailable, message } = await checkUsernameAvailability(formData.username);
      setUsernameMessage(message);
      setUsernameAvailable(isAvailable);
      setTimeout(() => setUsernameMessage(''), 2000);
    } catch (error) {
      console.error('Error checking username:', error);
      
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await registerDoctor(formData);
      setAlertMessage('Doctor registered successfully!');
      setAlertType('success');
      setFormData({
        username: '',
        password: '',
        fullName: '',
        email: '',
        experienceYears: '',
        qualification: '',
        designation: '',
        specializationIds: [],
      });
    } catch (error) {
      setAlertMessage(error.response?.data || 'Failed to register doctor.');
      setAlertType('danger');
    } finally {
      setLoading(false);
      setTimeout(() => setAlertMessage(''), 4000);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className='text-dark'><FaUserDoctor className='me-3'/>Register a Doctor</h2>
      <hr class="border border-dark border-1 opacity-100"></hr>

      {alertMessage && (
        <Alert variant={alertType} className="mt-3">
          {alertMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} className="mt-4">
        {/* Username Field */}
        <Form.Group className="mb-3 ">
          <Form.Label className='h6'>Username</Form.Label>
          <InputGroup>
            <InputGroup.Text ><FaUser /></InputGroup.Text>
            <Form.Control
              type="text"
              name="username"
              className='border-dark bg-light text-dark rounded-3'
              value={formData.username}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <Button variant="dark" className="mt-2 fst-italic rounded-pill" onClick={checkUsername}>
            Check Availability
          </Button>
          {usernameMessage && <div 
          className={`mt-2 text-${usernameAvailable ? "success" : "danger"}`}
          style={{ fontSize: "0.9rem" }}>{usernameMessage}</div>}
        </Form.Group>

        {/* Password Field */}
        <Form.Group className="mb-3">
          <Form.Label className='h6'>Password</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaKey /></InputGroup.Text>
            <Form.Control
              type="password"
              name="password"
              className='border-dark bg-light text-dark rounded-3'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <ul className="list-unstyled mt-2">
            {Object.entries(passwordValidations).map(([key, isValid]) => (
              <li key={key} className={` fst-italic text-${isValid ? 'success' : 'danger'}`}>
                {isValid ? <FaCheckCircle /> : <FaTimesCircle />}{" "}
                {key === 'minLength' && "At least 8 characters"}
                {key === 'hasUppercase' && "At least one uppercase letter"}
                {key === 'hasSpecialChar' && "At least one special character"}
              </li>
            ))}
          </ul>
        </Form.Group>

        {/* Email Field */}
        <Form.Group className="mb-3">
          <Form.Label className='h6'>Email</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaEnvelope /></InputGroup.Text>
            <Form.Control
              type="email"
              name="email"
              className='border-dark bg-light text-dark rounded-3'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </Form.Group>

        {/* Other Fields */}
        <Form.Group className="mb-3">
          <Form.Label className='h6'>Full Name</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaUser /></InputGroup.Text>
            <Form.Control
              type="text"
              name="fullName"
              className='border-dark bg-light text-dark rounded-3'
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className='h6'>Years of Experience</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaBriefcase /></InputGroup.Text>
            <Form.Control
              type="number"
              name="experienceYears"
              className='border-dark bg-light text-dark rounded-3'
              value={formData.experienceYears}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className='h6'>Qualification</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaUniversity /></InputGroup.Text>
            <Form.Control
              type="text"
              name="qualification"
              className='border-dark bg-light text-dark rounded-3'
              value={formData.qualification}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className='h6'>Designation</Form.Label>
          <InputGroup>
            <InputGroup.Text><FaStethoscope /></InputGroup.Text>
            <Form.Control
              type="text"
              name="designation"
              className='border-dark bg-light text-dark rounded-3'
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </Form.Group>

        {/* Specializations */}
        <Form.Group className="mb-3 ">
          <Form.Label className='h6'>Specializations</Form.Label>
          <div className="d-flex align-items-center rounded-3 border-dark">
            <Form.Select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
            >
              <option value="">Select a specialization</option>
              {specializations.map((spec) => (
                <option key={spec.specializationID} value={spec.specializationID}>
                  {spec.specializationName}
                </option>
              ))}
            </Form.Select>
            <Button variant="dark" className="ms-3"  size="sm" onClick={addSpecialization}>
              <FaPlus />Add
            </Button>
          </div>
          <div className="mt-3">
            {formData.specializationIds.map((id) => {
              const spec = specializations.find((spec) => spec.specializationID === id);
              return (
                <Badge key={id} pill bg="dark" className="me-3 text-light ">
                  {spec?.specializationName}{' '}
                  <Button
                    variant="dark"
                    className="text-light p-1 ms-2"
                    onClick={() => removeSpecialization(id)}
                  >
                    &times;
                  </Button>
                </Badge>
              );
            })}
          </div>
        </Form.Group>

        {/* Submit Button */}
        <Button type="submit" variant="success" className='rounded-pill btn-dark' disabled={loading}>
          {loading ? <Spinner animation="border" size="lg" /> : 'Register'}
        </Button>
      </Form>
    </div>
  );
};

export default RegisterDoctor;
