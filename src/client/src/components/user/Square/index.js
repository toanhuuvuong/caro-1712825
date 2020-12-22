import React from 'react';

function Square({isHighlight, onClick, value}) {
  const hightlightClassName = isHighlight ? " highlight" : "";

  return (
    <button className={"square" + hightlightClassName}
    onClick={onClick}>
      {value}
    </button>
  );
}

export default Square;