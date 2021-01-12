import React from 'react';
import { FaArrowCircleDown, FaArrowCircleUp, FaArrowUp, FaCircleNotch, FaPercent, FaTimes, FaTrophy } from 'react-icons/fa';
import './css/style.css';

import playerAvatar from './images/default-avatar.png';
import Timer from './Timer';

function PlayerCard({room, reset, isXPlayer, player, timeout}) {
  return(
    <>
      <div className="player-header text-white">
        {isXPlayer && <FaTimes fill="red" />} 
        {!isXPlayer && <FaCircleNotch fill="green" />} 
        &nbsp;&nbsp;&nbsp;
        {player && player.name}
      </div>
  
      <div className="player-body bg-white">
        <div className="row">
          <div className="col-lg-6">
            <img className="rounded-circle" src={playerAvatar} atl="player-avatar" width="60px" height="60px" />
            <br /><br />
            <Timer room={room} reset={reset} isXPlayer={isXPlayer} timeout={timeout} />
          </div>
          <div className="col-lg-6">
            <div><FaTrophy fill="orange" /> {player && player.trophies}</div>
            <div><FaArrowCircleUp fill="green" /> {player && player.win}</div>
            <div><FaArrowCircleDown fill="red" /> {player && player.lost}</div>
            <div><FaPercent fill="blue" /> {player && player.total !== 0 ? player.win / player.total : 0} %</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PlayerCard;