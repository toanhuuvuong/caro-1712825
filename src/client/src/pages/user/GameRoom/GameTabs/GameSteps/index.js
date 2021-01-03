import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import './css/style.css';

import SocketContext from '../../../../../contexts/SocketContext';

function GameSteps({room, player, col, history, stepNumber, actions}) {
  // --- Params
  const { roomId } = useParams();

  // --- Context
  const socket = useContext(SocketContext);

  // --- Effect hook
  useEffect(() => {
    // Scroll top
    const steps = document.getElementById('steps');
    steps.scrollTop = steps.scrollHeight;
  }, []);
   // --- Handle functions
  const jumpTo = (move) => {
    if(!player || !room.xPlayer || !room.oPlayer) {
      return;
    }

    const fields = {
      didFindWinner: false,
      stepNumber: move,
      xIsNext: (move % 2) === 0
    };
    actions.jumpTo(socket, roomId, fields);
  };
  return(
    <>  
      <div id="steps">
        <ol>
        {
          history && history.map(step => {
            const desc = (step.move !== 0) 
            ? 'Move #' + step.move + ' & Location (' 
            + Number.parseInt(step.location / col) + ', ' 
            + step.location % col + ')' 
            : 'Game start';
            const className = (step.move === stepNumber) ? 'move-selected' : 'move';
        
            return(
              <li key={step.move}>
                <button className={className} 
                onClick={() => jumpTo(step.move)}>{desc}</button>
              </li>
            );
          })
        }
        </ol>
      </div>
    </>
  );
}

export default GameSteps;