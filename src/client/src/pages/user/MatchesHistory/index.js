import React, { useEffect, useState } from 'react';
import { FaTrophy } from 'react-icons/fa';
import { Table, Button } from 'reactstrap';
import Badge from 'reactstrap/lib/Badge';

import matchesHistoryAPI from '../../../api/user/matches-history';
import authentication from '../../../services/authentication';
import systemConstant from '../../../config/constant';

function MatchesHistory() {
  // --- State
  // Main
  const [matchesHistory, setMatchesHistory] = useState([]);

  // --- Effect hook
  useEffect(() => {
    matchesHistoryAPI.getAll()
    .then(data => {
      if(data.ok) {
        setMatchesHistory(data.items);
      }
    })
  }, []);

  const handleWatchButtonOnClick = id => {
    window.open(systemConstant.CLIENT_URL + '/game-review/' + id, '_self');
  };

  return(
    <div className="app-container">
      <div className="title">
        <h1>Matches Played</h1>
      </div>
      <hr />
      <div className="subtitle">
        <h5></h5>
      </div>
      <div className="body col-lg-12">
        <Table responsive bordered>
          <thead>
            <tr>
              <th></th>
              <th>Room Id</th>
              <th>X Player</th>
              <th>O Player</th>
              <th>Result</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
          {
            matchesHistory && matchesHistory.map((item, index) => {
              let result = null;
              let color = null;
              if(!item.result) {
                result = 'Draw';
                color = 'primary';
              } else if(item.result === authentication.getUserId()) {
                result = 'Win';
                color = 'success';
              } else {
                result = 'Lost';
                color = 'danger';
              }
              return (
                <tr key={item.id}>
                  <td scope="row">#{index + 1}</td>
                  <td>{item.roomId}</td>
                  <td>{item.xPlayer === authentication.getUserId() ? <Badge>You</Badge> : item.xPlayer}</td>
                  <td>{item.oPlayer === authentication.getUserId() ? <Badge>You</Badge> : item.oPlayer}</td>
                  <td><Badge color={color}>{result}</Badge></td>
                  <td>
                    <Button color="success" onClick={() => handleWatchButtonOnClick(item._id.toString())}>Watch</Button>
                  </td>
                </tr>
              );
            })
          }
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default MatchesHistory;