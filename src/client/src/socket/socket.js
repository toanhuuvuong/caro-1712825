import io from 'socket.io-client';

import systemConstant from '../config/constant';
import authenticationSevice from '../services/authentication';

const socket = io(systemConstant.SERVER_URL, {
  auth: {
    token: authenticationSevice.getToken()
  }
});

export default socket;