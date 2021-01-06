import React, { useContext, useEffect, useState } from 'react';
import { Button, Input, Modal, ModalFooter, ModalHeader, ModalBody} from 'reactstrap';
import { FaCircle, FaWindowClose } from 'react-icons/fa';

import './css/style.css';

import SocketContext from '../../../contexts/SocketContext';
import authenticationService from '../../../services/authentication';
import systemConstant from '../../../config/constant';
import defaultAvatar from './images/default-avatar.png';

function OnlineUsersWindow({ room }) {
  // --- Context
  const socket = useContext(SocketContext);

  // --- State
  const [isHiddenWindow, setIsHiddenWindow] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [user, setUser] = useState();
  const [userInfoModal, setUserInfoModal] = useState(false);
  const userInfoToggle = () => {
    setUserInfoModal(!userInfoModal);
  };
  const [notification, setNotification] = useState('');
  const [notificationModal, setNotificationModal] = useState(false);
  const notificationToggle = () => {
    setNotificationModal(!notificationModal);
  };
  const [invitionInfo, setInvitionInfo] = useState();
  const [invitionModal, setInvitionModal] = useState(false);
  const invitionToggle = () => {
    setInvitionModal(!invitionModal);
  };

  // --- Effect hook
  useEffect(() => {
    socket.on('online users', onlineUsers => {
      setOnlineUsers(onlineUsers);
    });
    socket.on('receive invition', ({from, to, room}) => {
      if(authenticationService.getUserId() === to) {
        invitionToggle();
        setInvitionInfo({from: from, to: to, room: room});
      }
    });
  }, []);

  // --- Handle functions
  const handleInviteButtonOnClick = userId => {
    setNotification('Your invitation has been sent, please wait for a response!');
    notificationToggle();
    const info = {
      from: authenticationService.getUserId(),
      to: userId,
      room: room
    }
    socket.emit('invite', info);
  };

  const handleAcceptButtonOnClick = event => {
    event.preventDefault();
    const destRoom = {
      userId: invitionInfo && invitionInfo.to,
      roomId: invitionInfo && invitionInfo.room.id,
      password: invitionInfo && invitionInfo.room.password
    };
    socket.emit('join room', destRoom, data => {
      if(data.ok) {
        window.open(systemConstant.CLIENT_URL + '/game-room/' + data.item.id, '_self');
      } else {
        
      }
    });
  };

  const handleDetailButtonOnClick = user => {
    setUser(user);
    userInfoToggle();
  };

  const openForm = event => {
    event.preventDefault();
    setIsHiddenWindow(false);
  };
  
  const closeForm = event => {
    event.preventDefault();
    setIsHiddenWindow(true);
  };

  return (
    <>
      <Button className="open-button" onClick={openForm}>Online Users</Button>

      <div className="online-users-popup" hidden={isHiddenWindow}>
        <form className="form-container">
          <div className="row">
            <div className="col-lg-9"><h3>Online Users</h3></div>     
            <div className="col-lg-3 text-right"><Button color="danger" onClick={closeForm}><FaWindowClose /></Button></div>
          </div>
          <hr />
          <div className="online-users-list">
            {
              onlineUsers && onlineUsers.map((item, index) => {
                return (
                  <div>
                    <div className="online-users-item row">
                      <div className="col-lg-7"><FaCircle fill="green" />&nbsp;<span>{item.name}</span></div>
                      <div className="col-lg-5 d-flex justify-content-end">
                        <Button hidden={!room} color="success" onClick={() => handleInviteButtonOnClick(item.id)}>Invite</Button>
                        &nbsp;
                        <Button color="primary" onClick={() => handleDetailButtonOnClick(item)}>Detail</Button>
                      </div>
                      <Modal isOpen={userInfoModal} toggle={userInfoToggle}>
                        <ModalHeader toggle={userInfoToggle}>User Profile</ModalHeader>
                        <ModalBody>
                          <div id="settings">  
                            <div className="d-flex justify-content-center">
                              <img src={defaultAvatar} 
                              className="avatar"
                              width="200px" alt="Avatar" />
                            </div>                    
                            <div>
                              <h6>Name</h6>
                              <div className="col-lg-12">
                                <Input type="search" 
                                value={user && user.name}
                                readOnly />
                              </div>
                            </div>
                            <div>
                              <h6>Created Date</h6>
                              <div className="col-lg-12">
                                <Input type="search" 
                                value={user && user.createdDate}
                                readOnly />
                              </div>
                            </div>
                            <div>
                              <h6>Total</h6>
                              <div className="col-lg-12">
                                <Input type="search" 
                                value={0}
                                readOnly />
                              </div>
                            </div>
                            <div>
                              <h6>Win</h6>
                              <div className="col-lg-12">
                                <Input type="search" 
                                value={0}
                                readOnly />
                              </div>
                            </div>
                            <div>
                              <h6>Lost</h6>
                              <div className="col-lg-12">
                                <Input type="search" 
                                value={0}
                                readOnly />
                              </div>
                            </div>
                            <div>
                              <h6>Draw</h6>
                              <div className="col-lg-12">
                                <Input type="search" 
                                value={0}
                                readOnly />
                              </div>
                            </div>
                            <div>
                              <h6>Win Percent</h6>
                              <div className="col-lg-6 d-flex">
                                <Input type="search" 
                                value={0}
                                readOnly />
                                &nbsp;
                                <span>(%)</span>
                              </div>
                            </div>
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Button color="success" onClick={userInfoToggle}>Invite</Button>
                          <Button color="secondary" onClick={userInfoToggle}>Cancel</Button>
                        </ModalFooter>
                      </Modal>

                      <Modal isOpen={notificationModal} toggle={notificationToggle}>
                        <ModalHeader toggle={notificationToggle}>Notification</ModalHeader>
                        <ModalBody>
                          <div id="settings">  
                            {notification}
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Button color="success" onClick={notificationToggle}>Ok</Button>
                        </ModalFooter>
                      </Modal>

                      <Modal isOpen={invitionModal} toggle={invitionToggle}>
                        <ModalHeader toggle={invitionToggle}>Invition</ModalHeader>
                        <ModalBody>
                          <div id="settings">
                            <div>
                              <div>From: {invitionInfo && invitionInfo.from.name}</div>
                            </div>
                            <div>
                              <div>Room: {invitionInfo && invitionInfo.room.name}</div>
                            </div>
                            <div>
                              <div>Room type: {invitionInfo && invitionInfo.room.type}</div>
                            </div>
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Button color="success" onClick={handleAcceptButtonOnClick}>Accept</Button>
                          <Button color="secondary" onClick={invitionToggle}>Deny</Button>
                        </ModalFooter>
                      </Modal>
                    </div>
                    <hr />
                  </div>
                );
              })
            }
          </div>
          <hr />
        </form>
      </div>
    </>
  );
}

export default OnlineUsersWindow;