import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'reactjs-popup/dist/index.css';
import { checkUsernameAvailability, registerPatient } from '../../api/User/userService';
import './Signup.css';
import { 
  FaUser, FaLock, FaEnvelope, FaPhone, FaAddressCard, 
  FaCalendarAlt, FaVenusMars, FaCheckCircle, FaTimesCircle, FaNotesMedical 
} from 'react-icons/fa';
import AmazaLogo from "../../images/nav-logo-cropped.svg"

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    address: '',
    medicalHistory: '',
  });

  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    capital: false,
    special: false,
  });
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const capital = /[A-Z]/.test(password);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const minLength = password.length >= 8;

    setPasswordRules({ capital, special, minLength });
  };

  const handleCheckUsernameAvailability = async () => {
    if (!formData.username) {
      setAvailabilityMessage('Please enter a username first.');
      setUsernameAvailable(null);
      return;
    }

    try {
      const { isAvailable } = await checkUsernameAvailability(formData.username);
      setUsernameAvailable(isAvailable);
      setAvailabilityMessage(isAvailable ? 'Username is available!' : 'Username is taken.');
    } catch (error) {
      setAvailabilityMessage('Error checking username availability.');
      setUsernameAvailable(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { capital, special, minLength } = passwordRules;
    if (!capital || !special || !minLength) {
      setError('Password does not meet the required criteria.');
      return;
    }

    // if (!/^\d{10}$/.test(formData.contactNumber)) {
    //   setError('Contact number must be exactly 10 digits.');
    //   return;
    // }

    if (new Date(formData.dateOfBirth) > new Date()) {
      setError('Date of birth cannot be in the future.');
      return;
    }

    if (usernameAvailable === false) {
      setError('Username is already taken.');
      return;
    }

    try {
      const response = await registerPatient(formData);
      if (response) {
        setShowPopup(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <div className="d-flex">
            <button className="btn btn-outline-light me-3 fst-italic " onClick={() => navigate('/')}>
              Home
            </button>
            <button className="btn btn-outline-light fst-italic" onClick={() => navigate('/login')}>
              Login
            </button>
          </div>
          <div className="navbar-logo mx-auto d-flex align-items-center">
      <img src={AmazaLogo} alt="Logo" className="logo" />
    </div>
          {/* <span className="navbar-brand ms-auto">AmazeCare</span> */}
        </div>
      </nav>

      <div className="signup-container d-flex align-items-center justify-content-center">
        <div className="form-wrapper bg-light p-5 rounded shadow w-50">
          <h2 className="text-center mb-4 text-dark">Signup</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className='text-dark h6'>Username</label>
              <div className="d-flex align-items-center">
                <FaUser className="me-2" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-control text-dark bg-light border-dark rounded-pill"
                  required
                />
              </div>
              <button type="button" onClick={handleCheckUsernameAvailability} className="btn bg-dark text-light btn-dark mt-2 fst-italic rounded-pill">
                Check Availability
              </button>
              {availabilityMessage && (
                <div className={usernameAvailable ? 'text-success' : 'text-danger'}>
                  {availabilityMessage}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className='text-dark h6'>Password</label>
              <div className="d-flex align-items-center">
                <FaLock className="me-2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-control text-dark bg-light border-dark rounded-pill"
                  required
                />
              </div>
              <ul className="text-muted mt-2 fst-italic">
                <li className={passwordRules.minLength ? 'text-success' : 'text-danger'}>
                  {passwordRules.minLength ? <FaCheckCircle /> : <FaTimesCircle />} At least 8 characters
                </li>
                <li className={passwordRules.capital ? 'text-success' : 'text-danger'}>
                  {passwordRules.capital ? <FaCheckCircle /> : <FaTimesCircle />} At least one uppercase letter
                </li>
                <li className={passwordRules.special ? 'text-success' : 'text-danger'}>
                  {passwordRules.special ? <FaCheckCircle /> : <FaTimesCircle />} At least one special character
                </li>
              </ul>
            </div>

            {[
              { field: 'FullName', icon: <FaUser /> },
              { field: 'Email', icon: <FaEnvelope /> },
              { field: 'ContactNumber', icon: <FaPhone /> },
              { field: 'Address', icon: <FaAddressCard /> },
              { field: 'Medical History', icon: <FaNotesMedical /> },
            ].map(({ field, icon }) => (
              <div className="mb-3 h6 text-dark" key={field}>
                <label>{field.replace(/([A-Z])/g, ' $1')}</label>
                <div className="d-flex align-items-center">
                  {icon} <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="form-control ms-2 bg-light border-dark rounded-pill"
                    required={field !== 'medicalHistory'}
                  />
                </div>
              </div>
            ))}

            <div className="mb-3">
              <label className='text-dark h6'>Date of Birth</label>
              <div className="d-flex align-items-center">
                <FaCalendarAlt className="me-2" />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="form-control text-dark bg-light border-dark rounded-pill"
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className='text-dark h6'>Gender</label>
              <div className="d-flex align-items-center">
                <FaVenusMars className="me-2" />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-control bg-light border-dark rounded-pill"
                  required
                >
                  <option value="" className='text-dark bg-light'>Select Gender</option>
                  <option value="Male" className='text-dark bg-light'>Male</option>
                  <option value="Female" className='text-dark bg-light'>Female</option>
                  <option value="Other" className='text-dark bg-light'>Other</option>
                </select>
              </div>
            </div>

            {error && <p className="text-danger">{error}</p>}
            <button type="submit" className="btn btn-dark text-light w-100 rounded-pill">Sign Up</button>
          </form>
        </div>
      </div>

      <Popup open={showPopup} closeOnDocumentClick={false} modal>
        <div className="popup-content text-center bg-dark text-light ">
          <h4>🎉 Registration Successful!</h4>
          <p>You will be redirected to the login page shortly.</p>
        </div>
      </Popup>
    </div>
  );
};

export default Signup;
