import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';

import SocketContext from '../../../../contexts/SocketContext';
import GameChat from './GameChat';
import GameSteps from './GameSteps';

function GameTabs({col, row, history, isAsc, stepNumber, xIsNext, didFindWinner, actions}) {
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
            Steps
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col lg="12">
              <GameChat />
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col lg="12">
              <GameSteps col={col} 
              history={history} 
              stepNumber={stepNumber}
              actions={actions} />
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </>
  );
}

export default GameTabs;