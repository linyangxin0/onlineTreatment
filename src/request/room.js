import {request} from './request';

export function getAllRoom() {
    return request({
        url: '/getRooms'
    });
}
