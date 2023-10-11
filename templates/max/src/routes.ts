/**
 * description: 项目路由
 * author: 1580043700@qq.com
 * create_date: 2023/10/8-16:49
 */

interface IRoutes {
    path?: (string | undefined);
    name?: (string | undefined);
    component?: (string | undefined);
    layout?: (false | undefined);
    redirect?: (string | undefined);
    routes?: IRoutes;
    wrappers?: (Array<string> | undefined);
}

const config: Array<IRoutes | { [x: string]: any }> = [
    {
        name: '登录',
        path: '/login',
        layout: false,
        component: '@/pages/Login',
    },
    {
        path: '/login',
        component: '@/pages/Login',
    },
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: 'home',
        component: '@/pages/Home',
    },
    {
        path: '/access',
        component: '@/pages/Access',
        access: 'readArticle', //权限, access.ts ()=> readArticle: true:访问,false:不可访问
    },
    {
        path: '/access1',
        component: '@/pages/Access',
    },
    {
        path: '/access1',
        routes: [
            {
                path: '/access1/details/:id',
                component: '@/pages/User/Details',
            },
            {
                path: '/access1/list',
                component: '@/pages/User/List',
            },
            {
                path: '/access1/update',
                component: '@/pages/User/Update',
            },
        ]
    },
    {
        name: '嵌套路由',
        path: '/tables',
        icon: 'PieChartOutlined',
        routes: [
            {
                path: 'table',
                component: '@/pages/Table',
            },
            {
                path: 'charts',
                component: '@/pages/Charts',
            },
        ]
    },
]

export default config