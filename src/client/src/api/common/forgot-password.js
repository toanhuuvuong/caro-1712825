import systemConstant from '../../config/constant';

const validateForgotPasswordForm = (usernameInput) => {
  const username = usernameInput && usernameInput.trim();
  const errors = [];

  if(!username) {
    errors.push('username_required');
  } 
  if(errors.length !== 0) {
    return {isValid: false, errors: errors};
  }

  const body = {
    username: username
  };
  return {
    isValid: true, 
    body: body
  };
};

export default {
  send: function(usernameInput) {
    const {isValid, errors, body} = validateForgotPasswordForm(usernameInput);

    if(!isValid) {
      return new Promise((resolve, reject) => {
        return resolve({ok: false, errors: errors});
      });
    }

    return fetch(systemConstant.SERVER_URL + '/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => {
      return res.json();
    });
  }
};