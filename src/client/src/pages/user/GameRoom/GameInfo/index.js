import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';

import SocketContext from '../../../../contexts/SocketContext';
import authenticationService from '../../../../services/authentication';
import systemContant from '../../../../config/constant';
import PlayerCard from './PlayerCard';

function GameInfo({room, player}) {
  // --- Params
  const { roomId } = useParams();

  // --- Context
  const socket = useContext(SocketContext);

  // --- Handle functions
  const handleLeaveRoomButtonOnClick = event => {
    event.preventDefault();
    socket.emit('leave room', {
      roomId: roomId,
      userId: authenticationService.getUserId()
    }, data => {
      if(data.ok) {
        window.open(systemContant.CLIENT_URL + '/dashboard', '_self');
      }
    });
  };
  
  return(
    <>
      <div className="d-flex justify-content-between">
        <h6>Room #1{room && true}</h6>
        <Button color="danger"
        onClick={handleLeaveRoomButtonOnClick}>Leave Room</Button>  
      </div>
      <hr />
      <Row>
        <Col lg={6}><PlayerCard isXPlayer={true} player={room && room.xPlayer} /></Col>
        <Col lg={6}><PlayerCard isXPlayer={false} player={room && room.oPlayer} /></Col>
      </Row>
    </>
  );
}

export default GameInfo;