export default {
  getToken: function() {
    return localStorage.getItem('token');
  },
  getBearerToken: function() {
    return 'Bearer ' + localStorage.getItem('token');
  },
  getUserId: function() {
    return localStorage.getItem('user-id');
  },
  getRole: function() {
    return localStorage.getItem('role');
  },
  login: function(resObject) {
    const {token, userId, role} = resObject;
    localStorage.setItem('token', token);
    localStorage.setItem('user-id', userId);
    localStorage.setItem('role', role);
  },
  logout: function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user-id');
    localStorage.removeItem('role');
  },
  isLogin: function() {
    return localStorage.getItem('user-id') ? true : false;
  },
  isLogout: function() {
    return localStorage.getItem('user-id') ? false : true;
  },
  isAdmin: function() {
    return localStorage.removeItem('role') === 'admin';
  }
};