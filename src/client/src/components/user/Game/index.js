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
import Badge from 'reactstrap/lib/Badge';
import authenticationService from '../../../services/authentication';

function Game({roomId, room, player, col, row, history, isAsc, stepNumber, xIsNext, didFindWinner, result, actions}) {
  // -- Context
  const socket = useContext(SocketContext);

  // --- State
  const [areReady, setAreReady] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [timeoutStatus, setTimeoutStatus] = useState();
  const isSaved = useRef(false);
  const didSetTimeoutSocket = useRef(false);
  const status = useRef();

  // -- Effect hook
  useEffect(() => {
    actions.getRoomDetail(socket, roomId);
  }, []);

  // --- Handle functions
  const handleReadyButtonOnClick = () => {
    const isXPlayer = authenticationService.getUserId() === room.xPlayer.id;
    socket.emit('ready', {roomId: roomId, isXPlayer: isXPlayer});
    socket.on('get both ready', ({areReady}) => {
      console.log('ARE READY:', areReady);
      setAreReady(areReady);
    });
    socket.on('get ready ' + (isXPlayer ? 'X' : 'O'), ({isReady}) => {
      console.log('IS READY:', isReady);
      setIsReady(isReady);
    });
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
      result: value + ' win!!!',
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
    socket.emit('stop timer', ({roomId: roomId, isXPlayer: true}));
    socket.emit('stop timer', ({roomId: roomId, isXPlayer: false}));
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
        const newPlayer = {...player};
        let body = null;

        let opponent = null;
        if(player.id === room.xPlayer.id) {
          opponent = room.oPlayer;
        } else {
          opponent = room.xPlayer;
        }

        if(!result) {
          body = {
            total: player.total + 1
          }
          newPlayer.total = player.total + 1;
        } else if(result.id === player.id) {
          let bonusTrophy = 0;
          if(player.trophies < opponent.trophies) {
            bonusTrophy = 1;
          }
          body = {
            trophies: player.trophies + bonusTrophy + 1,
            win: player.win + 1,
            total: player.total + 1
          }
          newPlayer.trophies = player.trophies + bonusTrophy + 1;
          newPlayer.win = player.win + 1;
          newPlayer.total = player.total + 1;
        } else if(result.id === opponent.id) {
          let bonusTrophy = 0;
          if(player.trophies > opponent.trophies) {
            bonusTrophy = 1;
          }
          body = {
            trophies: ((player.trophies - bonusTrophy - 1) < 0) ? 0 : (player.trophies - bonusTrophy - 1),
            lost: player.lost + 1,
            total: player.total + 1
          }
          newPlayer.trophies = player.trophies - bonusTrophy - 1 < 0 ? 0 : (player.trophies - bonusTrophy - 1);
          newPlayer.lost = player.lost + 1;
          newPlayer.total = player.total + 1;
        }
        userAPI.update(body)
        .then(data => {
          if(data.ok) {
            socket.emit('update player info', {
              roomId: roomId, 
              isXPlayer: player.id === room.xPlayer.id, 
              model: newPlayer
            });

          }
        });
      }
    });
  };

  // --- Socket listen timeout event
  if(room && room.xPlayer && room.oPlayer && 
    actions && player && !didSetTimeoutSocket.current) {
    didSetTimeoutSocket.current = true;
    socket.on('timeout', ({isXPlayer}) => {
      console.log('TIMEOUT ' + (isXPlayer ? 'X' : 'O'));
        
      let result = null;
      if(isXPlayer) {
        result = room.oPlayer;
      } else {
        result = room.xPlayer;
      }
      if(result && !isSaved.current) {
        saveMatch(result);
        isSaved.current = true;
      }
      setTimeoutStatus((isXPlayer ? 'X' : 'O') + ' timeout!');
      const fields = {
        result: (isXPlayer ? 'O' : 'X') + ' win!!!',
        didFindWinner: true
      };
      actions.changeResult(socket, roomId, fields);
    });
  }

  // --- Handle win/lost/status
  const newHistory = history;
  const current = getCurrent(newHistory);
  const winner = calculateWinner(col, current.squares);

  if (winner) {
    status.current = 'Winner: ' + winner.value;
    if(!didFindWinner) {
      // Save result
      let result = null;
      //const authorizationInRoom = authorizationService.getAuthorizationInRoom(room);
      if(winner.value === 'X') {
        result = room.xPlayer;
      }
      if(winner.value === 'O') {
        result = room.oPlayer;
      }
      if(result && !isSaved.current) {
        saveMatch(result);
        isSaved.current = true;
      }
      highlight(winner.indexs, winner.value);
    }
  } 
  else {
    status.current = (stepNumber === col * row) 
    ? 'Draw'
    : (xIsNext ? 'X' : 'O') + ' next';
    if(status.current === 'Draw' && !didFindWinner && !isSaved.current) {
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
      <div>
        <div>Status: <Badge color="primary">{status.current}</Badge></div>
        <div>Result: <Badge color="dark">{result}</Badge></div>
        <div>Timeout status: <Badge color="danger">{timeoutStatus}</Badge></div>
        <div>
          Ready status: <Badge color="warning">
            {areReady ? "Let's start!" : (isReady ? "Please wait for your opponent to be ready" : "You are not ready")}
          </Badge>
        </div>
        <div hidden={!room ||(room && (!room.xPlayer || !room.oPlayer)) || isReady || !player}>
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