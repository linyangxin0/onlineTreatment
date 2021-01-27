import axios from 'axios';
// import CryptoJS from 'crypto-js';
// import {ACCESS_KEY} from '../assets/constant/constant';

const instance = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

export function request(config) {
  // 1创建实例

  // 保留，以免之后用到
  // 2.1axios请求拦截器
  // instance.interceptors.request.use((requestConfig) => {
  //   const value = Date.parse(new Date()).toString();
  //   const keyHex = CryptoJS.enc.Utf8.parse(ACCESS_KEY);
  //   const encrypted = CryptoJS.DES.encrypt(value, keyHex, {
  //     mode: CryptoJS.mode.ECB,
  //     padding: CryptoJS.pad.Pkcs7,
  //   });
  //   // eslint-disable-next-line no-param-reassign
  //   requestConfig.headers.accessKey = encrypted.toString();
  //   return requestConfig;
  // }, (error) => {
  //   console.log(error);
  // });
  // // 2.2响应拦截,也要return出去
  // // 1、可以对数据进行处理
  // instance.interceptors.response.use((res) =>
  //   // console.log(res);
  //    res.data,
  //  (err) => {
  //   // console.log(err);
  // });

  // 发送真正的网络请求
  return instance.request(config);
}

export default {};
