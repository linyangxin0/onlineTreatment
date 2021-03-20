import { request } from './request';

export function userLogin(account, password) {
    return request({
        url: '/login',
        params: {
            account,
            password
        }
    });
}


export function updatePassword(account, oldPassword, newPassword) {
    return request({
        url: '/updatePassword',
        params: {
            account,
            oldPassword,
            newPassword
        }
    })
}

export function userRegister(userName, account, password, doctor) {
    return request({
        url: '/userRegister',
        params: {
            userName,
            account,
            password,
            doctor
        }
    })
}

export function getDoctorList() {
    return request({
        url: '/selectAllDoctor'
    });
}


export function selectDoctorInfoById(id) {
    return request({
        url: '/getDoctorInfo',
        params: {
            id
        }
    });
}