import systemConstant from '../config/constant';

const validateRegisterForm = (usernameInput, nameInput, passwordInput, password2Input) => {
  const username = usernameInput && usernameInput.trim();
  const name = nameInput && nameInput.trim();
  const password = passwordInput && passwordInput.trim();
  const password2 = password2Input && password2Input.trim();
  const errors = [];

  if(!username) {
    errors.push('username_required');
  } 
  if(!name) {
    errors.push('name_required');
  } 
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
    username: username,
    name: name,
    password: password,
    password2: password2
  };
  return {
    isValid: true, 
    body: body
  };
};

export default {
  register: function(usernameInput, nameInput, passwordInput, password2Input) {
    const {isValid, errors, body} = validateRegisterForm(usernameInput, nameInput, passwordInput, password2Input);

    if(!isValid) {
      return new Promise((resolve, reject) => {
        return resolve({ok: false, errors: errors});
      });
    }

    return fetch(systemConstant.SERVER_URL + '/register', {
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