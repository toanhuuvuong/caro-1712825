import React from 'react';
import {
  Route, 
  Redirect 
} from 'react-router-dom';

import authenticationService from '../../services/authentication';

function AdminPrivateRoute({component: Component, ...rest}) {
  return <Route {...rest} render={props => (
    authenticationService.isLogin() && authenticationService.getRole() === 'admin' 
    ? <Component {...props} /> 
    : <Redirect to='/login' />
  )} />
}

export default AdminPrivateRoute;