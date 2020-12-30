import React from 'react';
import { FaCircleNotch, FaClock, FaTimes } from 'react-icons/fa';
import './css/style.css';

import playerAvatar from './images/default-avatar.png';

function PlayerCard({isXPlayer, player}) {
  return(
    <div>
      <div className="player-card bg-dark text-white">
        {isXPlayer && <FaTimes fill="red" />} 
        {!isXPlayer && <FaCircleNotch fill="green" />} 
        {player && player.username}
      </div>
      <div className="player-card bg-white">
        <img className="rounded-circle" src={playerAvatar} atl="player-avatar" width="60px" height="60px" />
        <br /><br />
        <div><FaClock /> 7:00</div>
      </div>
    </div>
  );
}

export default PlayerCard;