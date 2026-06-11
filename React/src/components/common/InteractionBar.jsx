import React, { useState, useRef } from 'react'
import interact from '@/apis/content'

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
 * 通用交互操作条：点赞 / 收藏 / 转发
 * 先调 API，成功后再更新 UI——不搞乐观更新，逻辑直观，无回滚代码
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

  // 收藏
  const [isFavourited, setIsFavourited] = useState(item?.isFavourited ?? false)
  const [favouriteCount, setFavouriteCount] = useState(item?.favouriteCount ?? 0)

  // 转发
  const [isReshared, setIsReshared] = useState(item?.isReshared ?? false)
  const [reshareCount, setReshareCount] = useState(item?.reshareCount ?? 0)

  // 失败提示
  const [errorMsg, setErrorMsg] = useState(null)
  const timerRef = useRef(null)

  const showError = (msg) => {
    setErrorMsg(msg)
    clearTimeout(timerRef.current)
    // 2 秒后自动消失
    timerRef.current = setTimeout(() => setErrorMsg(null), 2000)
  }

  const handleLike = async () => {
    const next = !isLiked
    try {
      await interact(mediaType, next ? 'like' : 'unlike', mediaId)
      setIsLiked(next)
      setLikeCount(prev => next ? prev + 1 : prev - 1)
    } catch {
      showError('操作失败，请重试')
    }
  }

  const handleFavourite = async () => {
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
    const next = !isReshared
    try {
      await interact(mediaType, next ? 'reshare' : 'unreshare', mediaId)
      setIsReshared(next)
      setReshareCount(prev => next ? prev + 1 : prev - 1)
    } catch {
      showError('操作失败，请重试')
    }
  }

  return (
    <div className="relative mb-6 pb-6 border-b border-gray-100">
      {/* 按钮行 */}
      <div className="flex items-center gap-6">
        {/* 点赞 */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors cursor-pointer ${
            isLiked ? 'text-blue-500' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span>👍</span>
          <span>{likeCount > 0 ? likeCount : '点赞'}</span>
        </button>

        {/* 收藏 */}
        <button
          onClick={handleFavourite}
          className={`flex items-center gap-2 transition-colors cursor-pointer ${
            isFavourited ? 'text-yellow-500' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <span>⭐</span>
          <span>{favouriteCount > 0 ? favouriteCount : '收藏'}</span>
        </button>

        {/* 转发（可关闭） */}
        {showReshare && (
          <button
            onClick={handleReshare}
            className={`flex items-center gap-2 transition-colors cursor-pointer ${
              isReshared ? 'text-green-500' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>↗</span>
            <span>{reshareCount > 0 ? reshareCount : '转发'}</span>
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
