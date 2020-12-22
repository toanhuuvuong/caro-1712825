import React from 'react';
import { Provider } from 'react-redux';
import './App.css';

import Menu from './components/common/Menu';
import { SocketProvider } from './contexts/SocketContext';
import store from './redux/store';

function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <div>
          <Menu />
        </div>
      </SocketProvider>
    </Provider>
  );
}

export default App;
