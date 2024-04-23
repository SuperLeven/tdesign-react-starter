import axios from 'axios';
import proxy from '../configs/host';
import { MessagePlugin } from 'tdesign-react';

const env = import.meta.env.MODE || 'development';
const API_HOST = proxy[env].API;

const SUCCESS_CODE = 0;
const TIMEOUT = 5000;

export const instance = axios.create({
  baseURL: API_HOST,
  timeout: TIMEOUT,
  withCredentials: true,
});

// 请求拦截
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (e) => Promise.reject(e),
);

instance.interceptors.response.use(
  // eslint-disable-next-line consistent-return
  (response) => {
    const data = response.data || {};
    if (data.code === SUCCESS_CODE) {
      const result = data.data || {};
      return Promise.resolve(result);
    }
    return Promise.reject(response);
  },
  (e) => {
    if (e.response?.status === 401) {
      window.history.pushState(null, '', '/login/index');
      return Promise.reject(e);
    }
    MessagePlugin.error(e.response?.data?.data?.message || '请求失败，请稍后再试！');
    return Promise.reject(e);
  },
);
export const request = instance;
export default instance;
