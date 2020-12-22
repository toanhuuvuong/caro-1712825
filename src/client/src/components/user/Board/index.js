import React from 'react';

import Square from '../Square';

function Board({squares, onClick, col, row}) {
  // --- Handle functions
  const renderSquare = (i) => {
    return (
      <Square key={i} value={squares[i] ? squares[i].value : null} 
      isHighlight={squares[i] ? squares[i].isHighlight : null}
      onClick={() => onClick(i)} />
    );
  };

  const renderRow = (i, col) => {
    let row = [];
    for(let j = 0; j < col; j++) {
      row.push(renderSquare(i + j));
    }
    return row;
  };

  const renderBoard = (col, row) => {
    let board = [];
    for(let i = 0; i < row; i++) {
      board.push(
        <div key={i} className="board-row">{renderRow(i * col, col)}</div>
      );
    }
    return board;
  };

  // --- Render
  return(
    <div>
      {renderBoard(col, row)}
    </div>
  );
}

export default Board;