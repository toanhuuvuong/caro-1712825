import systemConstant from '../../config/constant';
import authenticationSevice from '../../services/authentication';

const validateUpdateProfileForm = (nameInput) => {
  const name = nameInput && nameInput.trim();
  const errors = [];

  if(!name) {
    errors.push('name_required');
  } 
  if(errors.length !== 0) {
    return {isValid: false, errors: errors};
  }

  const body = {
    name: name
  };
  return {
    isValid: true, 
    body: body
  };
};

export default {
  update: function(nameInput) {
    const {isValid, errors, body} = validateUpdateProfileForm(nameInput);

    if(!isValid) {
      return new Promise((resolve, reject) => {
        return resolve({ok: false, errors: errors});
      });
    }

    return fetch(systemConstant.SERVER_URL + '/admin/update-profile', {
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