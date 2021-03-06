import React, { useEffect, useContext } from 'react';

import logoutAPI from '../../../api/common/logout';
import systemContant from '../../../config/constant';
import authentication from '../../../services/authentication';
import SocketContext from '../../../contexts/SocketContext';

function Logout() {
  // --- Context
  const socket = useContext(SocketContext);

  // --- Effect
  useEffect(() => {
    socket.emit('logout', authentication.getUserId(), () => {
      logoutAPI.logout();
      window.open(systemContant.CLIENT_URL + '/login', '_self');
    });
  }, []);

  // --- Render
  return <div></div>;
}

export default Logout;