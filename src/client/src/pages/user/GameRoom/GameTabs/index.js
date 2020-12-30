import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';

import SocketContext from '../../../../contexts/SocketContext';
import authenticationService from '../../../../services/authentication';
import systemContant from '../../../../config/constant';

function GameTabs({room, player, actions}) {
  // --- Params
  const { roomId } = useParams();

  // --- Context
  const socket = useContext(SocketContext);

  // --- State
  const [activeTab, setActiveTab] = useState('1');
  const toggle = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  }

  // --- Handle functions
  
  return(
    <>
      <Nav tabs>
        <NavItem>
          <NavLink className={activeTab === '1' ? 'active' : ''}
          onClick={() => { toggle('1'); }}>
            Chat
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab === '2' ? 'active' : ''}
          onClick={() => { toggle('2'); }}>
            Viewers
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab === '3' ? 'active' : ''}
          onClick={() => { toggle('3'); }}>
            Steps
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab === '4' ? 'active' : ''}
          onClick={() => { toggle('4'); }}>
            Settings
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col lg="12">
              <h4>Chat Here</h4>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col lg="12">
              <ol>
              {
                room && room.viewers && room.viewers.map(viewer => {
                  return <li>{viewer.username}</li>
                })
              }
              </ol>
              {
                room && room.viewers.length === 0 && <h4>No one</h4>
              }
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="3">
          <Row>
            <Col lg="12">
              <h4>Step Here</h4>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="4">
          <Row>
            <Col lg="12">
              <h4>Settings Here</h4>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </>
  );
}

export default GameTabs;