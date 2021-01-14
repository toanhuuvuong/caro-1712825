import React from 'react';
import { FaArrowCircleDown, FaArrowCircleUp, FaArrowUp, FaCircleNotch, FaPercent, FaPlusCircle, FaTimes, FaTrophy } from 'react-icons/fa';
import './css/style.css';

import playerAvatar from './images/default-avatar.png';
import Timer from './Timer';

function PlayerCard({match, isXPlayer, player}) {
  return(
    <>
      <div className="player-header text-white">
        {isXPlayer && <FaTimes fill="red" />} 
        {!isXPlayer && <FaCircleNotch fill="green" />} 
        &nbsp;&nbsp;&nbsp;
        {player}
      </div>
  
      <div className="player-body bg-white">
        <div className="row">
          <div className="col-lg-6">
            <img className="rounded-circle" src={playerAvatar} atl="player-avatar" width="60px" height="60px" />
            <br /><br />
            <Timer isXPlayer={isXPlayer}/>
          </div>
          <div className="col-lg-6">
            <div><FaTrophy fill="orange" /> Trophy: {}</div>
            <div><FaArrowCircleUp fill="green" /> Win: {}</div>
            <div><FaArrowCircleDown fill="red" /> Lost: {}</div>
            <div><FaPlusCircle fill="violet" /> Total: {}</div>
            <div><FaPercent fill="blue" /> Percent: {} %</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlayerCard;