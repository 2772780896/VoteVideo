import React, { useState, useRef } from 'react'
import interact from '@/apis/content'
import useAuthStore from '@/stores/authStore'

/**
 * 评论回复组件：内嵌在 InteractionBar 中
 * 点击"回复"按钮展开输入框，输入后提交
 */
const ReplyBox = ({ mediaType, mediaId, onSuccess }) => {
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!replyText.trim()) return

    setIsSubmitting(true)
    try {
      await interact(mediaType, 'reply', mediaId, { text: replyText })
      setReplyText('')
      setIsReplying(false)
      onSuccess?.()
    } catch {
      alert('回复失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isReplying) {
    return (
      <button
        onClick={() => setIsReplying(true)}
        className="hover:text-gray-700 transition-colors cursor-pointer"
      >
        💬 回复
      </button>
    )
  }

  return (
    <div className="mt-2">
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="写下你的回复..."
        className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-blue-500"
        rows={3}
      />
      <div className="flex justify-end gap-2 mt-1">
        <button
          onClick={() => setIsReplying(false)}
          className="px-3 py-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !replyText.trim()}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? '提交中...' : '提交'}
        </button>
      </div>
    </div>
  )
}

/**
 * 【面试必考】ID_KEY_MAP 映射表模式：
 * 根据 mediaType 动态取 item 的 ID 字段，O(1) 查找，无需 if/else 链。
 * 新增资源类型只需加一行，组件其余代码零改动。
 */
const ID_KEY_MAP = {
  video:   'vid',
  essay:   'eid',
  post:    'pid',
  tag:     'tid',
  user:    'uid',
  comment: 'cid',
}

/**
 * 通用交互操作条：点赞 / 点踩 / 收藏 / 转发
 * 先调 API，成功后再更新 UI——不搞乐观更新，逻辑直观，无回滚代码
 * 
 * 登录检查：
 * - 如果用户未登录，打开登录弹窗
 * - 已登录才执行实际操作
 *
 * 按钮显示规则（根据 mediaType 自动决定）：
 * - video / essay / post: 点赞、收藏、转发
 * - comment:              点赞、点踩
 *
 * @param {string}  mediaType           - 资源类型 'video' | 'essay' | 'post' | 'tag' | 'user' | 'comment'
 * @param {object}  item                - 资源对象，需含 isLiked/likeCount/isFavourited/...
 * @param {boolean} [showReshare=true]  - 是否显示转发按钮（部分资源类型不需要）
 */
const InteractionBar = ({ mediaType, item, showReshare = true }) => {
  // 从映射表拿资源 ID
  const mediaId = item?.[ID_KEY_MAP[mediaType]]

  // 点赞
  const [isLiked, setIsLiked] = useState(item?.isLiked ?? false)
  const [likeCount, setLikeCount] = useState(item?.likeCount ?? 0)

  // 点踩（评论专用）
  const [isDisliked, setIsDisliked] = useState(item?.isDisliked ?? false)

  // 收藏
  const [isFavourited, setIsFavourited] = useState(item?.isFavourited ?? false)
  const [favouriteCount, setFavouriteCount] = useState(item?.favouriteCount ?? 0)

  // 转发
  const [isReshared, setIsReshared] = useState(item?.isReshared ?? false)
  const [reshareCount, setReshareCount] = useState(item?.reshareCount ?? 0)

  // 失败提示
  const [errorMsg, setErrorMsg] = useState(null)
  const timerRef = useRef(null)

  // 【Zustand】获取登录状态和打开登录弹窗的方法
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const openLoginModal = useAuthStore(state => state.openLoginModal)

  const showError = (msg) => {
    setErrorMsg(msg)
    clearTimeout(timerRef.current)
    // 2 秒后自动消失
    timerRef.current = setTimeout(() => setErrorMsg(null), 2000)
  }

  /**
   * 检查登录状态
   * 如果未登录，打开登录弹窗并返回 false
   */
  const checkLogin = () => {
    if (!isLoggedIn) {
      openLoginModal()  // 打开登录弹窗
      return false
    }
    return true
  }

  const handleLike = async () => {
    // 【登录检查】未登录则打开登录弹窗
    if (!checkLogin()) return

    const next = !isLiked
    try {
      await interact(mediaType, next ? 'like' : 'unlike', mediaId)
      setIsLiked(next)
      setLikeCount(prev => next ? prev + 1 : prev - 1)
    } catch {
      showError('操作失败，请重试')
    }
  }

  const handleDislike = async () => {
    // 【登录检查】未登录则打开登录弹窗
    if (!checkLogin()) return

    const next = !isDisliked
    try {
      await interact(mediaType, next ? 'dislike' : 'undislike', mediaId)
      setIsDisliked(next)
    } catch {
      showError('操作失败，请重试')
    }
  }

  const handleFavourite = async () => {
    // 【登录检查】未登录则打开登录弹窗
    if (!checkLogin()) return

    const next = !isFavourited
    try {
      await interact(mediaType, next ? 'favourite' : 'unfavourite', mediaId)
      setIsFavourited(next)
      setFavouriteCount(prev => next ? prev + 1 : prev - 1)
    } catch {
      showError('操作失败，请重试')
    }
  }

  const handleReshare = async () => {
    // 【登录检查】未登录则打开登录弹窗
    if (!checkLogin()) return

    const next = !isReshared
    try {
      await interact(mediaType, next ? 'reshare' : 'unreshare', mediaId)
      setIsReshared(next)
      setReshareCount(prev => next ? prev + 1 : prev - 1)
    } catch {
      showError('操作失败，请重试')
    }
  }

  // 样式适配：评论用紧凑样式，其他用完整样式
  const isComment = mediaType === 'comment'
  const containerClass = isComment
    ? ''  // 评论卡片：无额外样式
    : 'relative mb-6 pb-6 border-b border-gray-100'  // 视频等：有底部边框和间距

  return (
    <div className={containerClass}>
      {/* 按钮行 */}
      <div className={`flex items-center gap-4 text-xs text-gray-500 ${!isComment ? 'gap-6' : ''}`}>
        {/* 点赞 */}
        <button
          onClick={handleLike}
          className={`transition-colors cursor-pointer ${isLiked ? 'text-blue-500' : 'hover:text-blue-500'}`}
        >
          👍 {likeCount > 0 ? likeCount : ''}
        </button>

        {/* 点踩（所有类型都支持） */}
        <button
          onClick={handleDislike}
          className={`transition-colors cursor-pointer ${
            isDisliked ? 'text-red-400' : 'hover:text-gray-700'
          }`}
        >
          👎 点踩
        </button>

        {/* 收藏（所有类型都支持） */}
        <button
          onClick={handleFavourite}
          className={`transition-colors cursor-pointer ${
            isFavourited ? 'text-yellow-500' : 'hover:text-yellow-500'
          }`}
        >
          ⭐ {favouriteCount > 0 ? favouriteCount : ''}
        </button>

        {/* 回复（所有类型都支持） */}
        <ReplyBox mediaType={mediaType} mediaId={mediaId} />

        {/* 转发（可关闭） */}
        {showReshare && (
          <button
            onClick={handleReshare}
            className={`transition-colors cursor-pointer ${
              isReshared ? 'text-green-500' : 'hover:text-green-500'
            }`}
          >
            ↗ {reshareCount > 0 ? reshareCount : ''}
          </button>
        )}
      </div>

      {/* 失败提示：底部飘出一个红色提示条，2 秒自动消失 */}
      {errorMsg && (
        <div className="absolute -bottom-1 left-0 translate-y-full mt-1 text-sm text-red-500 transition-opacity duration-300">
          {errorMsg}
        </div>
      )}
    </div>
  )
}

export default InteractionBar
