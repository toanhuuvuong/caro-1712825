import React, { useEffect, useContext, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input } from 'reactstrap';

import SocketContext from '../../../contexts/SocketContext';
import Game from '../../../components/user/Game';
import authenticationService from '../../../services/authentication';
import authorizationService from '../../../services/authorization';
import systemContant from '../../../config/constant';

function GameRoom() {
  // --- Params
  const {roomId} = useParams();

  // --- Context
  const socket = useContext(SocketContext);

  // --- State
  // Main
  const [room, setRoom] = useState({});
  const chatMsg = useRef([]);
  const [chatMessages, setChatMessages] = useState([]);
  // Input
  const [messageInput, setMessageInput] = useState('');

  // --- Effect hook
  useEffect(() => {
    socket.emit('get room detail', roomId);
    socket.on('get room detail', room => {
      setRoom(room);
    });
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
      <div className="title">
        <h1>Game Room</h1>
      </div>
      <hr />
      <div className="subtitle">
        <Button color="danger" 
        onClick={handleLeaveRoomButtonOnClick}>Leave Room</Button>
        <hr />
        <div className="d-flex">
          <div className="room-info col-sm-6">
            <h5>Room Id: {room.id}</h5>
            {
              authorizationService.getPlayer(room) && 
              <h5>You: {authorizationService.getPlayer(room).username}</h5>
            }
            <div>X Player: {room.xPlayer && room.xPlayer.username}</div>
            <div>O Player: {room.oPlayer && room.oPlayer.username}</div>
          </div>
          <div className="room-viewers-info col-sm-6">
            <h5>List chat viewers:</h5>
            <ul>
            {
              room.viewers && room.viewers.map(viewer => {
                return <li>{viewer.username}</li>
              })
            }
            </ul>
          </div>
        </div>
      </div>    
      <hr />
      <div className="game-room">
        <Game />
        
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
      </div>
    </div>
  );
}

export default GameRoom;