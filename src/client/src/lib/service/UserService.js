import config from 'config';
import { authHeader, validateAuth } from '@/_helpers';

export const userService = {
    getAll
};

function getAll() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`http://localhost:4000/user`, requestOptions).then(validateAuth);
}