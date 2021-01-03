import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';

import SocketContext from '../../../../contexts/SocketContext';
import authenticationService from '../../../../services/authentication';
import systemContant from '../../../../config/constant';
import GameChat from './GameChat';
import GameViewers from './GameViewers';
import GameSteps from './GameSteps';
import GameSettings from './GameSettings';

function GameTabs({room, player, col, row, history, isAsc, stepNumber, xIsNext, didFindWinner, actions}) {
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
              <GameChat player={player} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col lg="12">
              <GameViewers room={room} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="3">
          <Row>
            <Col lg="12">
              <GameSteps room={room} 
              player={player} 
              col={col} 
              history={history} 
              stepNumber={stepNumber}
              actions={actions} />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="4">
          <Row>
            <Col lg="12">
              <GameSettings room={room} 
              player={player} 
              col={col} 
              row={row}
              history={history} 
              isAsc={isAsc} 
              actions={actions} />
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </>
  );
}

export default GameTabs;