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
            setData(response.data)
        } catch (err) {
            if (currentId !== requestIdRef.current) return        // 过期，丢弃
            console.log('useDataError:', err)
            setError(err)
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