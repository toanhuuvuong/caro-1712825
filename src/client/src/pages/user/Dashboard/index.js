import React, { useEffect, useContext, useState } from 'react';
import { Table, Button } from 'reactstrap';

import SocketContext from '../../../contexts/SocketContext';
import authenticationService from '../../../services/authentication';
import systemContant from '../../../config/constant';

function Dashboard() {
  // --- Context
  const socket = useContext(SocketContext);

  // --- State
  // Main
  const [rooms, setRooms] = useState([]);

  // --- Effect hook
  useEffect(() => {
    socket.emit('get rooms');
    socket.on('get rooms', rooms => {
      setRooms(rooms);
    });
  }, []);

  // --- Handle functions
  const handleCreateRoomButtonOnClick = event => {
    event.preventDefault();
    socket.emit('create room', authenticationService.getUserId(), data => {
      if(data.ok) {
        window.open(systemContant.CLIENT_URL + '/game-room/' + data.item.id, '_self');
      }
    });
  };

  const handleJoinRoomButtonOnClick = roomId => {
    socket.emit('join room', {
      userId: authenticationService.getUserId(),
      roomId: roomId
    }, data => {
      if(data.ok) {
        window.open(systemContant.CLIENT_URL + '/game-room/' + data.item.id, '_self');
      } else {
        if(data.item) {
          window.open(systemContant.CLIENT_URL + '/game-room/' + roomId, '_self');
        }
      }
    });
  };

  return(
    <div>
      <div className="title">
        <h1>User Dashboard</h1>
      </div>
      <hr />
      <div className="subtitle">
        <h5>List Game Rooms:</h5>
        <Button onClick={handleCreateRoomButtonOnClick}>New Game Room</Button>
      </div>    
      
      <div className="col-sm-12">
        <Table responsive bordered>
          <thead>
            <tr>
              <th></th>
              <th>Room Id</th>
              <th>X Player</th>
              <th>O Player</th>
              <th>Viewer</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
          {
            rooms && rooms.map((item, index) => {
              return (
                <tr key={item.id}>
                  <td scope="row">{index + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.xPlayer && item.xPlayer.username}</td>
                  <td>{item.oPlayer && item.oPlayer.username}</td>
                  <td>
                    <ul>
                    {
                      item.viewers && item.viewers.map(viewer => {
                        return <li>{viewer.username}</li>
                      })
                    }
                    </ul>
                  </td>
                  <td>
                    <Button color="success" 
                    onClick={() => handleJoinRoomButtonOnClick(item.id)}>Join</Button>
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

export default Dashboard;