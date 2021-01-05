import React, { useEffect, useContext, useState } from 'react';
import { 
  Table, Button, Badge, Input, Label, 
  Modal, ModalHeader, ModalBody, ModalFooter 
} from 'reactstrap';
import { FaSearch, FaSync } from 'react-icons/fa';

import SocketContext from '../../../contexts/SocketContext';
import authenticationService from '../../../services/authentication';
import systemContant from '../../../config/constant';
import searchEngine from './services/search-engine';
import OnlineUsersWindow from '../../../components/user/OnlineUsersWindow';

function Dashboard() {
  // --- Context
  const socket = useContext(SocketContext);

  // --- State
  // Main
  const [rooms, setRooms] = useState([]);
  const [roomType, setRoomType] = useState('public');
  const [roomSettingsModal, setRoomSettingsModal] = useState(false);
  const roomSettingsToggle = () => {
    setRoomSettingsModal(!roomSettingsModal);
    setRoomType('public');
    setTimeoutInput(1);
    setPasswordInput('');
  };
  const [selectedRoomId, setSelectedRoomId] = useState();
  const [roomPasswordModal, setRoomPasswordModal] = useState(false);
  const roomPasswordToggle = () => {
    setRoomPasswordModal(!roomPasswordModal);
    setPasswordInput('');
  };
  // Input
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordInputIsHidden, setPasswordInputIsHidden] = useState(true);
  const [timeoutInput, setTimeoutInput] = useState(1);
  const [keySearchInput, setKeySearchInput] = useState('');

  // --- Effect hook
  useEffect(() => {
    socket.emit('get rooms');
    socket.on('get rooms', rooms => {
      setRooms(rooms);
    });
  }, []);

  // --- Handle functions
  const handleKeySearchInputChange = event => {
    setKeySearchInput(event.target.value);
  };

  const handleTimeoutInputChange = event => {
    setTimeoutInput(event.target.value);
  };

  const handlePasswordInputChange = event => {
    setPasswordInput(event.target.value);
  };

  const handleSearchButtonOnClick = event => {
    event.preventDefault();
    if(keySearchInput) {
      const result = searchEngine.search(keySearchInput, rooms);
      setRooms(result);
      setKeySearchInput('');
    }
  };

  const handleRefreshButtonOnClick = event => {
    event.preventDefault();
    window.open(window.location.href, '_self')
  };

  const handleRoomTypeRadioButtonOnClick = roomType => {
    setRoomType(roomType);

    if(roomType === 'private') {
      setPasswordInputIsHidden(false);
    } else {
      setPasswordInputIsHidden(true);
    }
  };

  const handleCreateRoomButtonOnClick = event => {
    event.preventDefault();
    const room = {
      userId: authenticationService.getUserId(),
      type: roomType,
      password: passwordInput,
      timeout: timeoutInput
    };
    socket.emit('create room', room, data => {
      if(data.ok) {
        window.open(systemContant.CLIENT_URL + '/game-room/' + data.item.id, '_self');
      }
    });
  };

  const handleJoinRoomButtonOnClick = (roomId, roomType) => {
    const room = {
      userId: authenticationService.getUserId(),
      roomId: roomId,
      password: ''
    };
    if(roomType === 'public') {
      socket.emit('join room', room, data => {
        if(data.ok) {
          window.open(systemContant.CLIENT_URL + '/game-room/' + data.item.id, '_self');
        } else {
          if(data.item) {
            window.open(systemContant.CLIENT_URL + '/game-room/' + roomId, '_self');
          }
        }
      });
    } else {
      setSelectedRoomId(roomId);
      roomPasswordToggle();
    }
  };

  const handleSubmitButtonOnClick = event => {
    event.preventDefault();
    const room = {
      userId: authenticationService.getUserId(),
      roomId: selectedRoomId,
      password: passwordInput
    };
    socket.emit('join room', room, data => {
      if(data.ok) {
        window.open(systemContant.CLIENT_URL + '/game-room/' + data.item.id, '_self');
      } else {
        
      }
    });
  };

  return(
    <div>
      <OnlineUsersWindow />

      <div className="title">
        <h1>User Dashboard</h1>
      </div>
      <hr />
      <div className="d-flex justify-content-between table-header">
        <div className="d-flex">
          <h3>Rooms Table</h3>
          &nbsp;&nbsp;&nbsp;
          <Button onClick={roomSettingsToggle}>New Game Room</Button>
          <Modal isOpen={roomSettingsModal} toggle={roomSettingsToggle}>
            <ModalHeader toggle={roomSettingsToggle}>Room Settings</ModalHeader>
            <ModalBody>
              <div id="settings">
                <div>
                  <h6>Room Type</h6>
                  <div className="col-lg-12 d-flex">
                    <div className="sort-item">
                      <Input type="radio" name="room-type" value="public" 
                      onClick={() => handleRoomTypeRadioButtonOnClick('public')} defaultChecked={true} />
                      &nbsp;
                      <Label>Public</Label>
                    </div>
                    
                    &nbsp;&nbsp;&nbsp;
                    
                    <div className="sort-item">
                      <Input type="radio" name="room-type" value="private"
                      onClick={() => handleRoomTypeRadioButtonOnClick('private')} />
                      &nbsp;
                      <Label>Private</Label>
                    </div>
                  </div>
                </div>

                <div hidden={passwordInputIsHidden}>
                  <h6>Password</h6>
                  <div className="col-lg-12">
                    <Input type="password" 
                    value={passwordInput}
                    onChange={handlePasswordInputChange} />
                  </div>
                </div>

                <div>
                  <h6>Timeout</h6>
                  <div className="col-lg-6 d-flex">
                    <Input type="number" 
                    defaultValue={0}
                    value={timeoutInput}
                    min="1"
                    onChange={handleTimeoutInputChange} />
                    &nbsp;
                    <span>(minutes)</span>
                  </div>             
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={handleCreateRoomButtonOnClick}>Create</Button>
              <Button color="secondary" onClick={roomSettingsToggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
        
        <div className="d-flex">
          <Input placeholder="Nhập ID phòng chơi..."
          value={keySearchInput}
          onChange={handleKeySearchInputChange}></Input>
          <Button onClick={handleSearchButtonOnClick}><FaSearch /></Button>
          &nbsp;
          <Button color="primary" onClick={handleRefreshButtonOnClick}><FaSync /></Button>
        </div>
      </div> 
      
      <div>
        <Table responsive bordered>
          <thead>
            <tr>
              <th></th>
              <th>Room Id</th>
              <th>Room Name</th>
              <th>Room Type</th>
              <th>X Player</th>
              <th>O Player</th>
              <th>Viewer</th>
              <th>Status</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
          {(!rooms || rooms.length === 0) && 
            <tr>
              <td colspan={9}>Room not found, please refresh table for the next search :(</td>
            </tr>
          }
          {
            rooms && rooms.map((item, index) => {
              return (
                <tr key={item.id}>
                  <td scope="row">{index + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.type}</td>
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
                    <Badge color={item.xPlayer && item.oPlayer ? "primary" : "warning"}>
                    {item.xPlayer && item.oPlayer ? "Playing" : "Waiting"}
                    </Badge>
                  </td>
                  <td>
                    <Button color="success" 
                    onClick={() => handleJoinRoomButtonOnClick(item.id, item.type)}>Join</Button>
                    <Modal isOpen={roomPasswordModal} toggle={roomPasswordToggle}>
                      <ModalHeader toggle={roomPasswordToggle}>Room Password Require</ModalHeader>
                      <ModalBody>
                        <div id="settings">
                          <div>
                            <h6>Password</h6>
                            <div className="col-lg-12">
                              <Input type="password" 
                              value={passwordInput}
                              onChange={handlePasswordInputChange} />
                            </div>
                          </div>                         
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button color="success" onClick={handleSubmitButtonOnClick}>Submit</Button>
                        <Button color="secondary" onClick={roomPasswordToggle}>Cancel</Button>
                      </ModalFooter>
                    </Modal>
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