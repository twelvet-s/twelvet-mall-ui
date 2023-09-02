import { request } from '@umijs/max'

// 请求的控制器名称
const controller = "/live";

/**
 * 发起直播
 * @param params 搜索参数
 */
export async function push(params: Record<string, any>) {
    return request(`${controller}/push`, {
        method: 'POST',
        data: {
            ...params
        },
    });
}
