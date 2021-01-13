import React, { useState, useContext, useEffect, useRef } from 'react';
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
  const [areReady, setAreReady] = useState(false);
  const didStartXTimer = useRef(false);
  const didStartOTimer = useRef(false);

  // --- Effect hook
  useEffect(() => {
    socket.on('get timer ' + (isXPlayer ? 'X' : 'O'), ({time}) => {
      setTime(time);
    });
    socket.on('get both ready', ({areReady}) => {
      setAreReady(areReady);
    });
  }, []);

  if(room && authorizationService.isPlayer(room) && areReady) {
    if(reset) {
      if(isXPlayer) {
        if(!didStartXTimer.current) {
          didStartXTimer.current = true;
          didStartOTimer.current = false;
          socket.emit('reset timer', {roomId: roomId, isXPlayer: isXPlayer});
        }
      } else {
        if(!didStartOTimer.current) {
          didStartXTimer.current = false;
          didStartOTimer.current = true;
          socket.emit('reset timer', {roomId: roomId, isXPlayer: isXPlayer});
        }
      }
    } else {
      if(isXPlayer) {
        didStartXTimer.current = false;
        didStartOTimer.current = true;
        socket.emit('stop timer', {roomId: roomId, isXPlayer: isXPlayer});
      } else {
        didStartXTimer.current = true;
        didStartOTimer.current = false;
        socket.emit('stop timer', {roomId: roomId, isXPlayer: isXPlayer});
      }      
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