import React from 'react';
import { FaClock } from 'react-icons/fa';

import './css/style.css';

function Timer({isXPlayer}) {
  return(
    <>
      <div>{isXPlayer ? 'X timer' : 'O timer'}</div>
    
      <FaClock /> 
      <span className="time">
        00:00
      </span>
    </>
  );
}

export default Timer;