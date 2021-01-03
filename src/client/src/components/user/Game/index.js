import React, { useEffect, useState, useContext } from 'react';
import { Button, Input, Label, Row, Col } from 'reactstrap';

import Board from '../Board';
import SocketContext from '../../../contexts/SocketContext';
import calculateWinner from './services/caculateWinner';

function Game({roomId, room, player, col, row, history, isAsc, stepNumber, xIsNext, didFindWinner, actions}) {
  // -- Context
  const socket = useContext(SocketContext);

  // --- State

  // -- Effect hook
  useEffect(() => {
    actions.getRoomDetail(socket, roomId);
  }, []);

  // --- Handle functions
  const handleClick = (i) => {
    if(!player || !room.xPlayer || !room.oPlayer) {
      return;
    }
    if(player.id === room.xPlayer.id && !xIsNext) {
      return;
    }
    if(player.id === room.oPlayer.id && xIsNext) {
      return;
    }
    
    const newHistory = isAsc 
    ? history.slice(0, stepNumber + 1)
    : history.slice(history.length - stepNumber - 1, history.length);
    const current = isAsc 
    ? newHistory[newHistory.length - 1] 
    : newHistory[0];
    const squares = current.squares.slice();

    if (calculateWinner(col, current.squares) || squares[i]) {
      return;
    }
    
    squares[i] = xIsNext ? {value: 'X', isHighlight: false} : {value: 'O', isHighlight: false};

    const fields = {
      history: isAsc 
      ? [...newHistory, {move: newHistory.length, squares: squares, location: i}] 
      : [{move: newHistory.length, squares: squares, location: i}, ...newHistory],
      stepNumber: newHistory.length,
      xIsNext: !xIsNext
    };
    actions.handleClick(socket, roomId, fields);
  };

  const highlight = (indexs) => {
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
      didFindWinner: true,
      history: [...newHistory]
    };
    actions.highlight(socket, roomId, fields);
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

  const newHistory = history;
  const current = getCurrent(newHistory);
  const winner = calculateWinner(col, current.squares);

  let status;
  if (winner) {
    status = 'Winner: ' + winner.value;
    if(!didFindWinner) {
      highlight(winner.indexs);
    }
  } 
  else {
    status = (stepNumber === col * row) 
    ? 'Draw'
    : 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div>{status}</div>
      <hr />
      <Row>
        <Col lg={12}>
          <div className="game-board">
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

export default Game;