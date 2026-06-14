import React, { useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import TopMenu from '@/components/common/TopMenu'
import VideoPlayer from '@/components/common/VideoPlayer'
import InteractionBar from '@/components/common/InteractionBar'
import CommentSection from '@/components/common/CommentSection'
import RelatedSidebar from '@/components/common/RelatedSidebar'
import { fetchItem, interact } from '@/apis/content'
import useData from '@/hooks/useData'

const VideoPage = () => {
  const { vid } = useParams()

  // videoLoading / videoError 由 VideoPlayerApp 内部使用，不再透传给子组件
  const { data: videoData, loading: videoLoading, error: videoError, refresh: refreshVideo } = useData(fetchItem, 'video', vid)
  const video = videoData

  // 通知跳转：URL 带 ?comment=cid → 评论区加载完后滚到对应评论
  const [searchParams] = useSearchParams()
  const targetCommentId = searchParams.get('comment')
  useEffect(() => {
    if (!videoLoading && targetCommentId) {
      // 等一会让评论区渲染完
      setTimeout(() => {
        const el = document.getElementById(`comment-${targetCommentId}`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [videoLoading, targetCommentId])

  // 历史记录：视频加载完成后自动记录到历史
  useEffect(() => {
    if (video && !videoLoading) {
      // 调用历史记录接口（静默失败，不影响用户体验）
      interact('video', 'history', vid).catch(() => {
        // 历史记录失败不影响主要功能
      })
    }
  }, [video, videoLoading, vid])

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航 */}
      <TopMenu />

      {/* 主体 */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* 双栏布局：左侧主内容 + 右侧边栏 */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ===== 左侧：视频信息 + 评论区 ===== */}
          <div className="flex-1 min-w-0">

            {/* 视频标题 */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {video?.title ?? ''}
            </h1>

            {/* 播放量 / 评论数 / 日期 */}
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
              <span>{video?.viewCount} 播放</span>
              <span>{video?.commentCount} 评论</span>
              <span>{video?.date}</span>
            </div>

            {/* 播放器（骨架屏 + 错误态 + 正常态由组件内部处理） */}
            <div className="mb-4">
              <VideoPlayer
                playVideo={video}
                loading={videoLoading}
                error={videoError}
                onRefresh={refreshVideo}
              />
            </div>

            {/* 标签行 */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {video?.tagList?.map(tag => (
                  <Link
                    key={tag.tid}
                    to={`/tag/${tag.tid}`}
                    className="inline-block px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors no-underline hover:no-underline"
                  >
                    {tag.tagName}
                  </Link>
                ))}
              </div>
            </div>

            {/* 互动按钮（状态自有，不污染 VideoPage） */}
            <InteractionBar mediaType="video" item={video} />

            {/* 评论区（通用组件，内置排序 + 分页） */}
            <CommentSection parentId={video?.vid} parentType="video" />

          </div>

          {/* ===== 右侧：上传者信息 + 相关视频 ===== */}
          <RelatedSidebar item={video} mediaType="video" />

        </div>
      </main>
    </div>
  )
}

export default VideoPage
