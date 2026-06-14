import { create } from 'zustand'
import Cookies from 'js-cookie'
import { getMyProfile } from '@/apis/account'

/**
 * 认证状态 Store
 * 
 * 状态：
 *   - isLoggedIn: 是否登录
 *   - user: 用户信息对象（可选，用于缓存）
 *   - loginModalOpen: 登录弹窗是否显示
 * 
 * 方法：
 *   - login(token, uid): 登录成功，存储 token 并设置状态
 *   - logout(): 退出登录，清除 token 并重置状态
 *   - openLoginModal(): 打开登录弹窗
 *   - closeLoginModal(): 关闭登录弹窗
 *   - initAuth(): 初始化时从 Cookie 恢复登录状态，并验证 token 有效性
 */

const useAuthStore = create((set) => ({
  // ==================== 状态定义 ====================
  
  /**
   * 是否登录
   * 初始值：从 Cookie 中读取 token，存在则为 true
   */
  isLoggedIn: !!Cookies.get('token'),

  /**
   * 用户信息（可选缓存）
   * 可以在登录后存储用户基本信息，避免重复请求
   */
  user: null,

  /**
   * 登录弹窗是否显示
   * 全局控制，任何组件都可以触发
   */
  loginModalOpen: false,

  // ==================== 方法定义 ====================

  /**
   * 登录成功后的处理
   * @param {string} token - 后端返回的 token
   * @param {string} uid - 用户 ID
   * @param {object} userInfo - 可选，用户基本信息
   * 
   * 工作流程：
   * 1. 将 token 和 uid 存入 Cookie
   * 2. 更新 Zustand 状态（isLoggedIn = true）
   * 3. 可选缓存用户信息
   * 4. 关闭登录弹窗
   */
  login: (token, uid, userInfo = null) => {
    // 存储到 Cookie（过期时间 7 天）
    Cookies.set('token', token, { expires: 7 })
    Cookies.set('uid', uid, { expires: 7 })

    // 更新 Zustand 状态
    set({
      isLoggedIn: true,
      user: userInfo,
      loginModalOpen: false,  // 登录成功后关闭弹窗
    })
  },

  /**
   * 退出登录
   * 
   * 工作流程：
   * 1. 清除 Cookie 中的 token 和 uid
   * 2. 重置 Zustand 状态
   */
  logout: () => {
    // 清除 Cookie
    Cookies.remove('token')
    Cookies.remove('uid')

    // 重置 Zustand 状态
    set({
      isLoggedIn: false,
      user: null,
    })
  },

  /**
   * 打开登录弹窗
   * 
   * 使用场景：
   * - 未登录用户点击点赞/收藏时
   * - 未登录用户尝试上传时
   * - 任何需要登录的操作前
   */
  openLoginModal: () => {
    set({ loginModalOpen: true })
  },

  /**
   * 关闭登录弹窗
   * 
   * 使用场景：
   * - 用户点击遮罩关闭
   * - 用户点击 X 按钮关闭
   * - 登录成功后自动关闭
   */
  closeLoginModal: () => {
    set({ loginModalOpen: false })
  },

  /**
   * 初始化认证状态
   * 
   * 调用时机：
   * - App 启动时（main.jsx）
   * - 刷新页面时从 Cookie 恢复状态
   * 
   * 工作流程：
   * 1. 检查 Cookie 中是否有 token
   * 2. 如果有，调接口验证 token 是否有效
   * 3. 如果有效，设置 isLoggedIn = true 并缓存用户信息
   * 4. 如果无效，清除 Cookie 和状态
   */
  initAuth: async () => {
    const token = Cookies.get('token')
    
    if (!token) {
      // 没有 token，确保状态为未登录
      set({ isLoggedIn: false, user: null })
      return
    }

    try {
      // 调接口验证 token 是否有效
      const res = await getMyProfile()
      
      // 接口返回成功，token 有效
      set({ 
        isLoggedIn: true, 
        user: res.data 
      })
    } catch (err) {
      // token 无效或接口调用失败，清除登录状态
      Cookies.remove('token')
      Cookies.remove('uid')
      set({ isLoggedIn: false, user: null })
    }
  },

  /**
   * 更新用户信息（可选）
   * @param {object} userInfo - 新的用户信息
   */
  setUser: (userInfo) => {
    set({ user: userInfo })
  },
}))

export default useAuthStore
