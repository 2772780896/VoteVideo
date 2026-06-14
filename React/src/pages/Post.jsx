import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import TopMenuApp from '@/components/common/TopMenu'
import InteractionBar from '@/components/common/InteractionBar'
import VideoCard from '@/components/common/DataCard/VideoCard'
import CommentSection from '@/components/common/CommentSection'
import RelatedSidebar from '@/components/common/RelatedSidebar'
import useData from '@/hooks/useData';
import { fetchItem, interact } from '@/apis/content';

const PostPage = () => {
  const { pid } = useParams()
  const { data: postData, loading, error, refresh } = useData(fetchItem, 'post', pid)
  const post = postData

  // 历史记录：图文加载完成后自动记录到历史
  useEffect(() => {
    if (post && !loading) {
      // 调用历史记录接口（静默失败，不影响用户体验）
      interact('post', 'history', pid).catch(() => {
        // 历史记录失败不影响主要功能
      })
    }
  }, [post, loading, pid])

  return (
    <div className="min-h-screen bg-white">

      {/* 顶部导航 */}
      <TopMenuApp />

      {/* 主体 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* 双栏布局：左侧主内容 + 右侧边栏 */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ===== 左侧：动态信息 + 评论区 ===== */}
          <div className="flex-1 min-w-0">

            {/* ② 加载态 */}
            {loading && (
              <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-32" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6" />
                <div className="aspect-video bg-gray-200 rounded-xl" />
              </div>
            )}

            {/* ② 错误态 */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <span className="text-5xl mb-3">⚠</span>
                <span className="text-lg font-medium text-gray-500 mb-1">
                  {error?.data?.code === 404 ? '动态不存在' : '动态加载失败'}
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
            {!loading && !error && !post && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <span className="text-5xl mb-3">📭</span>
                <span className="text-lg font-medium text-gray-500">动态不存在</span>
              </div>
            )}

            {/* ② 正常态 */}
            {!loading && !error && post && (
              <>
                {/* 用户信息 */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {post.uploader?.userName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{post.uploader?.userName}</div>
                    <div className="text-sm text-gray-500">{post.date}</div>
                  </div>
                </div>

                {/* 标题 */}
                {post.title && (
                  <h1 className="text-xl font-bold text-gray-900 mb-4">{post.title}</h1>
                )}

                {/* ③ 文本区：有就亮 */}
                {post.text && (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
                    {post.text}
                  </p>
                )}

                {/* ③ 图片区：有就亮，网格排列 */}
                {post.pictureList?.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {post.pictureList.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`图片 ${i + 1}`}
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* ③ 视频区：有就亮，用 VideoCard */}
                {post.videoList?.length > 0 && (
                  <div className="mb-6">
                    <VideoCard video={post.videoList[0]} />
                  </div>
                )}

                {/* 互动栏 */}
                <InteractionBar mediaType="post" item={post} />

                {/* 通用评论区（内置排序 + 分页） */}
                <CommentSection parentId={post?.pid} parentType="post" />
              </>
            )}

          </div>

          {/* ===== 右侧：上传者信息 + 相关动态 ===== */}
          <RelatedSidebar item={post} mediaType="post" />

        </div>
      </main>
    </div>
  )
}
export default PostPage
