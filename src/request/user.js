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

export function addAppointment(doctorId, time, userId) {
    return request({
        url: '/addAppointment',
        params: {
            doctorId, time, userId
        }
    });
}

export function getAppointmentById(id) {
    return request({
        url: '/getAppointmentById',
        params: {
            id
        }
    });
}


export function getUserInfoById(id) {
    return request({
        url: '/getUserInfoById',
        params: {
            id
        }
    });
}

export function updateUserInfo(id, info) {
    return request({
        url: '/updateUserInfo',
        params: {
            id,
            ...info
        }
    });
}