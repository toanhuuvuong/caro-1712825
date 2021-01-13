import React, { useEffect, useContext, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input, Col, Row } from 'reactstrap';

import SocketContext from '../../../contexts/SocketContext';
import Game from '../../../containers/user/Game';
import Breadcrumbs from '../../../components/user/Breadcrumbs';
import GameInfo from './GameInfo';
import GameTabs from './GameTabs';
import authenticationService from '../../../services/authentication';
import systemContant from '../../../config/constant';
import OnlineUsersWindow from '../../../components/user/OnlineUsersWindow';

function GameRoom({room, player, col, row, history, isAsc, stepNumber, xIsNext, didFindWinner, actions}) {
  // --- Params
  const { roomId } = useParams();

  // --- Context
  const socket = useContext(SocketContext);

  // --- Ref
  const chatMsg = useRef([]);

  // --- State
  // Main
  const [chatMessages, setChatMessages] = useState([]);
  // Input
  const [messageInput, setMessageInput] = useState('');

  // --- Effect hook
  useEffect(() => {
    actions.getRoomDetail(socket, roomId);
    socket.on('get message', message => {
      if(message) {
        chatMsg.current = [...chatMsg.current, message]
        setChatMessages(chatMsg.current);
      }
    });
  }, []);

  // --- Handle functions
  const handleMessageInputChange = event => {
    setMessageInput(event.target.value);
  };

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

  const handleSendButtonOnClick = event => {
    event.preventDefault();
    if(messageInput) {
      socket.emit('chat message', {
        roomId: roomId, 
        content: messageInput
      }, () => {
        setMessageInput('');
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    }
  };

  return(
    <div>
      <Breadcrumbs currentItem="Game room" />
      <OnlineUsersWindow room={room} />
      <div className="game-room">
        <Row>
          <Col lg={7} className="game-play">
            <hr />
            <Game roomId={roomId} />
            <hr />
          </Col>
          <Col lg={5} className="game-settings">
            <hr />
            <GameInfo room={room} 
            player={player}
            xIsNext={xIsNext} />
            <hr />
            <GameTabs room={room} 
            player={player} 
            col={col} 
            row={row}
            history={history} 
            isAsc={isAsc} 
            stepNumber={stepNumber}
            xIsNext={xIsNext}
            didFindWinner={didFindWinner}
            actions={actions} /> 
            <hr />  
          </Col>
        </Row>
      </div>      
    </div>
  );
}

export default GameRoom;