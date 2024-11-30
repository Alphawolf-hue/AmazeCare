import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext';

const DashboardRedirect = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate('/login');
    } else {
      const decodedToken = JSON.parse(atob(auth.split('.')[1]));
      const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      switch (userRole) {
        case 'Doctor':
          navigate('/doctor-dashboard');
          break;
        case 'Patient':
          navigate('/patient-dashboard');
          break;
        case 'Admin':
          navigate('/admin-dashboard');
          break;
        default:
          navigate('/user-dashboard');
          break;
      }
    }
  }, [auth, navigate]);

  return null;
};

export default DashboardRedirect;
