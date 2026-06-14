import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { login, register } from '@/apis/account'
import useAuthStore from '@/stores/authStore'

/**
 * 登录/注册弹窗组件
 * 
 * 使用 Zustand 控制弹窗显示状态，允许其他组件触发登录弹窗
 */

const LoginModal = () => {
  // ==================== Zustand 状态和方法 ====================
  
  /**
   * 获取弹窗显示状态
   * 之前：const [open, setOpen] = useState(false)
   * 现在：从 Zustand 全局状态获取，允许其他组件控制
   */
  const loginModalOpen = useAuthStore(state => state.loginModalOpen)
  
  /**
   * 获取关闭弹窗的方法
   * 之前：const close = () => { setOpen(false); resetForm() }
   * 现在：调用 Zustand 的 closeLoginModal()，并在本组件内重置表单
   */
  const closeLoginModal = useAuthStore(state => state.closeLoginModal)
  
  /**
   * 获取登录成功后的状态更新方法
   * 之前：通过 onLoginSuccess 回调通知父组件
   * 现在：直接调用 Zustand 的 login() 方法更新全局状态
   */
  const loginAction = useAuthStore(state => state.login)

  // ==================== 本地状态（表单相关） ====================
  
  // 当前模式：登录 / 注册
  const [mode, setMode] = useState('login')

  // 输入框状态（登录/注册共用）
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // 内联提示消息
  const [msg, setMsg] = useState(null)

  // 提交中防重复点击
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  /**
   * 点击"登录"或"注册"按钮时触发
   * 根据 mode 决定调用 login() 还是 register()
   * 注册成功后自动调 login() 完成登录
   */
  const handleSubmit = async () => {
    // 空值校验
    if (!username || !password) {
      setMsg({ type: 'error', text: '请填写用户名和密码' })
      return
    }

    setLoading(true)
    setMsg(null)

    try {
      if (mode === 'login') {
        // === 登录 ===
        const res = await login(username, password)

        if (res.data.code === 200) {
          const { token, uid } = res.data.data
          
          /**
           * 登录成功，更新全局状态
           * loginAction() 会：
           * 1. 将 token 和 uid 存入 Cookie
           * 2. 设置 isLoggedIn = true
           * 3. 关闭登录弹窗（loginModalOpen = false）
           */
          loginAction(token, uid)
          
          setMsg({ type: 'success', text: '登录成功，正在跳转...' })
          setTimeout(() => {
            resetForm()
            navigate('/user/profile')
          }, 800)
        } else {
          setMsg({ type: 'error', text: res.data.message || '用户名或密码错误' })
        }
      } else {
        // === 注册 ===
        const res = await register(username, password)

        if (res.data.code === 201) {
          const { token, uid } = res.data.data
          
          /**
           * 注册成功，直接登录（更新全局状态）
           */
          loginAction(token, uid)
          
          setMsg({ type: 'success', text: '注册成功，正在跳转...' })
          setTimeout(() => {
            resetForm()
            navigate('/user/profile')
          }, 800)
        } else {
          setMsg({ type: 'error', text: res.data.message || '注册失败' })
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || '请求失败，请重试'
      setMsg({ type: 'error', text: errorMsg })
    } finally {
      setLoading(false)
    }
  }

  /**
   * 关闭弹窗并清空表单
   * 触发点：遮罩点击 / ✕ 按钮
   */
  const close = () => {
    closeLoginModal()
    resetForm()
  }

  /**
   * 重置输入框和提示消息
   */
  const resetForm = () => {
    setMsg(null)
    setUsername('')
    setPassword('')
  }

  /**
   * 点 Tab 切换登录/注册模式，同时清掉旧提示
   */
  const switchMode = (m) => {
    setMode(m)
    setMsg(null)
  }

  return (
    <>
      {/* 触发按钮：导航头"登录"入口 */}
      <button
        onClick={() => useAuthStore.getState().openLoginModal()}
        className="px-4 py-1.5 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
      >
        登录
      </button>

      {/* 弹窗主体（loginModalOpen 为 true 时才渲染） */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* 半透明遮罩 — 点空白处关闭弹窗 */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={close}
          />

          {/* 弹窗卡片 */}
          <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 mx-4 text-gray-900">

            {/* 标题栏：标题 + 关闭按钮 */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {mode === 'login' ? '登录' : '注册'}
              </h2>
              {/* 关闭 ✕ */}
              <button
                onClick={close}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tab 切换：登录 / 注册 */}
            <div className="flex border-b border-gray-200 mb-5">
              {(['login', 'register']).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                    m === mode
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-400 border-transparent hover:text-gray-600'
                  }`}
                >
                  {m === 'login' ? '登录' : '注册'}
                </button>
              ))}
            </div>

            {/* 内联提示消息（成功绿色 / 失败红色） */}
            {msg && (
              <div className={`mb-4 px-3 py-2 text-sm rounded-lg ${
                msg.type === 'error'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-green-50 text-green-600'
              }`}>
                {msg.text}
              </div>
            )}

            {/* 表单：用户名 + 密码 + 提交按钮（login/register 共用） */}
            <div className="space-y-4">

              {/* 用户名输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  用户名
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors"
                />
              </div>

              {/* 密码输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  密码
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    transition-colors"
                />
              </div>

              {/* 提交按钮 — 文字随 mode 变化 */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg
                  hover:bg-blue-600 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LoginModal
