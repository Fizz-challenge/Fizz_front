import React, { useState, useEffect } from 'react';
import './PageAlert.css';

const PageAlert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="page-alert">
      {message}
    </div>
  );
};

export default PageAlert;
