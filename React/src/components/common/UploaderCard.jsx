import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { interact } from '@/apis/content'
import useAuthStore from '@/stores/authStore'

/**
 * 通用上传者卡片组件
 *
 * 功能：
 * - 显示上传者信息（头像、用户名、关注者数）
 * - 关注/取关功能（需登录）
 * - 点击头像/用户名跳转到用户页
 * - 发消息功能（需登录，跳转到个人中心的消息页）
 *
 * Props：
 * @param {Object} item      - 资源对象（video / essay / post / tag），需含 uploader 字段
 * @param {string} mediaType - 资源类型 'video' | 'essay' | 'post' | 'tag'（可选，向后兼容）
 *
 * 向后兼容：
 * - 如果传入 video prop，则自动作为 item 使用（旧调用方式无需改动）
 *
 * 所需后端接口与数据格式：
 *
 * 1. GET /api/{mediaType}/{id} — 获取资源详情
 *    返回对象需包含 uploader 字段：
 *    {
 *      vid/eid/pid/tid: number,        // 资源 ID
 *      uploader: {
 *        uid: number,                   // 用户唯一 ID
 *        userName: string,              // 用户名
 *        profilePictureUrl: string,     // 头像 URL（可为空）
 *        followerCount: number,         // 关注者数量
 *        isFollowing: boolean           // 当前用户是否已关注该上传者
 *      }
 *    }
 *
 * 2. POST /api/user/{uid}/follow — 关注用户
 *    请求头：需携带 Authorization Token
 *    请求体：无
 *    返回：{ success: true }
 *
 * 3. DELETE /api/user/{uid}/follow — 取消关注
 *    请求头：需携带 Authorization Token
 *    返回：{ success: true }
 *
 * 4. GET /api/user/{uid} — 用户信息（跳转到用户页时由 User 页面请求）
 *    返回：用户完整信息
 */
const UploaderCard = ({ item, mediaType, video }) => {
  // 向后兼容：如果传了 video（旧接口），则使用 video 作为 item
  const actualItem = item || video
  const navigate = useNavigate()
  const uploader = actualItem?.uploader
  const uid = uploader?.uid

  // 从 Zustand 获取登录状态
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const openLoginModal = useAuthStore(state => state.openLoginModal)

  // 关注状态（使用 useEffect 确保切换资源时更新）
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 当 uploader 数据变化时，更新关注状态
   * 修复：切换资源时关注状态不更新的 bug
   */
  useEffect(() => {
    if (uploader?.isFollowing !== undefined) {
      setIsFollowing(uploader.isFollowing)
    }
  }, [uploader?.isFollowing])

  /**
   * 关注/取关处理
   *
   * 流程：
   * 1. 检查登录状态
   * 2. 乐观更新 UI
   * 3. 调用接口
   * 4. 失败时回滚
   */
  const handleFollow = async () => {
    // 未登录，打开登录弹窗
    if (!isLoggedIn) {
      openLoginModal()
      return
    }

    if (!uid || isLoading) return

    // 乐观更新
    const prev = isFollowing
    setIsFollowing(!prev)
    setIsLoading(true)

    try {
      if (prev) {
        // 取消关注
        await interact('user', 'unfollow', uid)
      } else {
        // 关注
        await interact('user', 'follow', uid)
      }
    } catch (err) {
      // 失败时回滚
      console.error('关注操作失败：', err)
      setIsFollowing(prev)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 跳转到用户页
   */
  const goToUserPage = () => {
    if (uid) {
      navigate(`/user/${uid}`)
    }
  }

  /**
   * 发消息功能
   *
   * 流程：
   * 1. 检查登录状态
   * 2. 如果未登录，打开登录弹窗
   * 3. 如果已登录，跳转到个人中心的消息页，并传递目标用户信息
   */
  const handleMessage = () => {
    // 未登录，打开登录弹窗
    if (!isLoggedIn) {
      openLoginModal()
      return
    }

    // 跳转到个人中心的消息页，并传递目标用户信息
    navigate('/user/profile?tab=message', {
      state: {
        targetUser: {
          uid: uploader.uid,
          userName: uploader.userName,
          profilePictureUrl: uploader.profilePictureUrl
        }
      }
    })
  }

  // 上传者信息不存在时，不渲染
  if (!uploader) {
    return null
  }

  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
      {/* 头像（点击跳转到用户页） */}
      <div
        className="w-[50px] h-[50px] rounded-full overflow-hidden flex-shrink-0 bg-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={goToUserPage}
      >
        {uploader.profilePictureUrl ? (
          <img
            src={uploader.profilePictureUrl}
            alt={uploader.userName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
            👤
          </div>
        )}
      </div>

      {/* 用户信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          {/* 用户名（点击跳转到用户页） */}
          <span
            className="font-medium text-gray-900 truncate cursor-pointer hover:text-blue-500 transition-colors"
            onClick={goToUserPage}
          >
            {uploader.userName || '未知用户'}
          </span>

          {/* 关注者数量 */}
          {uploader.followerCount !== undefined && (
            <span className="text-sm text-gray-500">
              {uploader.followerCount} 关注者
            </span>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          {/* 关注按钮 */}
          <button
            onClick={handleFollow}
            disabled={isLoading}
            className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${
              isFollowing
                ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                : 'text-white bg-blue-500 hover:bg-blue-600'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? '处理中...' : (isFollowing ? '已关注' : '+ 关注')}
          </button>

          {/* 发消息按钮（需登录） */}
          <button
            onClick={handleMessage}
            className="px-3 py-1 text-sm text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            💬 发消息
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploaderCard
