import React from 'react';
import Square from '../Square';

function Board({squares, onClick, col, row}) {
  const renderSquare = (i) => {
    return (
      <Square key={i} value={squares[i] ? squares[i].value : null} 
      isHighlight={squares[i] ? squares[i].isHighlight : null}
      onClick={() => {onClick(i);}} />
    );
  };

  const renderRow = (i, col) => {
    let row = [];
    let j;
    for (j = 0; j < col; j++) {
      row.push(renderSquare(i + j));
    }

    return row;
  };

  const renderBoard = (col, row) => {
    let board = [];
    let i;
    for (i = 0; i < row; i++) {
      board.push(
        <div key={i} className="board-row">{renderRow(i * col, col)}</div>
      );
    }

    return board;
  };

  return (
    <div>
      {renderBoard(col, row)}
    </div>
  );
}

export default Board;