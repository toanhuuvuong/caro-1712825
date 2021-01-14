import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import './css/style.css';

function GameSteps({col, history, stepNumber, actions}) {
  // --- Params
  const { matchId } = useParams();

  // --- Effect hook
  useEffect(() => {
    
  }, []);
   // --- Handle functions
  const jumpTo = (move) => {
    const fields = {
      result: null,
      didFindWinner: false,
      stepNumber: move,
      xIsNext: (move % 2) === 0
    };
    actions.jumpTo(fields);
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