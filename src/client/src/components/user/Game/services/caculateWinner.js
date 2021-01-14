const generateLines = function(col, length) {
  let lines = [];
  let row;
  for (let i = 0; i < length; i++) {
    row = Number.parseInt(i/col);
    if(i >= row*col + 4) {
      lines.push([i, i - 1, i - 2, i - 3, i - 4]);
    }
    if(i >= row*col + 4 && i >= 4*col) {
      lines.push([i, i - col - 1, i - 2*col - 2, i - 3*col - 3, i - 4*col - 4]);
    }
    if(i >= 4*col) {
      lines.push([i, i - col, i - 2*col, i - 3*col, i - 4*col]);
    }
    if(i < (row + 1)*col - 4 && i >= 4*col) {
      lines.push([i, i - col + 1, i - 2*col + 2, , i - 3*col + 3, i - 4*col + 4]);
    }
    if(i < (row + 1)*col - 4) {
      lines.push([i, i + 1, i + 2, i + 3, i + 4]);
    }
    if(i < (row + 1)*col - 4 && i < length - 4*col) {
      lines.push([i, i + col + 1, i + 2*col + 2, i + 3*col + 3, i + 4*col + 4]);
    }
    if(i < length - 4*col) {
      lines.push([i, i + col, i + 2*col, i + 3*col, i + 4*col]);
    }
    if(i >= row*col + 4 && i < length - 4*col) {
      lines.push([i, i + col - 1, i + 2*col - 2, i + 3*col - 3, i + 4*col - 4]);
    }
  }

  return lines;
};

export default function caculateWinner(col, squares) {
  const lines = generateLines(col, squares.length);
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (squares[a] && squares[b] && squares[c] && squares[d] && squares[e] &&
      squares[a].value === squares[b].value && squares[a].value === squares[c].value && 
      squares[a].value === squares[d].value && squares[a].value === squares[e].value) {
      return ({
        value: squares[a].value,
        indexs: [a, b, c, d, e]
      });
    }
  }
  return null;
}