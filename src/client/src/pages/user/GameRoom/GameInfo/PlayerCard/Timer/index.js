import React, { useState, useContext, useEffect } from 'react';
import { FaClock } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

import './css/style.css';

import SocketContext from '../../../../../../contexts/SocketContext';
import authorizationService from '../../../../../../services/authorization';

function Timer({room, reset, isXPlayer, timeout}) {
  // --- Params
  const { roomId } = useParams();

  // --- Context
  const socket = useContext(SocketContext);

  // --- State
  const [time, setTime] = useState();
  const [didStartTimer, setDidStartTimer] = useState(false);
  const [didStopTimer, setDidStopTimer] = useState(false);

  // --- Effect hook
  useEffect(() => {
    socket.on('get timer ' + (isXPlayer ? 'X' : 'O'), ({time}) => {
      setTime(time);
    });
  }, []);

  if(room && authorizationService.isPlayer(room)) {
    if(reset && !didStartTimer) {
      setDidStartTimer(true);
      socket.emit('reset timer', {roomId: roomId, isXPlayer: isXPlayer});
    } 
    if(!reset && didStartTimer) {
      setDidStartTimer(false);
      socket.emit('stop timer', {roomId: roomId, isXPlayer: isXPlayer});
    }
  }

  return(
    <>
      <div>{isXPlayer ? 'X timer' : 'O timer'}</div>
    
      <FaClock /> 
      <span className="time">
        {time ? time : (timeout && timeout < 10 ? '0' + timeout + ':00' : '' + timeout + ':00')}
      </span>
    </>
  );
}

export default Timer;