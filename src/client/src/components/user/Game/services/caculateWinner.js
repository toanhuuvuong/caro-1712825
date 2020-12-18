export default function caculateWinner(col, squares) {
  const generateLines = (col, length) => {
    var lines = [];
    var i;
    let row;
    for (i = 0; i < length; i++) {
      row = Number.parseInt(i/col);
      if(i >= row*col + 2) {
        lines.push([i, i - 1, i - 2]);
      }
      if(i >= row*col + 2 && i >= 2*col) {
        lines.push([i, i - col - 1, i - 2*col - 2]);
      }
      if(i >= 2*col) {
        lines.push([i, i - col, i - 2*col]);
      }
      if(i < (row + 1)*col - 2 && i >= 2*col) {
        lines.push([i, i - col + 1, i - 2*col + 2]);
      }
      if(i < (row + 1)*col - 2) {
        lines.push([i, i + 1, i + 2]);
      }
      if(i < (row + 1)*col - 2 && i < length - 2*col) {
        lines.push([i, i + col + 1, i + 2*col + 2]);
      }
      if(i < length - 2*col) {
        lines.push([i, i + col, i + 2*col]);
      }
      if(i >= row*col + 2 && i < length - 2*col) {
        lines.push([i, i + col - 1, i + 2*col - 2]);
      }
    }
  
    return lines;
  }

  const lines = generateLines(col, squares.length);
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[b] && squares[c] && 
      squares[a].value === squares[b].value && squares[a].value === squares[c].value) {
      return ({
        value: squares[a].value,
        indexs: [a, b, c]
      });
    }
  }
  return null;
}