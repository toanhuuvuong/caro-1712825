import React from 'react';

function Square({isHighlight, onClick, value}) {
  return (
    <button className={"square" + (isHighlight ? " highlight" : "")}
    onClick={() => {onClick();}}>
      {value}
    </button>
  );
}

export default Square;