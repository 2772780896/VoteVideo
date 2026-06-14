import React, { useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'
import TopMenuApp from '@/components/common/TopMenu'
import DataList from '@/components/common/DataList'
import SortDropdown from '@/components/common/SortDropdown'
import { fetchItemList } from '@/apis/content'
import VideoCard from '@/components/common/DataCard/VideoCard'
import PostCard from '@/components/common/DataCard/PostCard'
import EssayCard from '@/components/common/DataCard/EssayCard'
import UserCard from '@/components/common/DataCard/UserCard'
import TagCard from '@/components/common/DataCard/TagCard'
import CommentCard from '@/components/common/DataCard/CommentCard'

// 默认推荐排序（q 为空时使用）
const DEFAULT_SORT = '-viewCount'

/**
 * 【面试必考】搜索类型映射表
 *   key  → URL tab 值
 *   type → API 资源类型（传给 fetchItemList）
 *   Card / idKey / propName → 跟 ProfileTabContent 一样的卡片渲染模式
 */
const SEARCH_MAP = {
  videos:   { label: '视频',   type: 'video',   Card: VideoCard,   idKey: 'vid', propName: 'video' },
  essays:   { label: '文章',   type: 'essay',   Card: EssayCard,   idKey: 'eid', propName: 'essay' },
  posts:    { label: '动态',   type: 'post',    Card: PostCard,    idKey: 'pid', propName: 'post' },
  comments: { label: '评论',   type: 'comment', Card: CommentCard, idKey: 'cid', propName: 'comment' },
  users:    { label: '用户',   type: 'user',    Card: UserCard,    idKey: 'uid', propName: 'user' },
  tags:     { label: '标签',   type: 'tag',     Card: TagCard,    idKey: 'tid', propName: 'tag' },
}

const SearchPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // 搜索关键词 + 活跃 tab，均从 URL 读取
  const keyword = searchParams.get('q') || ''
  const activeKey = searchParams.get('tab') || 'videos'

  const [sort, setSort] = useState()

  // q 为空时使用默认热度排序，否则使用用户选择的排序
  const effectiveSort = keyword ? sort : (sort || DEFAULT_SORT)

  // 搜索输入框 → 更新 URL，保留当前 tab
  const [input, setInput] = useState(keyword)
  const handleSearch = useCallback(() => {
    navigate(`/search?q=${encodeURIComponent(input)}&tab=${activeKey}`)
  }, [input, activeKey, navigate])

  // Tab 切换 → 更新 URL，保留搜索词
  const handleTab = (key) => {
    navigate(`/search?q=${encodeURIComponent(keyword)}&tab=${key}`)
    setSort(null)
  }

  const { Card, idKey, propName, type } = SEARCH_MAP[activeKey]

  return (
    <div className="min-h-screen bg-white">
      <TopMenuApp />

      <main className="max-w-4xl mx-auto px-4 py-6">

        {/* 搜索栏 */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="搜索视频、文章、用户..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg
              hover:bg-blue-600 transition-colors cursor-pointer"
          >
            搜索
          </button>
        </div>

        {/* Tab 切换（无论有无搜索词都显示，允许切换浏览热门内容） */}
        <div className="flex border-b border-gray-200 mb-4">
          {Object.entries(SEARCH_MAP).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => handleTab(key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                key === activeKey
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 排序 */}
        <div className="mb-4">
          <SortDropdown pushSort={setSort} defaultSort={keyword ? undefined : DEFAULT_SORT} />
        </div>

        {/* 列表：有搜索词时按关键词搜索，无搜索词时按热度展示默认推荐 */}
        <DataList
          key={activeKey + keyword}
          request={(s, p, e) => fetchItemList(type, { sort: s, page: p, element: e, q: keyword || undefined })}
          sort={effectiveSort}
          params={[type, keyword]}
          pageSize={16}
          renderItem={(item) => {
            const props = { [propName]: item }
            return <Card key={item[idKey]} {...props} />
          }}
          gridClassName={type === 'comment' ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}
        />
      </main>
    </div>
  )
}

export default SearchPage
