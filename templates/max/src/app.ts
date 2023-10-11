// 运行时配置

import {getMenus} from '@/services';
import {history} from "umi";
import type {RequestConfig} from 'umi';
import {AxiosResponse} from 'axios';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<any> {
  try {
    // 获取用户可见菜单列表
    let {data} = await getMenus({});
    return {
      menus: data,
      name: 'zhang san',
      avatar: 'https://gw.alipayobjects.com/zos/bmw-prod/598d14af-4f1c-497d-b579-5ac42cd4dd1f/k7bjua9c_w132_h130.png'
    };
  } catch (e) {
    // token过期跳转到登录页面
    history.push('/login')
  }
}

export const layout = ({initialState}: any) => {
  console.log('initialState', initialState)
  return ({
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
      params: initialState,
      // 配置了此项，则routes.ts不会生成菜单; request可以使用initialState里面的数据，也可以返回菜单数据
      request: async () => initialState.menus,
      autoClose:false
    },
    layout: 'mix',
    logout:()=>{

    }
    // 如果以上满足不了需求，可以通过以下接口实现右上角 UI 完全的自定义。
    // rightRender: (initialState, setInitialState) => {
    //     // xxx
    //     return 'xxx';
    // },

    // 自定义 footer
    // footerRender: () => {
    //     // xxx
    //     return 'sdfds';
    // },
  });
};

export const request: RequestConfig = {
  timeout: 10000,
  errorConfig: {},
  // response拦截器
  requestInterceptors: [(url, options) => {
    return {
      url: `${url}`,
      options: {
        ...options,
        interceptors: true,
        headers: {'Content-Type': 'application/json', ...options.headers, Authorization: 'Bearer xxxxxx'}
      },
    };
  }],
  responseInterceptors: [[((response: AxiosResponse) => {
    // TODO 根据需要修改
    if (response.status !== 200 || response.data?.code !== 200) {
      if (response.status === 401 || response.data?.code === 401) {
        history.push('/login')
        throw new Error(`登录信息过期需要重新登录`);
      }
    }
    return response;
  })]]
}
