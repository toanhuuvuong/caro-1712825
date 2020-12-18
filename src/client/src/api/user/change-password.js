import systemConstant from '../../config/constant';
import authenticationSevice from '../../services/authentication';

const validateChangePasswordForm = (passwordInput, password2Input) => {
  const password = passwordInput && passwordInput.trim();
  const password2 = password2Input && password2Input.trim();
  const errors = [];

  if(!password) {
    errors.push('password_required');
  }
  if(!password2) {
    errors.push('password2_required');
  }
  if(password && password2 && password !== password2) {
    errors.push('password_not_match');
  }
  if(errors.length !== 0) {
    return {isValid: false, errors: errors};
  }

  const body = {
    password: password,
    password2: password2
  };
  return {
    isValid: true, 
    body: body
  };
};

export default {
  change: function(passwordInput, password2Input) {
    const {isValid, errors, body} = validateChangePasswordForm(passwordInput, password2Input);

    if(!isValid) {
      return new Promise((resolve, reject) => {
        return resolve({ok: false, errors: errors});
      });
    }

    return fetch(systemConstant.SERVER_URL + '/change-password', {
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