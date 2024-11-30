import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthContext from '../AuthContext';

const PrivateRoute = ({ role }) => {
  const { auth } = useContext(AuthContext);

  if (!auth) {
    return <Navigate to="/login" />;
  }

  // Debugging: Log the entire auth token
  console.log("Auth Token:", auth);

  try {
    const decodedToken = JSON.parse(atob(auth.split('.')[1]));
    console.log("Decoded Token:", decodedToken); // Debugging: Log the decoded token

    const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    console.log("User Role:", userRole); // Debugging: Log the user role

    if (userRole !== role) {
      return <Navigate to="/login" />;
    }

    return <Outlet />;
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
