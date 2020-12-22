import React, { useState } from 'react';
import { 
  Form, FormGroup, Input,
  Label, Col,
  Button, ButtonGroup,
  Card
} from 'reactstrap';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

import Notification from '../../../components/common/Notification';
import AsteriskIcon from '../../../components/common/AsteriskIcon';
import loginAPI from '../../../api/common/login';
import systemConstant from '../../../config/constant';
import authenticationService from '../../../services/authentication';
import parseUrl from './services/parseUrl';

function Login() {
  // --- State
  // Notification
  const [messages, setMessages] = useState([]);
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [alertColor, setAlertColor] = useState('danger');
  // Input
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // --- Handle functions
  const handleUsernameInputChange = event => {
    setUsernameInput(event.target.value);
  };

  const handlePasswordInputChange = event => {
    setPasswordInput(event.target.value);
  };

  const handleLoginButtonOnClick = event => {
    event.preventDefault();
    loginAPI.login(usernameInput, passwordInput)
    .then(data => {
      if(data.ok) {
        const dashboard = authenticationService.isAdmin() 
        ? systemConstant.CLIENT_URL + '/admin/dashboard'
        : systemConstant.CLIENT_URL + '/dashboard';
        window.open(dashboard, '_self');
      } else {
        setAlertIsOpen(true);
        setMessages(data.errors ? data.errors : [data.messageCode]);
        setAlertColor('danger');
      }
    });
  };

  const handleGoogleLoginButtonOnClick = event => {
    event.preventDefault();
    loginAPI.loginWithGoogle();
  };

  const handleFacebookLoginButtonOnClick = event => {
    event.preventDefault();
    loginAPI.loginWithFacebook();
  };

  // --- Parse URL
  const url = window.location.href;
  const resObj = parseUrl(url);
  if(resObj) {
    authenticationService.login(resObj);
    window.open(systemConstant.CLIENT_URL + '/dashboard', '_self');
  }

  // --- Render
  return (
    <Card body className="col-sm-6 card text-center">
      <h1>Login Form</h1>

      <Notification color={alertColor} 
      isOpen={alertIsOpen} 
      messages={messages} />

      <Form className="login-form">
        <FormGroup row className="text-right">
          <Label for="username" sm={3}>
            Username <AsteriskIcon />
          </Label>
          <Col sm={9}>
            <Input type="search"
            id="username"
            placeholder="Nhập tên tài khoản..."
            value={usernameInput}
            onChange={handleUsernameInputChange}></Input>
          </Col>
        </FormGroup>

        <FormGroup row className="text-right">
          <Label for="password" sm={3}>
            Password <AsteriskIcon />
          </Label>
          <Col sm={9}>
            <Input type="password"
            id="password"
            placeholder="Nhập mật khẩu..."
            value={passwordInput}
            onChange={handlePasswordInputChange}></Input>
          </Col>
        </FormGroup>
        
        <ButtonGroup vertical className="col-sm-6">
          <Button onClick={handleLoginButtonOnClick}>Login</Button>
          <br />
          <ButtonGroup className="">
            <Button color="danger"
            onClick={handleGoogleLoginButtonOnClick}>
              <FaGoogle /> Google
            </Button>
            &emsp;
            <Button color="primary" 
            onClick={handleFacebookLoginButtonOnClick}>
              <FaFacebook /> Facebook
            </Button>
          </ButtonGroup>   
        </ButtonGroup>
      </Form>
    </Card>
  );
}

export default Login;