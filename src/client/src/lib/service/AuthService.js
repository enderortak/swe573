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

async function validateAuth(response) {
    if (!response.ok){
        const error = await response.json();
        return new Error(error.message);
    }
    return await response.json();
}
async function login(username, password) {
    const formData  = new FormData();
    formData.append("username", username)
    formData.append("password", password)
    
    const requestOptions = {
        method: 'POST',
        headers: {},
        body: formData
    };
    const response = await fetch(`http://localhost:4000/login`, requestOptions);
    const  result = await validateAuth(response);
    if (!(result instanceof Error)) {
        const { token } = result;
        localStorage.setItem('token', JSON.stringify(token));
        tokenSubject.next(token);
    }
    return result
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
    tokenSubject.next(null);
}