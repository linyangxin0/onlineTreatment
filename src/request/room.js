import {request} from './request';

export function getAllRoom() {
    return request({
        url: '/getRooms'
    });
}


export function addRoom(name, password) {
    return request({
        url: '/addRoom',
        params: {
            name,
            password
        }
    });
}
