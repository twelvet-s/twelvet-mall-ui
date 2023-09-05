// 请求的控制器名称
const controller = "/live";

/**
 * 发起直播
 * @param params 搜索参数
 */
export function push(params: Record<string, any>) {
    return fetch(`${controller}/push`, {
        method: 'post',
        body: JSON.stringify(params),
    })
}
