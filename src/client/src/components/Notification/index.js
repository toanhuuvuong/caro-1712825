import React from 'react';
import { Alert  } from 'reactstrap';

const renderMessages = (color, isOpen, messages) => {
  return messages && messages.map((message, index) => {
    return (
      <Alert key={index} color={color} isOpen={isOpen}>
        {message}
      </Alert>
    );
  })
}
function Notification({color, isOpen, messages}) {
  return (
    <div>
    {renderMessages(color, isOpen, messages)}
    </div>
  );
}

export default Notification;