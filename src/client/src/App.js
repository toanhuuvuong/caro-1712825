import React from 'react';

import Menu from './components/Menu';

import './App.css';

import authenticationService from './services/authentication';
import SocketProvider from './contexts/SocketProvider';

function App() {
  return (
    <SocketProvider>
      <div className={authenticationService.getRole() === "admin" ? "AppAdmin" : "App"}>
        <Menu />
      </div>
    </SocketProvider>
  );
}

export default App;
