import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Input, Label } from 'reactstrap';

import './css/style.css';

import SocketContext from '../../../../../contexts/SocketContext';

function GameSettings({room, player, col, row, history, isAsc, actions}) {
  // --- Params
  const { roomId } = useParams();

  // --- Context
  const socket = useContext(SocketContext);

  // --- State
  // Main
  // Input
  const [colInput, setColInput] = useState('');
  const [rowInput, setRowInput] = useState('');

  // --- Effect hook
  useEffect(() => {
    setColInput(col);
    setRowInput(row);
    // Scroll top
    const settings = document.getElementById('settings');
    settings.scrollTop = settings.scrollHeight;
  }, []);

  // --- Handle functions
  const handleColInputChange = event => {
    setColInput(event.target.value);
  };

  const handleRowInputChange = event => {
    setRowInput(event.target.value);
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
    if(colNumber < 5 || rowNumber < 5 || 
      colNumber > 30 || rowNumber > 30) {
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
  };

  return(
    <>  
      <div id="settings">
        <div>
          <h6>Sort</h6>
          <div className="d-flex">
            <div className="sort-item">
              <Input type="radio" name="sort" value="asc" 
              onClick={() => sort('asc')} defaultChecked={isAsc} disabled={!player} />
              &nbsp;
              <Label>Ascending</Label>
            </div>
            
            &nbsp;&nbsp;&nbsp;
            
            <div className="sort-item">
              <Input type="radio" name="sort" value="desc"
              onClick={() => sort('desc')} defaultChecked={!isAsc} disabled={!player} />
              &nbsp;
              <Label>Descending</Label>
            </div>
          </div>
        </div>

        <div>
          <h6>Board size</h6>
          <div className="row">
            <div className="col-lg-5 d-flex">
              <Label>Column:</Label>
              &nbsp;
              <Input type="number" 
              value={colInput} 
              max={30} min={5}
              onChange={handleColInputChange} disabled={!player} />
            </div>
            
            &nbsp;&nbsp;&nbsp;
            
            <div className="col-lg-5 d-flex">
              <Label>Row:</Label>
              &nbsp;
              <Input type="number" 
              value={rowInput}
              max={30} min={5}
              onChange={handleRowInputChange} disabled={!player} />
            </div>
          </div>
          <br />
          <Button onClick={changeBoardSize} disabled={!player}>Change</Button>
        </div>
      </div>
    </>
  );
}

export default GameSettings;