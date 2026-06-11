import React from 'react';
import { useParams } from 'react-router-dom'
import TopMenuApp from '@/components/common/TopMenu'
import DataList from '@/components/common/DataList'
import CommentCard from '@/components/common/DataCard/CommentCard'
import InteractionBar from '@/components/common/InteractionBar'
import useData from '@/hooks/useData';
import { fetchItem, fetchItemList } from '@/apis/content';

const TagPage = () => {
  const { tid } = useParams()
  const { data: tagData, loading, error, refresh } = useData(fetchItem, 'tag', tid)
  const tag = tagData?.data

  return (
    <div className="min-h-screen bg-white">

      {/* 顶部导航 */}
      <TopMenuApp />

      {/* 主体 */}
      <main className="max-w-3xl mx-auto px-4 py-6">

        {/* ② 加载态 */}
        {loading && (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-40 mb-4" />
            <div className="flex gap-6 mb-6">
              <div className="h-5 bg-gray-200 rounded w-20" />
              <div className="h-5 bg-gray-200 rounded w-24" />
              <div className="h-5 bg-gray-200 rounded w-24" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        )}

        {/* ② 错误态 */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="text-5xl mb-3">⚠</span>
            <span className="text-lg font-medium text-gray-500 mb-1">
              {error?.data?.code === 404 ? '标签不存在' : '标签加载失败'}
            </span>
            {error?.data?.code !== 404 && (
              <button
                onClick={refresh}
                className="mt-3 px-5 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
              >
                重试
              </button>
            )}
          </div>
        )}

        {/* ② 空态 */}
        {!loading && !error && !tag && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="text-5xl mb-3">🏷</span>
            <span className="text-lg font-medium text-gray-500">标签不存在</span>
          </div>
        )}

        {/* ② 正常态 */}
        {!loading && !error && tag && (
          <>
            {/* 标签名 */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{tag.tagName}</h1>

            {/* 统计数据 */}
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
              <span>{tag.viewCount?.toLocaleString()} 浏览</span>
              <span>{tag.commentCount} 评论</span>
            </div>

            {/* 互动栏：标签无转发 */}
            <InteractionBar mediaType="tag" item={tag} showReshare={false} />

            {/* 评论区 */}
            <DataList
              request={(sort, page, element) =>
                fetchItemList('comment', { sort, page, element })
              }
              sort={null}
              renderItem={(item) => (
                <CommentCard key={item.cid} comment={item} />
              )}
            />
          </>
        )}

      </main>
    </div>
  )
}
export default TagPage
