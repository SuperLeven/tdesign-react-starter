import { request } from "utils/request"

export const toLogin = (data: any): Promise<any> => {
  return request.post('/auth/account/login', data)
}
