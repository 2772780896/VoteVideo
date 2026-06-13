import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { getMyProfile } from '@/apis/account'
import useData from '@/hooks/useData'

const UserMenu = () => {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { data: profileData, loading } = useData(getMyProfile)
  const profile = profileData

  const handleLogout = () => {
    Cookies.remove('token')
    Cookies.remove('uid')
    setDropdownOpen(false)
    navigate('/main')
    // 刷新页面以重置状态
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse" />
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="relative">
      {/* 头像按钮 */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-700 hover:border-blue-500 transition-colors cursor-pointer"
      >
        <img
          src={profile.profilePictureUrl || `https://picsum.photos/seed/${profile.uid}/200/200`}
          alt={profile.userName}
          className="w-full h-full object-cover"
        />
      </button>

      {/* 下拉菜单 */}
      {dropdownOpen && (
        <>
          {/* 遮罩层，点击关闭 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />

          <div className="absolute right-0 top-10 w-48 bg-gray-800 rounded-lg shadow-xl py-2 z-50 border border-gray-700">
            {/* 用户信息 */}
            <div className="px-4 py-2 border-b border-gray-700">
              <p className="text-sm font-medium text-white truncate">{profile.userName}</p>
              <p className="text-xs text-gray-400">{profile.followerCount || 0} 粉丝</p>
            </div>

            {/* 菜单项 */}
            <Link
              to="/user/profile"
              onClick={() => setDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              个人中心
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              退出登录
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default UserMenu
