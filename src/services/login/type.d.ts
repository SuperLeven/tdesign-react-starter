
interface User {
  id: 1,
  createTime: string,
  updateTime: string,
  deleteTime: null | string,
  phone: string,
  nickname: string,
  username: string,
  headImg: string,
  gender: number,
  loginNumber: string,
  openid: null | string,
  unionid: null | string,
  status: number,
  system: number,
  isSuper: number,
  isAdmin: number,
  orgId: number | null,
  roles: number[],
  platforms: number[]
}

interface LoginParams {
  username: string,
  password: string,
  // code: string,
  // uuid: string
}

interface LoginResult {
  token: string,
  user: User
}
