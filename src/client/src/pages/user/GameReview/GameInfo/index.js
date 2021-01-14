import React from 'react';
import { Button, Row, Col } from 'reactstrap';
import authentication from '../../../../services/authentication';
import systemContant from '../../../../config/constant';

import PlayerCard from './PlayerCard';

function GameInfo({match}) {
  // --- Handle functions
  const handleLeaveRoomButtonOnClick = event => {
    event.preventDefault();
    window.open(systemContant.CLIENT_URL + authentication.isAdmin() ? '/admin/dashboard' : '/dashboard', '_self');
  };
  
  return(
    <>
      <div className="row">
        <div className="col-lg-9">
          <h5>Match</h5>
          <div>ID: {match && match._id && match._id.toString()}</div>
        </div>
        
        <div className="col-lg-3 text-right">
          <Button color="danger"
          onClick={handleLeaveRoomButtonOnClick}>Leave Match</Button>
        </div> 
      </div>
      <hr />
      <Row>
        <Col lg={6}>
          <PlayerCard match={match} isXPlayer={true} player={match.xPlayer} />
        </Col>
        <Col lg={6}>
          <PlayerCard match={match} isXPlayer={false} player={match.oPlayer} />
        </Col>
      </Row>
    </>
  );
}

export default GameInfo;