import React, { useState } from 'react';
import { 
  Form, FormGroup, Input,
  Label, Col,
  Button,
  Card
} from 'reactstrap';

import Notification from '../../../components/Notification';
import changePasswordAPI from '../../../api/user/change-password';

function ChangePassword() {
  // --- State
  // Notification
  const [messages, setMessages] = useState([]);
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [alertColor, setAlertColor] = useState('danger');
  // Input
  const [passwordInput, setPasswordInput] = useState('');
  const [password2Input, setPassword2Input] = useState('');

  // --- Handle function
  const handlePasswordInputChange = event => {
    setPasswordInput(event.target.value);
  };

  const handlePassword2InputChange = event => {
    setPassword2Input(event.target.value);
  };

  const handleChangeButtonOnClick = event => {
    event.preventDefault();

    changePasswordAPI.change(passwordInput, password2Input)
    .then(data => {
      setAlertIsOpen(true);
      setMessages(data.errors ? data.errors : [data.messageCode]);
      setAlertColor(data.ok ? 'success' : 'danger');
    });
  };

  const renderAsteriskIcon = () => {
    return <span style={{color: "red"}}>(*)</span>;
  };

  return (
    <Card body className="col-sm-6 card text-center">
      <h1>Change Password Form</h1>

      <Notification color={alertColor} 
      isOpen={alertIsOpen} 
      messages={messages} />

      <Form className="change-password-form">
        <FormGroup row className="text-right">
          <Label for="password" sm={3}>
            Password {renderAsteriskIcon()}
          </Label>
          <Col sm={9}>
            <Input type="password"
            id="password"
            placeholder="Nhập mật khẩu mới..."
            value={passwordInput}
            onChange={handlePasswordInputChange}></Input>
          </Col>
        </FormGroup>

        <FormGroup row className="text-right">
          <Label for="password2" sm={3}>
            Password Against {renderAsteriskIcon()}
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
        onClick={handleChangeButtonOnClick}>Change</Button>
      </Form>
    </Card>
  );
}

export default ChangePassword;