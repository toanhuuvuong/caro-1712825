import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import Board from '../Board';
import SocketContext from '../../../contexts/SocketContext';
import calculateWinner from './services/caculateWinner';
import systemConstant from '../../../config/constant';
import authorizationService from '../../../services/authorization';

function Game() {
  // -- Context
  const socket = useContext(SocketContext);

  // --- Params
  const {roomId} = useParams();

  // --- State
  // Main
  const [room, setRoom] = useState({});
  const [col, setCol] = useState(systemConstant.GAME_STATE_DEFAULT.COL);
  const [row, setRow] = useState(systemConstant.GAME_STATE_DEFAULT.ROW);
  const [history, setHistory] = useState([{
    move: 0,
    squares: Array(systemConstant.GAME_STATE_DEFAULT.COL * systemConstant.GAME_STATE_DEFAULT.ROW).fill(null),
    location: null
  }]);
  const [isAsc, setIsAsc] = useState(true);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [didFindWinner, setDidFindWinner] = useState(false);
  // Input
  const [colInput, setColInput] = useState('');
  const [rowInput, setRowInput] = useState('');

  // -- Effect hook
  useEffect(() => {
    socket.emit('get room detail', roomId);
    socket.on('get room detail', roomDetail => {
      setRoom(roomDetail);

      const {col, row, history, isAsc, stepNumber, xIsNext, didFindWinner} = roomDetail.gameState;
      setCol(col);
      setRow(row);
      setHistory(history);
      setIsAsc(isAsc);
      setStepNumber(stepNumber);
      setXIsNext(xIsNext);
      setDidFindWinner(didFindWinner);
      setColInput(col);
      setRowInput(row);
    });
  }, []);

  // --- Handle functions
  const handleColInputChange = event => {
    setColInput(event.target.value);
  };

  const handleRowInputChange = event => {
    setRowInput(event.target.value);
  };

  const handleClick = (i) => {
    const player = authorizationService.getPlayer(room);
    if(!player || !room.xPlayer || !room.oPlayer) {
      return;
    }
    if(player.id === room.xPlayer.id && !xIsNext) {
      return;
    }
    if(player.id === room.oPlayer.id && xIsNext) {
      return;
    }
    
    const newHistory = isAsc ? history.slice(0, stepNumber + 1)
    : history.slice(history.length - stepNumber - 1, history.length);
    const current = isAsc ? newHistory[newHistory.length - 1] : newHistory[0];
    const squares = current.squares.slice();

    if (calculateWinner(col, current.squares) || squares[i]) {
      return;
    }
    
    squares[i] = xIsNext ? {value: 'X', isHighlight: false} : {value: 'O', isHighlight: false};

    const fields = {
      history: isAsc ? [...newHistory, {move: newHistory.length, squares: squares, location: i}] 
      : [{move: newHistory.length, squares: squares, location: i}, ...newHistory],
      stepNumber: newHistory.length,
      xIsNext: !xIsNext
    };
    socket.emit('update game state', {
      roomId: roomId, 
      fields: fields
    }, () => {
      setHistory(fields.history);
      setStepNumber(fields.stepNumber);
      setXIsNext(fields.xIsNext);
    });
  };

  const jumpTo = (move) => {
    const player = authorizationService.getPlayer(room);
    if(!player || !room.xPlayer || !room.oPlayer) {
      return;
    }

    const fields = {
      didFindWinner: false,
      stepNumber: move,
      xIsNext: (move % 2) === 0
    };
    socket.emit('update game state', {
      roomId: roomId, 
      fields: fields
    }, () => {
      setDidFindWinner(fields.didFindWinner);
      setStepNumber(fields.stepNumber);
      setXIsNext(fields.xIsNext);
    });
  };

  const highlight = (indexs) => {
    const newHistory = isAsc ? history.slice(0, stepNumber + 1)
    : history.slice(history.length - stepNumber - 1, history.length);
    let current = isAsc ? newHistory[newHistory.length - 1] : newHistory[0];
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
    socket.emit('update game state', {
      roomId: roomId, 
      fields: fields
    }, () => {
      setDidFindWinner(fields.didFindWinner);
      setHistory(fields.history);
    });
  };

  const sort = (type) => {
    const player = authorizationService.getPlayer(room);
    if(!player || !room.xPlayer || !room.oPlayer) {
      return;
    }

    let newHistory = history.slice();
    let newIsAsc = true;

    newHistory = newHistory.sort(function(a, b) {
      return (a.move - b.move);
    });

    if(type === 'desc') {
      newIsAsc = false;
      newHistory = newHistory.reverse();
    }

    const fields = {
      history: [...newHistory],
      isAsc: newIsAsc
    };
    socket.emit('update game state', {
      roomId: roomId, 
      fields: fields
    }, () => {
      setHistory(fields.history);
      setIsAsc(fields.isAsc); 
    }); 
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

  const changeBoardSize = () => {
    const player = authorizationService.getPlayer(room);
    if(!player) {
      return;
    }

    const newCol = colInput;
    const newRow = rowInput;

    if(!newCol || !newRow) {
      return;
    }

    const colNumber = Number.parseInt(newCol);
    const rowNumber = Number.parseInt(newRow);

    if(colNumber <= 0 || rowNumber <= 0) {
      return;
    }

    const fields = {
      didFindWinner: false,
      col: colNumber,
      row: rowNumber,
      history: [{
        move: 0,
        squares: Array(colNumber * rowNumber).fill(null),
        location: null
      }],
      isAsc: true,
      stepNumber: 0,
      xIsNext: true
    };
    socket.emit('update game state', {
      roomId: roomId, 
      fields: fields
    }, () => {
      setDidFindWinner(fields.didFindWinner);
      setCol(fields.col);
      setRow(fields.row);
      setHistory(fields.history);
      setIsAsc(fields.isAsc);
      setStepNumber(fields.stepNumber);
      setXIsNext(fields.xIsNext);
    });
  }

  const newHistory = history;
  const current = getCurrent(newHistory);
  const winner = calculateWinner(col, current.squares);
  const moves = newHistory.map((step, move) => {
    const desc = (step.move !== 0) ? 'Go to move #' + step.move 
    + ' & Location (' + Number.parseInt(step.location / col) + ', ' 
    + step.location % col + ')' : 'Go to game start';
    const className = (step.move === stepNumber) ? 'move-selected' : '';

    return(
      <li key={step.move}>
        <button className={className} onClick={() => jumpTo(step.move)}>{desc}</button>
      </li>
    );
  });

  let status;
  if (winner) {
    status = 'Winner: ' + winner.value;
    if(!didFindWinner) {
      highlight(winner.indexs);
    }
  } 
  else {
    status = (stepNumber === col * row) ? 'Draw'
    : 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board col={col}
        row={row}
        squares={current.squares} 
        onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
      <div className="game-option">
        <div>Option</div>
        <ol>
          <li>
            <div>Sort</div>
            <div>
              {
                isAsc && <input type="radio" name="sort" value="asc" 
                checked
                onClick={() => sort('asc')} />
              }
              {
                !isAsc && <input type="radio" name="sort" value="asc" 
                onClick={() => sort('asc')} />
              }
              <label>Ascending</label><br />

              {
                isAsc && <input type="radio" name="sort" value="desc"
                onClick={() => sort('desc')} />
              }
              {
                !isAsc && <input type="radio" name="sort" value="desc"
                checked
                onClick={() => sort('desc')} />
              }
              <label>Descending</label>
            </div>
          </li>
          <li>
            <div>Board size</div>
            <div>
              <label>Column:</label><br />
              <input type="number" 
              defaultValue={col}
              value={colInput} 
              onChange={handleColInputChange} />
              <br />
              <label>Row:</label><br />
              <input type="number" 
              defaultValue={row}
              value={rowInput}
              onChange={handleRowInputChange} />
              <br /><br />
              <button onClick={changeBoardSize}>Change</button>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Game;