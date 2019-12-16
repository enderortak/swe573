import { BehaviorSubject } from 'rxjs';
import * as jwt from 'jsonwebtoken'

// import config from 'config';
// import { validateAuth } from '../components/AuthProtected';

const tokenSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('token')));

export default {
    login,
    logout,
    token: tokenSubject.asObservable(),
    get tokenValue () { return tokenSubject.value },
    get user () { return jwt.decode(tokenSubject.value) }
};

function validateAuth(response) {
    
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            // if ([401, 403].indexOf(response.status) !== -1) {
            //     // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
            //     // logout();
            //     // window.location.reload(true);
            // }

            const error = (data && data.message) || response.statusText;
            return new Error(error);
        }

        return data;
    });
}
async function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };
    const response = await fetch(`http://localhost:4000/login`, requestOptions);
    const  result = await validateAuth(response);
    if (!(result instanceof Error)) {
        const { token } = result;
        localStorage.setItem('token', JSON.stringify(token));
        tokenSubject.next(token);
    }
    return result
    // store user details and jwt token in local storage to keep user logged in between page refreshes

}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    tokenSubject.next(null);
}