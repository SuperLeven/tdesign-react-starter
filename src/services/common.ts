import { IRouter } from 'router';

export const getRouters = (): Promise<IRouter[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          path: '/setting',
          meta: {
            title: '系统管理',
            Icon: 'setting',
          },
          children: [
            {
              path: 'users',
              Component: 'pages/Setting/Users',
              meta: { title: '用户管理' },
            },
            {
              path: 'roles',
              Component: 'pages/Setting/Roles',
              meta: { title: '角色管理' },
            },
            {
              path: 'menu',
              Component: 'pages/Setting/Menu',
              meta: { title: '菜单管理' },
            },
            {
              path: 'department',
              Component: 'pages/Setting/Department',
              meta: { title: '部门管理' },
            },
            {
              path: 'post',
              Component: 'pages/Setting/Post',
              meta: { title: '岗位管理' },
            },
            {
              path: 'dictionary',
              Component: 'pages/Setting/Dictionary',
              meta: { title: '字典管理' },
            },
            {
              path: 'notice',
              Component: 'pages/Setting/Notice',
              meta: { title: '通知公告' },
            },
          ],
        },
      ]);
    }, 1000);
  });
