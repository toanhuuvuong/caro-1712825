import React from 'react';
import {
  Route, 
  Redirect 
} from 'react-router-dom';

import authenticationService from '../../services/authentication';

function PrivateRoute({component: Component, ...rest}) {
  return <Route {...rest} render={props => (
    authenticationService.isLogin() ? <Component {...props} /> : <Redirect to='/login' />
  )} />
}

export default PrivateRoute;