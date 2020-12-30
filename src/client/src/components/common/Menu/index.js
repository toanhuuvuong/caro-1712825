import React, { useState } from 'react';
import { BrowserRouter as Router, Switch } from "react-router-dom";
import {
  Navbar, Nav, NavItem, NavLink,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import Login from '../../../pages/common/Login';
import Logout from '../../../pages/common/Logout';
import Register from '../../../pages/common/Register';
import ForwardRoute from '../../common/ForwardRoute';

import Dashboard from '../../../pages/user/Dashboard';
import UpdateProfile from '../../../pages/user/UpdateProfile';
import ChangePassword from '../../../pages/user/ChangePassword';
import GameRoom from '../../../containers/user/GameRoom';
import PrivateRoute from '../../user/PrivateRoute';

import AdminDashboard from '../../../pages/admin/Dashboard';
import AdminUpdateProfile from '../../../pages/admin/UpdateProfile';
import AdminChangePassword from '../../../pages/admin/ChangePassword';
import AdminPrivateRoute from '../../admin/PrivateRoute';

import authenticationService from '../../../services/authentication';

function Menu() {
  // --- Varible
  const isLogin = authenticationService.isLogin();
  const isAdmin = authenticationService.isAdmin();

  // --- State
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // --- Handle functions
  const toggle = () => setDropdownOpen(prevState => !prevState);

  // --- Render
  return(
    <div className="menu">
      <Router>
        <div>
          <Navbar color="light" light expand="sm">
            <Nav className="container-fluid" navbar>
              { isLogin &&
              <NavItem>
                <NavLink href={authenticationService.getRole() === "admin" 
                ? "/admin/dashboard" 
                : "/dashboard"}>Dashboard</NavLink>
              </NavItem>
              }
              
              { !isLogin &&
              <NavItem className="ml-auto d-flex">
                <NavLink href="/login">Login</NavLink>
                <NavLink href="/register">Register</NavLink> 
              </NavItem>
              }
              
              { isLogin &&
              <NavItem className="ml-auto">
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle caret>
                    Options
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      <NavLink href={isAdmin 
                        ? "/admin/update-profile" 
                        : "/update-profile" }>Update Profile</NavLink>
                    </DropdownItem>
                    <DropdownItem>
                      <NavLink href={isAdmin 
                        ? "/admin/change-password" 
                        : "/change-password"}>Change Password</NavLink>
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