import systemConstant from '../../config/constant';
import authenticationSevice from '../../services/authentication';

export default {
  getAll: function() {
    return fetch(systemConstant.SERVER_URL + '/matches-history', {
      method: 'GET',
      headers: {
        'Authorization': authenticationSevice.getBearerToken()
      }
    })
    .then(res => res.json());
  },
  getByUserId: function(userId) {
    return fetch(systemConstant.SERVER_URL + '/matches-history/' + userId, {
      method: 'GET',
      headers: {
        'Authorization': authenticationSevice.getBearerToken()
      }
    })
    .then(res => res.json());
  }
};