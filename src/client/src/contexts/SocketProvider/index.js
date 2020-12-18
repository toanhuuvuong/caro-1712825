import React from 'react';

import SocketContext from '../SocketContext';
import socket from '../../socket/socket';

function SocketProvider({children}) {
  return(
    <SocketContext.Provider value={socket}>
    {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;