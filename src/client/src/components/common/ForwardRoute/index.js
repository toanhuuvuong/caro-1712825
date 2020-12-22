import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import authenticationService from '../../../services/authentication';

function ForwardRoute({component: Component, ...rest}) {
  const isAllowed = authenticationService.isLogout();
  const dashboard = authenticationService.isAdmin() ? '/admin/dashboard' : '/';

  return <Route {...rest} render={props => (
    isAllowed ? <Component {...props} /> : <Redirect to={dashboard} />
  )} />
}

export default ForwardRoute;