import {request} from './request';

export function userLogin(account, password) {
    return request({
        url: '/login',
        params: {
            account,
            password
        }
    });
}

