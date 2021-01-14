import React, { useEffect, useState } from 'react';
import { Table, Input, Button } from 'reactstrap';

import './css/style.css';

import Breadcrumbs from '../../../components/admin/Breadcrumbs';
import matchAPI from '../../../api/user/match';
import systemConstant from '../../../config/constant';
import Badge from 'reactstrap/lib/Badge';

function ListMatch() {
  // --- State
  // Main
  const [matches, setMatches] = useState([]);

  // --- Effect hook
  useEffect(() => {
    matchAPI.getAll()
    .then(data => {
      if (data.ok) {
        setMatches(data.items);
      }
    });
  }, []);

  // --- Handle functions
  const handleWatchButtonOnClick = id => {
    window.open(systemConstant.CLIENT_URL + '/game-review/' + id, '_self')
  };

  return(
    <>
      <Breadcrumbs currentItem="List matches" />
      <div className="d-flex justify-content-between table-header">
        <h3>Matches Table</h3>
      </div>
      <div className="body">
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
          {(!matches || matches.length === 0) &&
            <tr>
              <td colspan={5}>No match :(</td>
            </tr>
          }
          {
            matches && matches.map((item, index) => {
              let result = null;
              let color = null;
              if(!item.result) {
                result = 'Draw';
                color = 'primary';
              } else {
                result = item.result;
                color = 'success';
              }
              return (
                <tr key={item.id}>
                  <td scope="row">#{index + 1}</td>
                  <td>{item.roomId}</td>
                  <td>{item.xPlayer}</td>
                  <td>{item.oPlayer}</td>
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
    </>
  );
}

export default ListMatch;