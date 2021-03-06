import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input } from 'reactstrap';

import './css/style.css';

import SocketContext from '../../../../../contexts/SocketContext';
import authenticationService from '../../../../../services/authentication';

function GameChat() {
  // --- Params
  const { roomId } = useParams();

  // --- Context
  const socket = useContext(SocketContext);

  // --- State
  // Main
  const [chatMessages, setChatMessages] = useState([]);
  // Input
  const [messageInput, setMessageInput] = useState('');

  // --- Effect hook
  useEffect(() => {
    socket.emit('get messages', roomId);
    socket.on('get messages', messages => {
      setChatMessages(messages);
      // Scroll chat
      const chatMessages = document.getElementById('chat-messages');
      chatMessages.scrollTop = chatMessages.scrollHeight;
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
            const isMySelf = authenticationService.getUserId() === message.user.id;
            return (
            <div key={index} className={isMySelf ? "" : " d-flex justify-content-end"}>
              <div className={"message" + (isMySelf ? " myself" : "")}>
                <p className="meta row">
                  <div className="col-lg-8">{message.user.name}</div>
                  <div className="col-lg-4 text-right">{message.time}</div>
                </p>
                <p className="text">{message.content}</p>
              </div>
            </div>
            );
          })
        }
        </ul>
      </div>
      <div class="d-flex">
        <Button onClick={handleSendButtonOnClick}>Send</Button>
        <Input placeholder="Nhập tin nhắn..."
        value={messageInput}
        onChange={handleMessageInputChange}></Input>  
      </div>
    </>
  );
}

export default GameChat;