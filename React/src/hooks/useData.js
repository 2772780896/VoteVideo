import { useState, useEffect, useRef } from "react"

/**
 * 数据请求 Hook（含竞态保护）
 * @param {Function} requestFunc - API 请求函数
 * @param  {...any} params - 传给请求函数的参数
 * @returns {{ data, loading, error, refresh }}
 *
 * 【面试必考】竞态条件（Race Condition）
 *   快速切换 tab → 连续发两个请求 A、B
 *   B 先返回 → 渲染正确数据
 *   A 后返回 → setData(A的数据) → 卡片类型不匹配 → 崩溃
 *   解决：requestId 自增 → 每次请求前记 ID → 返回时比对 → 过期丢弃
 */
const useData = (requestFunc, ...params) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const requestIdRef = useRef(0)

    async function getData() {
        const currentId = ++requestIdRef.current  // 每次请求分配新 ID
        setLoading(true)
        setError(null)
        try {
            const response = await requestFunc(...params)
            if (currentId !== requestIdRef.current) return        // 过期，丢弃
            
            // 后端返回格式：{ code: 200, data: {...}, message: '...' }
            // 统一取出 response.data.data 作为业务数据
            setData(response.data.data)
        } catch (err) {
            if (currentId !== requestIdRef.current) return        // 过期，丢弃
            
            // 错误分类处理
            let errorInfo = {
                message: '未知错误',
                code: 500,
                original: err
            }
            
            if (err.response) {
                // 服务器返回了错误响应
                const status = err.response.status
                const responseData = err.response.data
                
                switch (status) {
                    case 400:
                        errorInfo = {
                            message: responseData?.message || '请求参数错误',
                            code: 400,
                            original: err
                        }
                        break
                    case 401:
                        errorInfo = {
                            message: responseData?.message || '未登录或登录已过期',
                            code: 401,
                            original: err
                        }
                        break
                    case 403:
                        errorInfo = {
                            message: responseData?.message || '没有权限访问',
                            code: 403,
                            original: err
                        }
                        break
                    case 404:
                        errorInfo = {
                            message: responseData?.message || '请求的资源不存在',
                            code: 404,
                            original: err
                        }
                        break
                    case 500:
                        errorInfo = {
                            message: responseData?.message || '服务器内部错误',
                            code: 500,
                            original: err
                        }
                        break
                    default:
                        errorInfo = {
                            message: responseData?.message || `请求失败 (${status})`,
                            code: status,
                            original: err
                        }
                }
            } else if (err.request) {
                // 请求发出但没有收到响应
                errorInfo = {
                    message: '网络连接失败，请检查网络',
                    code: 0,
                    original: err
                }
            } else {
                // 请求配置出错
                errorInfo = {
                    message: err.message || '请求配置错误',
                    code: -1,
                    original: err
                }
            }
            
            console.error('useDataError:', errorInfo)
            setError(errorInfo)
        } finally {
            if (currentId !== requestIdRef.current) return         // 过期，不设 loading=false
            setLoading(false)
        }
    }

    // 【底层原理】：[...params] 每次渲染都创建新数组对象，即使内容相同也会触发
    // useEffect 重新执行 → 死循环。用 JSON.stringify 做值比较，内容不变就不重新请求。
    const depsKey = JSON.stringify(params)

    useEffect(() => {
        getData()
    }, [depsKey])

    // refresh：手动触发重新请求，供外部调用（如"重试"按钮）
    const refresh = () => {
        getData()
    }

    return { data, loading, error, refresh }
}

export default useData