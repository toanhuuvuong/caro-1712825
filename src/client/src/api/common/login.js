import systemConstant from '../../config/constant';
import authenticationSevice from '../../services/authentication';

const validateLoginForm = (usernameInput, passwordInput) => {
  const username = usernameInput && usernameInput.trim();
  const password = passwordInput && passwordInput.trim();
  const errors = [];

  if(!username) {
    errors.push('username_required');
  } 
  if(!password) {
    errors.push('password_required');
  }
  if(errors.length !== 0) {
    return {isValid: false, errors: errors};
  }

  const body = {
    username: username,
    password: password
  };
  return {
    isValid: true, 
    body: body
  };
};

export default {
  login: function(usernameInput, passwordInput) {
    const {isValid, errors, body} = validateLoginForm(usernameInput, passwordInput);

    if(!isValid) {
      return new Promise((resolve, reject) => {
        return resolve({ok: false, errors: errors});
      });
    }

    return fetch(systemConstant.SERVER_URL + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      if(data.ok) {
        authenticationSevice.login(data);
      }
      return data;
    });
  },
  loginWithGoogle: function() {
    window.open(systemConstant.SERVER_URL + '/auth/google', '_self');
  },
  loginWithFacebook: function() {
    window.open(systemConstant.SERVER_URL + '/auth/facebook', '_self');
  }
};