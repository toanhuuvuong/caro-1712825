import authenticationSevice from '../../services/authentication';

export default {
  logout: function() {
    authenticationSevice.logout();
  }
};