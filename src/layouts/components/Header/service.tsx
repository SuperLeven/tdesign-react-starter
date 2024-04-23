import { request } from 'utils/request';

export const getUserInfo = (): Promise<User> => request.get('/auth/account/profile');
