import React, { useEffect, useState, useContext } from 'react';
import { Table } from 'reactstrap';

import { FaCircle } from 'react-icons/fa'
import SocketContext from '../../../contexts/SocketContext';

function Dashboard() {
  // --- Context
  const socket = useContext(SocketContext);

  // --- State
  // Main
  const [onlineUsers, setOnlineUsers] = useState([]);

  // --- Effect hook
  useEffect(() => {
    socket.on('online users', onlineUsers => {
      setOnlineUsers(onlineUsers);
    });
  }, []);

  return(
    <div className="app-container">
      <div className="title">
        <h1>Admin Dashboard</h1>
      </div>
      <hr />
      <div className="subtitle">
        <h5>List Online Users:</h5>
      </div>
      <div className="body col-sm-6">
        <Table responsive bordered>
          <thead>
            <tr>
              <th></th>
              <th>Username</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
          {
            onlineUsers && onlineUsers.map((item, index) => {
              return (
                <tr key={item.id}>
                  <td scope="row">{index + 1}</td>
                  <td>{item.username}</td>
                  <td>{item.name}</td>
                  <td>{item.role}</td>
                  <td>
                    <FaCircle fill="green" />
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