import React, { useState } from 'react';
import { 
  Form, FormGroup, Input,
  Label, Col,
  Button, Card
} from 'reactstrap';

import Notification from '../../../components/common/Notification';
import AsteriskIcon from '../../../components/common/AsteriskIcon';
import registerAPI from '../../../api/common/register';

function Register() {
  // --- State
  // Notification
  const [messages, setMessages] = useState([]);
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [alertColor, setAlertColor] = useState('danger');
  // Input
  const [usernameInput, setUsernameInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [password2Input, setPassword2Input] = useState('');

  // --- Hanle functions
  const handleUsernameInputChange = event => {
    setUsernameInput(event.target.value);
  };

  const handleNameInputChange = event => {
    setNameInput(event.target.value);
  };

  const handlePasswordInputChange = event => {
    setPasswordInput(event.target.value);
  };

  const handlePassword2InputChange = event => {
    setPassword2Input(event.target.value);
  };

  const handleRegisterButtonOnClick = event => {
    event.preventDefault();
    registerAPI.register(usernameInput, nameInput, passwordInput, password2Input)
    .then(data => {
      setAlertIsOpen(true);
      setMessages(data.errors ? data.errors : [data.messageCode]);
      setAlertColor(data.ok ? 'success' : 'danger');
    });
  };

  return (
    <Card body className="col-sm-6 card text-center">
      <h1>Register Form</h1>

      <Notification color={alertColor} 
      isOpen={alertIsOpen} 
      messages={messages} />

      <Form className="register-form">
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
          <Label for="name" sm={3}>
            Name <AsteriskIcon />
          </Label>
          <Col sm={9}>
            <Input type="search"
            id="name"
            placeholder="Nhập họ tên..."
            value={nameInput}
            onChange={handleNameInputChange}></Input>
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

        <FormGroup row className="text-right">
          <Label for="password2" sm={3}>
            Password Against <AsteriskIcon />
          </Label>
          <Col sm={9}>
            <Input type="password"
            id="password2"
            placeholder="Nhập lại mật khẩu..."
            value={password2Input}
            onChange={handlePassword2InputChange}></Input>
          </Col>
        </FormGroup>
        
        <Button className="col-sm-6" 
        onClick={handleRegisterButtonOnClick}>Register</Button>
      </Form>
    </Card>
  );
}

export default Register;