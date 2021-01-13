import React, { useEffect } from 'react';

import './css/style.css';

function GameViewers({room}) {
  // --- Effect hook
  useEffect(() => {
    // Scroll top
    const viewers = document.getElementById('viewers');
    viewers.scrollTop = viewers.scrollHeight;
  }, []);

  return(
    <>  
      <div id="viewers">
        {
          room && room.viewers.length === 0 && <h4>No one</h4>
        }
        <ol>
        {
          room && room.viewers && room.viewers.map(viewer => {
            return <li><a href="#">{viewer.username}</a></li>
          })
        }
        </ol>
      </div>
    </>
  );
}

export default GameViewers;