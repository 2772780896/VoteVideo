import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import TopMenuApp from '@/components/common/TopMenu'
import VideoPlayerApp from '@/components/common/VideoPlayer'
import InteractionBar from '@/components/common/InteractionBar'
import DataList from '@/components/common/DataList'
import CommentCard from '@/components/common/DataCard/CommentCard'
import { fetchItem, fetchItemList } from '@/apis/content'
import UploadCardApp from '@/components/common/UploaderCard'
import VideoCard from '@/components/common/DataCard/VideoCard'
import TagRow from '@/components/common/TagRow'
import useData from '@/hooks/useData'
import SortDropdown from '@/components/common/SortDropdown'

// 评论区排序选项
const commentSortList = [
  { label: '最新评论', key: '-date' },
  { label: '最早评论', key: 'date' },
]

const VideoPage = () => {
  const { vid } = useParams()

  // videoLoading / videoError 由 VideoPlayerApp 内部使用，不再透传给子组件
  const { data: videoData, loading: videoLoading, error: videoError, refresh: refreshVideo } = useData(fetchItem, 'video', vid)
  const video = videoData

  const [sort, setSort] = useState('-date')

  // 通知跳转：URL 带 ?comment=cid → 评论区加载完后滚到对应评论
  const [searchParams] = useSearchParams()
  const targetCommentId = searchParams.get('comment')
  useEffect(() => {
    if (!videoLoading && targetCommentId) {
      // 等一会让 DataList 渲染完
      setTimeout(() => {
        const el = document.getElementById(`comment-${targetCommentId}`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [videoLoading, targetCommentId])

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航 */}
      <TopMenuApp />

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
              <VideoPlayerApp
                playVideo={video}
                loading={videoLoading}
                error={videoError}
                onRefresh={refreshVideo}
              />
            </div>

            {/* 标签行 */}
            <div className="mb-4">
              <TagRow tagList={video?.tagList} />
            </div>

            {/* 互动按钮（状态自有，不污染 VideoPage） */}
            <InteractionBar mediaType="video" item={video} />

            {/* 评论区排序 + 评论列表 */}
            <div className="mb-6">
              {/* sortList 显式传入，组件不再有隐式默认值 */}
              <SortDropdown pushSort={setSort} defaultSort="-date" sortList={commentSortList} />
            </div>
            <DataList
              request={(sort, page, element) =>
                fetchItemList('comment', { sort, page, element, vid: video?.vid })
              }
              sort={sort}
              params={[video?.vid]}
              pageSize={16}
              renderItem={(item) => (
                <CommentCard
                  key={item.cid}
                  comment={item}
                />
              )}
            />

          </div>

          {/* ===== 右侧：上传者信息 + 相关视频 ===== */}
          <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">

            {/* 上传者信息卡 */}
            <UploadCardApp playVideo={video} />

            {/* 相关视频推荐 */}
            <h2 className="text-base font-semibold text-gray-800 mb-3">视频推荐</h2>
            {video && (
              <DataList
                request={(sort, page, element) =>
                  fetchItemList('video', { subType: 'related', vid: video?.vid, sort, page, element })
                }
                sort={null}
                params={[video?.vid]}
                pageSize={5}
                renderItem={(v) => <VideoCard key={v.vid} video={v} />}
                gridClassName="flex flex-col gap-3"
              />
            )}

          </div>

        </div>
      </main>
    </div>
  )
}

export default VideoPage  