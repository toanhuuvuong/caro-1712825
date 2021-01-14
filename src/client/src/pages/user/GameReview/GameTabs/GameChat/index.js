import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input } from 'reactstrap';

import './css/style.css';

import SocketContext from '../../../../../contexts/SocketContext';
import authenticationService from '../../../../../services/authentication';
import messageAPI from '../../../../../api/user/message';

function GameChat() {
  // --- Params
  const { matchId } = useParams();

  // --- Context
  const socket = useContext(SocketContext);

  // --- State
  // Main
  const [chatMessages, setChatMessages] = useState([]);

  // --- Effect hook
  useEffect(() => {
    messageAPI.getByMatchId(matchId)
    .then(data => {
      if(data.ok) {
        setChatMessages(data.items);
      }
    });
  }, []);

  // --- Handle functions

  return(
    <>  
      <div id="chat-messages">
        <ul>
        {
          chatMessages && chatMessages.map((message, index) => {
            const isMySelf = authenticationService.getUserId() === message.userId;
            return (
            <div key={index} className={isMySelf ? "" : " d-flex justify-content-end"}>
              <div className={"message" + (isMySelf ? " myself" : "")}>
                <p className="meta row">
                  <div className="col-lg-8">{message.userId}</div>
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
    </>
  );
}

export default GameChat;