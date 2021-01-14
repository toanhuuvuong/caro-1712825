import React, { useEffect, useState, useContext, useRef } from 'react';
import { Button, Input, Label, Row, Col } from 'reactstrap';

import Board from '../Board';
import SocketContext from '../../../contexts/SocketContext';
import calculateWinner from './services/caculateWinner';
import moveAPI from '../../../api/user/move';
import messageAPI from '../../../api/user/message';
import userAPI from '../../../api/common/user';
import authorizationService from '../../../services/authorization';
import Badge from 'reactstrap/lib/Badge';
import authenticationService from '../../../services/authentication';
import { useParams } from 'react-router-dom';

function GamePlayReview({col, row, history, isAsc, stepNumber, xIsNext, didFindWinner, result, actions}) {
  const {matchId} = useParams();

  // --- State
  const status = useRef();

  // -- Effect hook
  useEffect(() => {
    
  }, []);

  // --- Handle functions
  const handleClick = (i) => {
    
  };

  const highlight = (indexs, value) => {
    const newHistory = isAsc 
    ? history.slice(0, stepNumber + 1)
    : history.slice(history.length - stepNumber - 1, history.length);
    let current = isAsc 
    ? newHistory[newHistory.length - 1] 
    : newHistory[0];
    const squares = current.squares.slice();

    indexs.forEach((index) => {
      squares[index] = {...squares[index], isHighlight: true};
    });

    current = {...current, squares: squares}

    if(isAsc) {
      newHistory[newHistory.length - 1] = current;
    }
    else {
      newHistory[0] = current
    }

    const fields = {
      result: value + ' win!!!',
      didFindWinner: true,
      history: [...newHistory]
    };
    actions.highlight(fields);
  };

  const getCurrent = (history) => {
    let current = {
      move: 0,
      squares: Array(col * row).fill(null),
      location: null
    };
    history.forEach((step) => {
      if(step.move === stepNumber) {
        current = step;
        return;
      }
    });

    return current;
  };
  
  // --- Handle win/lost/status
  const newHistory = history;
  const current = getCurrent(newHistory);
  const winner = calculateWinner(col, current.squares);

  if (winner) {
    status.current = 'Winner: ' + winner.value;
    if(!didFindWinner) {
      highlight(winner.indexs, winner.value);
    }
  } 
  else {
    status.current = (stepNumber === col * row) 
    ? 'Draw'
    : (xIsNext ? 'X' : 'O') + ' next';
    if(status.current === 'Draw' && !didFindWinner) {
      const fields = {
        result: 'Draw',
        didFindWinner: true
      };
      actions.changeResult(fields);
    }
  }

  return (
    <>
      <div>
        <div>Status: <Badge color="primary">{status.current}</Badge></div>
        <div>Result: <Badge color="dark">{result}</Badge></div>
      </div>
      <hr />
      <Row>
        <Col lg={12}>
          <div className="d-flex justify-content-center">
            <Board col={col}
            row={row}
            squares={current.squares} 
            onClick={(i) => handleClick(i)} />
          </div>
        </Col>
      </Row>
    </>
  );
}

export default GamePlayReview;