import React, { useState } from 'react';
import Cookies from 'js-cookie'
import TopMenuApp from '@/components/common/TopMenu'
import DataList from '@/components/common/DataList'
import SortDropdown from '@/components/common/SortDropdown'
import { fetchItemList } from '@/apis/content'
import VideoCard from '@/components/common/DataCard/VideoCard'
import PostCard from '@/components/common/DataCard/PostCard'
import EssayCard from '@/components/common/DataCard/EssayCard'
import TagCard from '@/components/common/DataCard/TagCard'
import CommentCard from '@/components/common/DataCard/CommentCard'

/**
 * 动态页媒体类型映射表
 * key  → URL tab 值
 * type → API 资源类型（传给 fetchItemList）
 * Card / idKey / propName → 与 Search.jsx、ProfileTabContent 一致的卡片渲染模式
 *
 * 所需后端接口：
 * GET /api/{type}?uid={currentUid}&following=true&sort={sort}&page={page}&element={element}
 * - uid       — 当前登录用户 ID（从 Cookie 读取）
 * - following — 固定为 true，表示只返回当前用户所关注用户的内容
 * - 返回格式：{ items: Resource[], total: number }
 *
 * 注意：本页面由路由守卫 RequireAuth 保护，进入时必定已登录，无需组件内再校验
 */
const FEED_MAP = {
  posts:    { label: '动态',   type: 'post',    Card: PostCard,    idKey: 'pid', propName: 'post' },
  videos:   { label: '视频',   type: 'video',   Card: VideoCard,   idKey: 'vid', propName: 'video' },
  essays:   { label: '文章',   type: 'essay',   Card: EssayCard,   idKey: 'eid', propName: 'essay' },
  comments: { label: '评论',   type: 'comment', Card: CommentCard, idKey: 'cid', propName: 'comment' },
  tags:     { label: '标签',   type: 'tag',     Card: TagCard,    idKey: 'tid', propName: 'tag' },
}

const sortList = [
  { label: '最新动态', key: '-date' },
  { label: '最早动态', key: 'date' },
]

const DynamicPage = () => {
  // 当前用户 ID（从 Cookie 读取，路由守卫保证已登录）
  const uid = Cookies.get('uid')

  const [activeKey, setActiveKey] = useState('posts')
  const [sort, setSort] = useState('-date')

  // 切换 Tab 时重置排序
  const handleTab = (key) => {
    setActiveKey(key)
    setSort('-date')
  }

  const { Card, idKey, propName, type } = FEED_MAP[activeKey]

  return (
    <div className="min-h-screen bg-white">
      <TopMenuApp />

      <main className="max-w-4xl mx-auto px-4 py-6">

        {/* 标题 + 排序 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">关注动态</h2>
          <SortDropdown pushSort={setSort} defaultSort="-date" sortList={sortList} />
        </div>

        {/* Tab 切换：动态 / 视频 / 文章 / 评论 / 标签 */}
        <div className="flex border-b border-gray-200 mb-4">
          {Object.entries(FEED_MAP).map(([key, { label }]) => (
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

        {/* 关注用户的内容流 */}
        {/*
          请求示例（以 posts 为例）：
          GET /api/post?uid={currentUid}&following=true&sort=-date&page=1&element=10

          后端逻辑：
          1. 根据 uid 查询该用户关注的所有用户 ID 列表
          2. 筛选这些用户发布的对应类型资源
          3. 按 sort 排序后分页返回
        */}
        <DataList
          key={activeKey}
          request={(s, p, e) =>
            fetchItemList(type, {
              sort: s,
              page: p,
              element: e,
              uid,
              following: true,
            })
          }
          sort={sort}
          params={[type, uid]}
          pageSize={10}
          renderItem={(item) => {
            const props = { [propName]: item }
            return <Card key={item[idKey]} {...props} />
          }}
          gridClassName="flex flex-col gap-4"
        />
      </main>
    </div>
  )
}

export default DynamicPage
