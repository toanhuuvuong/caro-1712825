import React from 'react';
import {
  Route,
  Redirect 
} from 'react-router-dom';

import authenticationService from '../../services/authentication';

function ForwardRoute({component: Component, ...rest}) {
  const dashboard = authenticationService.getRole() === 'admin' 
  ? '/admin/dashboard' : '/';
  return <Route {...rest} render={props => (
    authenticationService.isLogout() ? <Component {...props} /> : <Redirect to={dashboard} />
  )} />
}

export default ForwardRoute;