import React from 'react'
import { useParams, Link } from 'react-router-dom'
import TopMenu from '@/components/common/TopMenu'
import InteractionBar from '@/components/common/InteractionBar'
import { fetchItem } from '@/apis/content'
import useData from '@/hooks/useData'

const CommentPage = () => {
  const { cid } = useParams()

  // 获取评论详情
  const { data: commentData, loading, error } = useData(fetchItem, 'comment', cid)
  const comment = commentData

  // 加载态
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <TopMenu />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // 错误态
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <TopMenu />
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-gray-500 py-12">
            评论不存在或已删除
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航 */}
      <TopMenu />

      {/* 主体 */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 评论详情 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          {/* 评论者信息 */}
          <div className="flex items-center gap-3 mb-4">
            {comment.replyTo && (
              <span className="text-sm text-gray-500">
                回复 <span className="text-blue-500">@{comment.replyTo.userName}</span>
              </span>
            )}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
              <img
                src={comment.uploader.profilePictureUrl}
                alt={comment.uploader.userName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <Link
                to={`/user/${comment.uploader.uid}`}
                className="font-semibold text-gray-900 hover:text-blue-500 transition-colors"
              >
                {comment.uploader.userName}
              </Link>
              <div className="text-sm text-gray-500">{comment.date}</div>
            </div>
          </div>

          {/* 评论内容 */}
          <div className="text-gray-700 mb-4">
            {comment.text}
          </div>

          {/* 评论图片（如果有） */}
          {comment.type === 'picture' && comment.pictureList?.length > 0 && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {comment.pictureList.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`comment-img-${idx}`}
                  className="max-w-xs rounded-lg"
                />
              ))}
            </div>
          )}

          {/* 交互栏 */}
          <InteractionBar mediaType="comment" item={comment} showReshare={false} />
        </div>

        {/* 关联的资源（如果评论是针对某个视频/文章/图文的） */}
        {comment.parentType && comment.parentId && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">所属资源</h3>
            <Link
              to={`/${comment.parentType}/${comment.parentId}`}
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              查看原内容 →
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

export default CommentPage
