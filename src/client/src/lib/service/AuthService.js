import { BehaviorSubject } from 'rxjs';

// import config from 'config';
// import { validateAuth } from '../components/AuthProtected';

const tokenSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('token')));

export default {
    login,
    logout,
    token: tokenSubject.asObservable(),
    get tokenValue () { return tokenSubject.value }
};

function validateAuth(response) {
    
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            console.log(response)
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                // logout();
                // window.location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
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
    const { token } = await validateAuth(response);
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('token', JSON.stringify(token));
    tokenSubject.next(token);
    return token;
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    tokenSubject.next(null);
}