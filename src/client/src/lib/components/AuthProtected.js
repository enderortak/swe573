import React from 'react';
// import { Route, Redirect } from 'react-router-dom';

import AuthService from '../service/AuthService';

// export const AuthProtected = ({ component: Component, ...rest }) => (
//     <Route {...rest} render={props => {
//         const currentUser = AuthService.currentUserValue;
//         if (!currentUser) {
//             // not logged in so redirect to login page with the return url
//             return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
//         }

//         // authorised so return component
//         return <Component {...props} />
//     }} />
// )

export function authHeader() {
    // return authorization header with jwt token
    const currentUser = AuthService.currentUserValue;
    if (currentUser && currentUser.token) {
        return { Authorization: `Bearer ${currentUser.token}` };
    } else {
        return {};
    }
}

// export function validateAuth(response) {
//     return response.text().then(text => {
//         const data = text && JSON.parse(text);
//         if (!response.ok) {
//             if ([401, 403].indexOf(response.status) !== -1) {
//                 // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
//                 AuthService.logout();
//                 window.location.reload(true);
//             }

//             const error = (data && data.message) || response.statusText;
//             return Promise.reject(error);
//         }

//         return data;
//     });
// }