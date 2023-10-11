const users = [
  {id: 0, name: 'Umi', nickName: 'U', gender: 'MALE'},
  {id: 1, name: 'Fish', nickName: 'B', gender: 'FEMALE'},
];

export default {
  'POST /api/v1/login': (req: any, res: any) => {
    res.json({
      success: true,
      errorCode: 0,
      data: {token: 'token_xxxxss'},
    });
  },
  'POST /api/v1/menus': (req: any, res: any) => {
    res.json({
      success: true,
      errorCode: 0,
      data: [
        {id: 2, path: '/home',name: '首页', children: []},
        {id: 3, path: '/access',name: '菜单权限', children: []},
        {id: 3, path: '/access1',name: '按钮权限',  children: []},
        {id: 4, path: '/tables',name: '嵌套路由' , children: [ {id: 4, path: '/tables/table',name: 'CRUD 示例', children: []},{id: 4, path: '/tables/charts',name: '图表示例', children: []}]},
      ],
    });
  },
  'GET /api/v1/queryUserList': (req: any, res: any) => {
    res.json({
      success: true,
      data: {list: users},
      errorCode: 0,
    });
  },
  'PUT /api/v1/user/': (req: any, res: any) => {
    res.json({
      success: true,
      errorCode: 0,
      code: 401,
    });
  },
  'GET /api/v1/user/': (req: any, res: any) => {
    res.json({
      success: true,
      errorCode: 0,
      data: users[0],
    });
  },
};
