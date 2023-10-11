import {request} from '@umijs/max';
/**
 * request基于axios
 */

/**
 * 根据用户密码登录
 * @param params body携带的数据 {username:用户名,password:密码}
 * @param options axios配置参数
 */
export const loginByUserName = (params: API.Options, options?: API.Options) => request(`/api/v1/login`, {
    method: 'POST',
    data: params,
    ...options,
})

/**
 * 获取用户菜单
 * @param params
 * @param options
 */
export const getMenus = (params: API.Options, options?: API.Options) => request(`/api/v1/menus`, {
    method: 'POST',
    data: params,
    ...options,
})

/**
 * 查询用户列表
 * @param params
 * @param options
 */
export const queryUserList = (params: API.Options, options?: API.Options) => request(`/api/v1/queryUserList`, {
    method: 'GET',
    params: params,
    ...options,
})

/**
 * 添加用户
 * @param params
 * @param options
 */
export const addUser = (params: API.Options, options?: API.Options) => request(`/api/v1/user`, {
    method: 'POST',
    data: params,
    ...options,
})

/**
 * 获取用户详情信息
 * @param params
 * @param options
 */
export const getUserDetail = (params: API.Options, options?: API.Options) => request(`/api/v1/user`, {
    method: 'GET',
    params: params,
    ...options,
})

/**
 * 修改用户信息
 * @param params
 * @param body
 * @param options
 */
export const modifyUser = (params: API.Options, body: API.Options, options?: API.Options) => request(`/api/v1/user`, {
    method: 'PUT',
    params: params,
    data: body,
    ...options,
})


/**
 * 删除用户
 * @param userId
 * @param options
 */
export const deleteUser = (userId: number | string, options?: API.Options) => request(`/api/v1/user${userId}`, {
    method: 'DELETE',
    ...options,
})


