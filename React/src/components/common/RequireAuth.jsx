import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '@/stores/authStore'

/**
 * 路由守卫组件
 * 
 * 功能：
 * - 检查用户是否登录
 * - 如果未登录，重定向到首页并打开登录弹窗
 * 
 * 使用方式：
 * <RequireAuth>
 *   <ProtectedComponent />
 * </RequireAuth>
 */

const RequireAuth = ({ children }) => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  const openLoginModal = useAuthStore(state => state.openLoginModal)

  /**
   * 如果未登录：
   * 1. 打开登录弹窗
   * 2. 重定向到首页
   */
  if (!isLoggedIn) {
    // 打开登录弹窗
    openLoginModal()
    
    // 重定向到首页
    return <Navigate to="/" replace />
  }

  // 已登录，渲染受保护的组件
  return children
}

export default RequireAuth
