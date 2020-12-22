import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import authenticationService from '../../../services/authentication';

function PrivateRoute({component: Component, ...rest}) {
  const isAllowed = authenticationService.isLogin();

  return <Route {...rest} render={props => (
    isAllowed ? <Component {...props} /> : <Redirect to='/login' />
  )} />
}

export default PrivateRoute;