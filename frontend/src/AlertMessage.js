// AlertMessage.js
// Component for displaying alert/notification messages to users

import { useState, useEffect } from 'react';

export const AlertMessage = ({ message, type = 'info', autoClose = true, duration = 5000 }) => {
  const [visible, setVisible] = useState(true);
  
  // Auto-close the alert after the specified duration
  useEffect(() => {
    if (autoClose && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, visible]);
  
  if (!visible) return null;
  
  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">
        {message}
      </div>
      <button 
        className="alert-close" 
        onClick={() => setVisible(false)}
        aria-label="Close alert"
      >
        &times;
      </button>
    </div>
  );
};
