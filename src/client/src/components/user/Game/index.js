import React, { useEffect, useState, useContext, useRef } from 'react';
import { Button, Input, Label, Row, Col } from 'reactstrap';

import Board from '../Board';
import SocketContext from '../../../contexts/SocketContext';
import calculateWinner from './services/caculateWinner';
import matchAPI from '../../../api/user/match';
import moveAPI from '../../../api/user/move';
import messageAPI from '../../../api/user/message';
import userAPI from '../../../api/common/user';
import authorizationService from '../../../services/authorization';

function Game({roomId, room, player, col, row, history, isAsc, stepNumber, xIsNext, didFindWinner, result, actions}) {
  // -- Context
  const socket = useContext(SocketContext);

  // --- State
  const [areReady, setAreReady] = useState(false);
  const isSaved = useRef(false);

  // -- Effect hook
  useEffect(() => {
    actions.getRoomDetail(socket, roomId);
  }, []);

  // --- Handle functions
  const handleReadyButtonOnClick = () => {
    setAreReady(true);
  };

  const handleClick = (i) => {
    if(!areReady || !player || !room.xPlayer || !room.oPlayer) {
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
      result: value,
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

  const saveMatch = (result) => {
    matchAPI.save({
      roomId: roomId,
      xPlayer: room.xPlayer.id,
      oPlayer: room.oPlayer.id,
      colBoard: col,
      rowBoard: row,
      isXFirst: true,
      result: result ? result.id : null
    })
    .then(data => {
      if(data.ok) {
        const id = data.item._id.toString();
        
        if(history) {
          history.map(step => {
            moveAPI.save({
              move: step.move,
              location: step.location,
              matchId: id,
            });
          });
        }
        if(room && room.chatMessages) {
          room.chatMessages.map((message, index) => {
            messageAPI.save({
              content: message.content,
              time: message.time,
              order: index,
              userId: message.user.id,
              matchId: id,
            });
          });
        }
        // Update player info
      }
    });
  };

  const newHistory = history;
  const current = getCurrent(newHistory);
  const winner = calculateWinner(col, current.squares);

  let status;
  if (winner) {
    status = 'Winner: ' + winner.value;
    if(!didFindWinner) {
      // Save result
      let result = null;
      const authorizationInRoom = authorizationService.getAuthorizationInRoom(room);
      if(winner.value === 'X' && 
      authorizationInRoom === authorizationService.authorizationTypes.X_PLAYER) {
        result = room.xPlayer;
      }
      if(winner.value === 'O' && 
      authorizationInRoom === authorizationService.authorizationTypes.O_PLAYER) {
        result = room.xPlayer;
      }
      if(result && !isSaved.current) {
        saveMatch(result);
        isSaved.current = true;
      }
      highlight(winner.indexs, winner.value);
    }
  } 
  else {
    status = (stepNumber === col * row) 
    ? 'Draw'
    : 'Next player: ' + (xIsNext ? 'X' : 'O');
    if(status === 'Draw' && !didFindWinner && !isSaved.current) {
      // Save result
      saveMatch(null);
      isSaved.current = true;
      const fields = {
        result: 'Draw',
        didFindWinner: true
      };
      actions.changeResult(socket, roomId, fields);
    }
  }

  return (
    <>
      <div className="d-flex">
        <div>{status}</div>
        &nbsp;&nbsp;&nbsp;
        <div>Result: {result}</div>
        &nbsp;&nbsp;&nbsp;
        <div hidden={!room ||(room && (!room.xPlayer || !room.oPlayer)) || areReady || !player}>
          <Button color="success" onClick={handleReadyButtonOnClick}>Ready</Button>
        </div>
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

export default Game;