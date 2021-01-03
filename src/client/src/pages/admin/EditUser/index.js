import React, { useEffect, useState } from 'react';
import { 
  Form, FormGroup, Input,
  Label, Col,
  Button, Card
} from 'reactstrap';
import { useParams } from 'react-router-dom';

import './css/style.css';

import defaultAvatar from './images/default-avatar.png';
import Notification from '../../../components/common/Notification';
import Breadcrumbs from '../../../components/admin/Breadcrumbs';
import editUserAPI from '../../../api/admin/edit-user';
import userAPI from '../../../api/common/user';
import authenticationService from '../../../services/authentication';

function EditUser() {
  // --- Params
  const { userId } = useParams();

  // Varibles
  const areYourSelf = authenticationService.getUserId() === userId;

  // --- State
  // Main
  const [user, setUser] = useState({});
  const [status, setStatus] = useState(false);
  // Notification
  const [messages, setMessages] = useState([]);
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [alertColor, setAlertColor] = useState('danger');

  // --- Effect hook
  useEffect(() => {
    userAPI.getById(userId)
    .then(data => {
      if (data.ok) {
        setUser(data.item);
        setStatus(data.item.isDeleted);
      }
    });
  }, []);

  // --- Handle functions
  const handleStatusRadioButtonOnClick = status => {
    setStatus(status);
  };

  const handleUpdateButtonOnClick = event => {
    event.preventDefault();
    editUserAPI.update(userId, status)
    .then(data => {
      setAlertIsOpen(true);
      setMessages(data.errors ? data.errors : [data.messageCode]);
      setAlertColor(data.ok ? 'success' : 'danger');
    });
  };



  // --- Render
  return (
    <>
      <Breadcrumbs currentItem="User detail" items={[{href: '/admin/list-users', name: 'List users'}]} />
      <Card body className="col-sm-6 card text-center">
        <h1>User Detail</h1>

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
              Name
            </Label>
            <Col sm={9}>
              <Input type="search"
              id="name"
              placeholder="Nhập họ tên..."
              value={user && user.name}
              readOnly></Input>
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

          <FormGroup row className="text-right">
            <Label for="is-deleted" sm={3}>
              Status
            </Label>
            <Col className="d-flex" sm={9}>
              <div className="status-item">
                { user &&
                  <Input type="radio" name="is-deleted" 
                  value={false} defaultChecked={!user.isDeleted} 
                  onClick={() => handleStatusRadioButtonOnClick(false)} 
                  disabled={areYourSelf} />
                }
                &nbsp;
                <Label>Active</Label>
              </div>
              
              &nbsp;&nbsp;&nbsp;
              
              <div className="status-item">
                { user &&
                  <Input type="radio" name="is-deleted" 
                  value={true} defaultChecked={user.isDeleted}
                  onClick={() => handleStatusRadioButtonOnClick(true)}
                  disabled={areYourSelf} />
                }
                &nbsp;
                <Label>Block</Label>
              </div>
            </Col>
          </FormGroup>
          
          <Button className="col-sm-6"
          onClick={handleUpdateButtonOnClick}
          disabled={areYourSelf} >Update</Button>
        </Form>
      </Card>
    </>
  );
}

export default EditUser;