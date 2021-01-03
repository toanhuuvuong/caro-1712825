import React, { useEffect, useContext, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input, Col, Row } from 'reactstrap';

import './css/style.css';

import SocketContext from '../../../../../contexts/SocketContext';

function GameChat({player}) {
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

  const handleSendButtonOnClick = event => {
    event.preventDefault();
    if(messageInput) {
      socket.emit('chat message', {
        roomId: roomId, 
        content: messageInput
      }, () => {
        setMessageInput('');
        // Scroll chat
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
      });
    }
  };

  return(
    <>  
      <div id="chat-messages">
        <ul>
        {
          chatMessages && chatMessages.map((message, index) => {
            return (
            <div key={index} className={"message" + (player && player.username === message.username ? " myself" : "")}>
              <p className="meta d-flex justify-content-between">
                <div>{message.username}</div>
                <div>{message.time}</div>
              </p>
              <p className="text">{message.content}</p>
            </div>
            );
          })
        }
        </ul>
      </div>
      <div class="d-flex">
        <Input placeholder="Nhập tin nhắn..."
        value={messageInput}
        onChange={handleMessageInputChange}></Input>
        <Button onClick={handleSendButtonOnClick}>Send</Button>
      </div>
    </>
  );
}

export default GameChat;