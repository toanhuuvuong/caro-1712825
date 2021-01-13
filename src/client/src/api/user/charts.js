import systemConstant from '../../config/constant';
import authenticationSevice from '../../services/authentication';

export default {
  getAll: function() {
    return fetch(systemConstant.SERVER_URL + '/charts', {
      method: 'GET',
      headers: {
        'Authorization': authenticationSevice.getBearerToken()
      }
    })
    .then(res => res.json());
  }
};