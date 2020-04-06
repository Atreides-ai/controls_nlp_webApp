import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ authState: authState, component: Component, ...rest }) => (
    <Route {...rest} render={props => (authState === true ? <Component {...props} /> : <Redirect to="/" />)} />
);

export default PrivateRoute;
