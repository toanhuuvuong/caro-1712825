import systemConstant from '../../config/constant';
import authenticationSevice from '../../services/authentication';

export default {
  getAll: function() {
    return fetch(systemConstant.SERVER_URL + '/users', {
      method: 'GET',
      headers: {
        'Authorization': authenticationSevice.getBearerToken()
      }
    })
    .then(res => res.json());
  },
  getById: function(id) {
    return fetch(systemConstant.SERVER_URL + '/users/' + id, {
      method: 'GET',
      headers: {
        'Authorization': authenticationSevice.getBearerToken()
      }
    })
    .then(res => {
      return res.json();
    });
  },
  update: function(body) {
    return fetch(systemConstant.SERVER_URL + '/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authenticationSevice.getBearerToken()
      },
      body: JSON.stringify(body)
    })
    .then(res => {
      return res.json();
    });
  }
};