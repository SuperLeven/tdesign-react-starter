const Mock = require('mockjs');
export default {
  url: '/api/auth/account/login',
  method: 'get',
  response: () => {
    return {
      "data": {
        "token": "317e6628e28ff043576510289de1de33",
        "user": {
          "id": 1,
          "createTime": "2023-12-22T06:38:00.541Z",
          "updateTime": "2023-12-22T06:38:00.552Z",
          "deleteTime": null,
          "phone": "15701797070",
          "nickname": "LevenHan",
          "username": "super_leven",
          "headImg": "https://p9-passport.byteacctimg.com/img/user-avatar/28cdddabf512485acb82fbdf72d487d3~50x50.awebp",
          "gender": 1,
          "loginNumber": "1",
          "openid": null,
          "unionid": null,
          "status": 0,
          "system": 0,
          "isSuper": 0,
          "isAdmin": 0,
          "orgId": null,
          "roles": [],
          "platforms": []
        }
      },
      "code": 0,
      "success": true,
      "message": "成功"
    };
  },
};
