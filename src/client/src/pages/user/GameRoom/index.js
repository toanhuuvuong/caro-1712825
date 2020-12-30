import React, { useEffect, useContext, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input, Col, Row } from 'reactstrap';

import SocketContext from '../../../contexts/SocketContext';
import Game from '../../../containers/user/Game';
import Breadcumbs from '../../../components/user/Breadcumbs';
import GameInfo from './GameInfo';
import GameTabs from './GameTabs';
import authenticationService from '../../../services/authentication';
import systemContant from '../../../config/constant';

function GameRoom({room, player, actions}) {
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
      });
    }
  };

  return(
    <div>
      <Breadcumbs currentItem="Game room" />
      <div className="game-room">
        <Row>
          <Col lg={8} className="game-play">
            <hr />
            <Game roomId={roomId} />
          </Col>
          <Col lg={4} className="game-settings">
            <hr />
            <GameInfo room={room} player={player} />
            <GameTabs room={room} player={player} actions={actions} />
            <hr />
            <div class="chat-container">
              <header class="chat-header">
                <h3>Chat form</h3>
              </header>
              <main class="chat-main">
                <div class="chat-sidebar"></div>
                <div class="chat-messages">
                  <ul>
                  {
                    chatMessages && chatMessages.map(message => {
                      return <li>{message.username} - {message.time}: {message.content}</li>
                    })
                  }
                  </ul>
                </div>
              </main>
              <div class="chat-form-container">
                <form id="chat-form">
                  <div className="chat-form d-flex">
                    <Input placeholder="Nhập tin nhắn..."
                    value={messageInput}
                    onChange={handleMessageInputChange}></Input>
                    <Button onClick={handleSendButtonOnClick}>Send</Button>
                  </div>
                </form>
              </div>
            </div>
          </Col>
        </Row>
      </div>      
    </div>
  );
}

export default GameRoom;