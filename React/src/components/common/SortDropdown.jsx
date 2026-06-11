import React, { useState, useEffect, useRef } from 'react'

/**
 * 排序下拉组件（纯 Tailwind 实现，替代 Antd Dropdown）
 * @param {function} pushSort - 回调，将当前选中的 sort key 通知父组件
 * @param {string} defaultSort - 默认排序 key
 * @param {Array<{label: string, key: string}>} sortList - 排序选项列表（必填）
 */
const App = ({ pushSort, defaultSort = '-viewCount', sortList = [] }) => {
  const [sort, setSort] = useState(defaultSort)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // sort 变了 → 通知父组件 → 父组件更新 sort → 下游 CommentList 重新请求
  useEffect(() => {
    pushSort(sort)
  }, [sort, pushSort])

  // 点击外部 → 关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const onSelect = (key) => {
    setSort(key)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      {/* 触发按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <span>{sortList.find(i => i.key === sort)?.label}</span>
        {/* 自定义小三角，用 CSS 旋转实现展开/收起动画 */}
        <span className={`text-xs transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {/* 下拉菜单面板 */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          {sortList.map((item) => (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className={`
                w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer
                ${item.key === sort
                  ? 'bg-gray-50 text-blue-500 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default App