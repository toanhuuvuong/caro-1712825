import React, { useState } from 'react';
import { 
  Form, FormGroup, Input,
  Label, Col,
  Button, Card
} from 'reactstrap';

import Notification from '../../../components/common/Notification';
import AsteriskIcon from '../../../components/common/AsteriskIcon';
import forgotPasswordAPI from '../../../api/common/forgot-password';

function ForgotPassword() {
  // --- State
  // Notification
  const [messages, setMessages] = useState([]);
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [alertColor, setAlertColor] = useState('danger');
  // Input
  const [usernameInput, setUsernameInput] = useState('');

  // --- Hanle functions
  const handleUsernameInputChange = event => {
    setUsernameInput(event.target.value);
  };

  const handleSendButtonOnClick = event => {
    event.preventDefault();
    forgotPasswordAPI.send(usernameInput)
    .then(data => {
      setAlertIsOpen(true);
      setMessages(data.errors ? data.errors : [data.messageCode]);
      setAlertColor(data.ok ? 'success' : 'danger');
    });
  };

  return (
    <Card body className="col-sm-6 card text-center">
      <h1>Forgot Password Form</h1>

      <Notification color={alertColor} 
      isOpen={alertIsOpen} 
      messages={messages} />

      <Form className="forgot-password-form">
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
        
        <Button className="col-sm-6" 
        onClick={handleSendButtonOnClick}>Send</Button>
      </Form>
    </Card>
  );
}

export default ForgotPassword;