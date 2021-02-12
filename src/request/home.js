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


export function updatePassword(account, newPassword) {
    return request({
        url: '/updatePassword',
        params: {
            account,
            newPassword
        }
    })
}
