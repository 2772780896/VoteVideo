import React, { useState, useEffect } from 'react'
import useData from '@/hooks/useData'

/**
 * 通用数据列表组件
 * @param {Function} request - API 请求函数
 * @param {Function} renderItem - 每一项的渲染函数 (item, index) => ReactNode
 * @param {string|number} sort - 排序参数（传给 request）
 * @param {Array} params - 传给 request 的额外参数
 * @param {number} pageSize - 每页条数
 * @param {string} gridClassName - 容器布局类名（默认 flex 竖向列表，可传 grid 网格）
 */
const DataList = ({
  request,
  renderItem,
  sort,
  params = [],
  pageSize = 16,
  gridClassName = 'flex flex-col gap-4',
}) => {
  const [page, setPage] = useState(1)

  // sort 或额外参数变化 → 重置到第一页
  useEffect(() => {
    setPage(1)
  }, [sort, ...params])

  // useData 返回值：data 是 API 的 data 字段，refresh 手动刷新
  const { data: listData, loading, error, refresh } = useData(request, sort, page, pageSize, ...params)

  // 骨架屏：请求中时渲染 pageSize 个占位卡片，CLS=0
  if (loading) {
    return (
      <div className={gridClassName}>
        {Array(pageSize).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  // 错误态：显示错误提示和重试按钮（调用 refresh 重新发请求，不刷新页面）
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-4">
        <span>⚠ 数据加载失败</span>
        <button
          onClick={refresh}
          className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
        >
          重试
        </button>
      </div>
    )
  }

  // 正常态：从 data 中解构出列表和总数
  const items = listData?.data ?? []
  const total = listData?.total ?? 0
  const totalPages = Math.ceil(total / pageSize)

  // 空状态：API 返回成功但列表为空
  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 font-medium">
        暂无数据
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 py-6">
      {/* 内容列表 */}
      <div className={gridClassName}>
        {items.map((item, index) => renderItem(item, index))}
      </div>

      {/* 分页控制（仅一页时不显示） */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-4">
          <button
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
          >
            上一页
          </button>

          <span className="text-sm text-gray-600 font-medium">
            <span className="text-blue-600">{page}</span> / {totalPages}
          </span>

          <button
            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  )
}

export default DataList