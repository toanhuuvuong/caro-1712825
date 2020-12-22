import React, { useEffect, useState } from 'react';
import { 
  Form, FormGroup, Input,
  Label, Col,
  Button, Card
} from 'reactstrap';

import defaultAvatar from './images/default-avatar.png';
import Notification from '../../../components/common/Notification';
import AsteriskIcon from '../../../components/common/AsteriskIcon';
import updateProfileAPI from '../../../api/user/update-profile';
import userAPI from '../../../api/common/user';
import authenticationService from '../../../services/authentication';

function UpdateProfile() {
  // --- State
  // Main
  const [user, setUser] = useState({});
  // Notification
  const [messages, setMessages] = useState([]);
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [alertColor, setAlertColor] = useState('danger');
  // Input
  const [nameInput, setNameInput] = useState('');

  // --- Effect hook
  useEffect(() => {
    userAPI.getById(authenticationService.getUserId())
    .then(data => {
      if (data.ok) {
        setUser(data.item);
        setNameInput(data.item.name);
      }
    });
  }, []);

  // --- Handle functions
  const handleNameInputChange = event => {
    setNameInput(event.target.value);
  };

  const handleUpdateButtonOnClick = event => {
    event.preventDefault();
    updateProfileAPI.update(nameInput)
    .then(data => {
      setAlertIsOpen(true);
      setMessages(data.errors ? data.errors : [data.messageCode]);
      setAlertColor(data.ok ? 'success' : 'danger');
    });
  };

  // --- Render
  return (
    <Card body className="col-sm-6 card text-center">
      <h1>Update Profile Form</h1>

      <Notification color={alertColor} 
      isOpen={alertIsOpen} 
      messages={messages} />

      <Form className="update-profile-form">
        <FormGroup row>
          <img src={defaultAvatar} 
          className="avatar"
          width="200px" alt="Avatar" />
        </FormGroup>
        <FormGroup row className="text-right">
          <Label for="username" sm={3}>
            Username
          </Label>
          <Col sm={9}>
            <Input type="search"
            id="username"
            value={user && user.username}
            readOnly></Input>
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
          <Label for="role" sm={3}>
            Role
          </Label>
          <Col sm={9}>
            <Input type="search"
            id="role"
            value={user && user.role}
            readOnly></Input>
          </Col>
        </FormGroup>
        
        <Button className="col-sm-6"
        onClick={handleUpdateButtonOnClick}>Update</Button>
      </Form>
    </Card>
  );
}

export default UpdateProfile;