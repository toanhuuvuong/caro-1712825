import React from 'react';
import { Alert  } from 'reactstrap';

function Notification({color, isOpen, messages}) {
  // --- Handle functions
  const renderMessages = (color, isOpen, messages) => {
    return messages && messages.map((message, index) => {
      return (
        <Alert key={index} color={color} isOpen={isOpen}>
          {message}
        </Alert>
      );
    })
  };
  
  // --- Render
  return (
    <div>
    {renderMessages(color, isOpen, messages)}
    </div>
  );
}

export default Notification;