import systemConstant from '../../config/constant';
import authenticationSevice from '../../services/authentication';

export default {
  update: function(userId, status) {
    const body = {
      isDeleted: status
    };

    return fetch(systemConstant.SERVER_URL + '/admin/edit-user/' + userId, {
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