import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyProfile } from '@/apis/account'
import useData from '@/hooks/useData'
import useAuthStore from '@/stores/authStore'

/**
 * 用户菜单组件
 * 
 * 使用 Zustand 处理登出，不再需要刷新页面
 */

const UserMenu = () => {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // 获取退出登录的方法
  const logout = useAuthStore(state => state.logout)

  const { data: profileData, loading } = useData(getMyProfile)
  const profile = profileData

  /**
   * 处理退出登录
   * 
   * 之前：
   *   - Cookies.remove('token')
   *   - Cookies.remove('uid')
   *   - window.location.reload()
   * 
   * 现在：
   *   - 调用 logout() 统一处理
   *   - 不需要刷新页面，Zustand 状态更新后组件会自动重新渲染
   */
  const handleLogout = () => {
    // 调用 Zustand 的 logout 方法
    logout()
    
    // 关闭下拉菜单
    setDropdownOpen(false)
    
    // 跳转到首页
    navigate('/')
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

            <Link
              to="/upload"
              onClick={() => setDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              上传视频
            </Link>

            <Link
              to="/dynamic"
              onClick={() => setDropdownOpen(false)}
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              动态
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
