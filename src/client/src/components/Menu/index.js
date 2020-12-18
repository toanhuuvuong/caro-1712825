import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch
} from "react-router-dom";
import {
  Navbar,
  Nav,
  NavItem,
  NavLink,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import Login from '../../pages/Login';
import Logout from '../../pages/Logout';
import Register from '../../pages/Register';
import ForwardRoute from '../ForwardRoute';

import Dashboard from '../../pages/user/Dashboard';
import UpdateProfile from '../../pages/user/UpdateProfile';
import ChangePassword from '../../pages/user/ChangePassword';
import GameRoom from '../../pages/user/GameRoom';
import PrivateRoute from '../PrivateRoute';

import AdminDashboard from '../../pages/admin/Dashboard';
import AdminUpdateProfile from '../../pages/admin/UpdateProfile';
import AdminChangePassword from '../../pages/admin/ChangePassword';
import AdminPrivateRoute from '../AdminPrivateRoute';

import authenticationService from '../../services/authentication';

function Menu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggle = () => setDropdownOpen(prevState => !prevState);

  return(
    <div className="menu">
      <Router>
        <div>
          <Navbar color="light" light expand="md">
            <Nav className="container-fluid" navbar>
              { authenticationService.isLogin() &&
              <NavItem>
                <NavLink href={authenticationService.getRole() === "admin" 
                ? "/admin/dashboard" 
                : "/dashboard"}>Dashboard</NavLink>
              </NavItem>
              }
              { authenticationService.isLogout() &&
              <NavItem className="ml-auto d-flex">
                <NavLink href="/login">Login</NavLink>
                <NavLink href="/register">Register</NavLink> 
              </NavItem>
              }
              
              { authenticationService.isLogin() &&
              <NavItem className="ml-auto">
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle caret>
                    Options
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      <NavLink href={authenticationService.getRole() === "admin" 
                      ? "/admin/update-profile" : "/update-profile" }>Update Profile</NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink href={authenticationService.getRole() === "admin" 
                      ? "/admin/change-password" : "/change-password"}>Change Password</NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink href="/logout">Logout</NavLink>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavItem>
              }

            </Nav>
          </Navbar>

          <Switch>
            <ForwardRoute path='/login' component={Login} />
            <PrivateRoute path='/logout' component={Logout} />
            <ForwardRoute path='/register' component={Register} />

            <PrivateRoute path='/dashboard' component={Dashboard} />
            <PrivateRoute path='/update-profile' component={UpdateProfile} />
            <PrivateRoute path='/change-password' component={ChangePassword} />
            <PrivateRoute path='/game-room/:roomId' component={GameRoom} />

            <AdminPrivateRoute path='/admin/dashboard' component={AdminDashboard} />
            <AdminPrivateRoute path='/admin/update-profile' component={AdminUpdateProfile} />
            <AdminPrivateRoute path='/admin/change-password' component={AdminChangePassword} />

            <PrivateRoute path='/' component={Dashboard} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default Menu;