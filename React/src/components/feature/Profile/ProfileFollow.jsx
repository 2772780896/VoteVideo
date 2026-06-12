import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import DataList from '@/components/common/DataList'
import { getProfileSubdata } from '@/apis/account'
import interact from '@/apis/content'

/**
 * 关注列表
 * 取消关注 → 按钮变"关注"（用户不离开列表，可恢复）
 * 重新关注 → 按钮变回"取消关注"
 *
 * unfollowed: [uid] — 被取消关注的用户 uid 数组
 * 独立于 DataList 的本地 overlay，不传 params → 不触发重新请求
 * 不传进 DataList params → 不触发重新请求 → 数据稳定
 */
const ProfileFollow = () => {
  const navigate = useNavigate()
  const [unfollowed, setUnfollowed] = useState([])

  const handleUnfollow = async (uid) => {
    try {
      await interact('user', 'unfollow', uid)
      setUnfollowed(prev => [...prev, uid])
    } catch {}
  }

  const handleRefollow = async (uid) => {
    try {
      await interact('user', 'follow', uid)
      setUnfollowed(prev => prev.filter(id => id !== uid))
    } catch {}
  }

  return (
    <DataList
      request={getProfileSubdata}
      params={['follow', 'followingList']}
      sort={null}
      renderItem={(user) => {
        const isUnfollowed = unfollowed.includes(user.uid)

        return (
          <div key={user.uid} className="flex items-center justify-between py-3 border-b border-gray-100">
            {/* 用户信息 */}
            <div className="flex items-center gap-3">
              <img
                src={user.profilePictureUrl}
                alt={user.userName}
                className="w-10 h-10 rounded-full object-cover bg-gray-200 flex-shrink-0"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                <div className="text-xs text-gray-500">{user.followerCount?.toLocaleString()} 粉丝</div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/user/profile?tab=message', {
                  state: { targetUser: { uid: user.uid, userName: user.userName, profilePictureUrl: user.profilePictureUrl } }
                })}
                className="px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
              >
                💬 私信
              </button>

              {isUnfollowed ? (
                <button
                  onClick={() => handleRefollow(user.uid)}
                  className="px-3 py-1 text-xs text-blue-500 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  关注
                </button>
              ) : (
                <button
                  onClick={() => handleUnfollow(user.uid)}
                  className="px-3 py-1 text-xs text-red-500 border border-red-200 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                >
                  取消关注
                </button>
              )}
            </div>
          </div>
        )
      }}
      gridClassName="flex flex-col gap-0"
    />
  )
}

export default ProfileFollow
