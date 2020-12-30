import React, { useEffect, useState, useContext } from 'react';
import { Button, Input, Label, Row, Col } from 'reactstrap';

import Board from '../Board';
import SocketContext from '../../../contexts/SocketContext';
import calculateWinner from './services/caculateWinner';

function Game({roomId, room, player, col, row, history, isAsc, stepNumber, xIsNext, didFindWinner, actions}) {
  // -- Context
  const socket = useContext(SocketContext);

  // --- State
  // Main
  // Input
  const [colInput, setColInput] = useState('');
  const [rowInput, setRowInput] = useState('');

  // -- Effect hook
  useEffect(() => {
    actions.getRoomDetail(socket, roomId);
    setColInput(col);
    setRowInput(row);
  }, []);

  // --- Handle functions
  const handleColInputChange = event => {
    setColInput(event.target.value);
  };

  const handleRowInputChange = event => {
    setRowInput(event.target.value);
  };

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

  const sort = (type) => {
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
    actions.sort(socket, roomId, fields);
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
    actions.changeBoardSize(socket, roomId, fields);
  }

  const newHistory = history;
  const current = getCurrent(newHistory);
  const winner = calculateWinner(col, current.squares);
  const moves = newHistory.map(step => {
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
  });

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
    <div className="game">
      <Row>
        <Col lg={8}>
          <div className="game-board">
            <Board col={col}
            row={row}
            squares={current.squares} 
            onClick={(i) => handleClick(i)} />
          </div>
        </Col>
        <Col lg={4}>
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
                  { isAsc && 
                    <Input type="radio" name="sort" value="asc" 
                    checked
                    onClick={() => sort('asc')} />
                  }
                  {!isAsc && 
                    <Input type="radio" name="sort" value="asc" 
                    onClick={() => sort('asc')} />
                  }
                  <Label>Ascending</Label>
                  
                  <br />

                  {isAsc && 
                    <Input type="radio" name="sort" value="desc"
                    onClick={() => sort('desc')} />
                  }
                  {!isAsc && 
                    <Input type="radio" name="sort" value="desc"
                    checked
                    onClick={() => sort('desc')} />
                  }
                  <Label>Descending</Label>
                </div>
              </li>
              <li>
                <div>Board size</div>
                <div>
                  <Label>Column:</Label>
                  <br />
                  <Input type="number" 
                  defaultValue={col}
                  value={colInput} 
                  onChange={handleColInputChange} />

                  <Label>Row:</Label>
                  <br />
                  <Input type="number" 
                  defaultValue={row}
                  value={rowInput}
                  onChange={handleRowInputChange} />

                  <br />

                  <Button onClick={changeBoardSize}>Change</Button>
                </div>
              </li>
            </ol>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Game;