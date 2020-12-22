import React, { useEffect, useContext, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input, Col } from 'reactstrap';

import SocketContext from '../../../contexts/SocketContext';
import Game from '../../../containers/user/Game';
import Header from '../../../components/user/Header';
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
      <Header currentItem="Game room" />
      <div className="row game-room">
        <Col sm={8} className="game-play">
          <Game roomId={roomId} />
        </Col>
        <Col sm={4} className="game-settings">
          <div className="subtitle">
            
            <hr />
            <div className="d-flex">
              <div className="room-info col-sm-6">
                <h5>Room Id: {roomId}</h5>
                {
                  player && 
                  <h5>You: {player.username}</h5>
                }
                <div>X Player: {room && room.xPlayer && room.xPlayer.username}</div>
                <div>O Player: {room && room.oPlayer && room.oPlayer.username}</div>
              </div>
              <div className="room-viewers-info col-sm-6">
                <h5>List chat viewers:</h5>
                <ul>
                {
                  room && room.viewers && room.viewers.map(viewer => {
                    return <li>{viewer.username}</li>
                  })
                }
                </ul>
              </div>
            </div>
          </div>    
          <hr />
          <div class="chat-container">
            <header class="chat-header">
              <h1>ChatCord</h1>
              <Button className="btn" color="danger" 
              onClick={handleLeaveRoomButtonOnClick}>Leave Room</Button>
            </header>
            <main class="chat-main">
              <div class="chat-sidebar">
                <div>Room Id: {roomId}</div>
                {
                  player && 
                  <div>You: {player.username}</div>
                }
                <div>X Player: {room && room.xPlayer && room.xPlayer.username}</div>
                <div>O Player: {room && room.oPlayer && room.oPlayer.username}</div>
                <h3>Viewers</h3>
                  <ul id="users">
                  {
                    room && room.viewers && room.viewers.map(viewer => {
                      return <li>{viewer.username}</li>
                    })
                  }
                  </ul>
              </div>
              <div class="chat-messages"></div>
            </main>
            <div class="chat-form-container">
              <form id="chat-form">
                <input
                  id="msg"
                  type="text"
                  placeholder="Enter Message"
                  required
                  autocomplete="off"
                />
                <button class="btn"><i class="fas fa-paper-plane"></i> Send</button>
              </form>
            </div>
          </div>
          <div className="chat-section">
            <div className="chat-form d-flex">
              <Input placeholder="Nhập tin nhắn..."
                  value={messageInput}
                  onChange={handleMessageInputChange}></Input>
              <Button onClick={handleSendButtonOnClick}>Send</Button>
            </div>

            <div className="chat-messages">
              <div>List chat messages:</div>
              <ul>
              {
                chatMessages && chatMessages.map(message => {
                  return <li>{message.username} - {message.time}: {message.content}</li>
                })
              }
              </ul>
            </div>
          </div>
        </Col>
      </div>      
    </div>
  );
}

export default GameRoom;