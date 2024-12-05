import React from 'react';
import { useLocation } from 'react-router-dom';
import './PageWrapper.css';

const PageWrapper = ({ children }) => {
  const location = useLocation();

  // Define routes where the background image should appear
  const backgroundRoutes = [];

  const shouldApplyBackground = backgroundRoutes.includes(location.pathname);

  return (
    <div className={shouldApplyBackground ? 'background-wrapper' : ''}>
      {children}
    </div>
  );
};

export default PageWrapper;
