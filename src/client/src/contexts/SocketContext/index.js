import React from 'react';
import { createContext } from 'react';

import socket from '../../socket/socket';

const SocketContext = createContext();

export function SocketProvider({children}) {
  return(
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;