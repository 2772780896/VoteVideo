import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { login, register } from '@/apis/account'
import Cookies from 'js-cookie'

/* ====================================================================
 * 登录/注册弹窗组件
 *
 * 【组件结构】
 *   ┌─────────────────────────────┐
 *   │  [登录按钮]                  │  ← 导航头入口，点击弹窗
 *   └─────────────────────────────┘
 *            ↓ 点击
 *   ┌─────────────────────────────┐
 *   │  半透明遮罩（点击关闭）       │
 *   │  ┌───────────────────────┐  │
 *   │  │ 登录 / 注册    ✕     │  │  ← 标题 + 关闭
 *   │  │ ───登录──  ─注册──   │  │  ← Tailwind Tab 切换
 *   │  │ [ 用户名 input      ]│  │  ← 共用输入框
 *   │  │ [ 密码 input       ] │  │
 *   │  │ [ 登录 / 注册 按钮  ]│  │  ← 文字随 mode 变化
 *   │  │ ✓ 注册成功 自动登录  │  │  ← 内联提示（绿/红）
 *   │  └───────────────────────┘  │
 *   └─────────────────────────────┘
 *
 * 【数据流】
 *
 *  登录流程：
 *    点击"登录"按钮
 *      → handleSubmit()
 *        → login(username, password)  // POST /api/login
 *          → mock 返回 { data: { token, uid } }
 *            → Object.entries 遍历 → Cookies.set('token', 'abc123')
 *                                    → Cookies.set('uid', 456)
 *              → 显示"登录成功" → 800ms 后 navigate('/user/profile')
 *
 *  注册流程：
 *    点击"注册"按钮
 *      → handleSubmit()
 *        → register(username, password)  // POST /api/register
 *          → mock 创建用户加入 publicState
 *            → 注册成功
 *              → 直接调 login(username, password) 自动登录
 *                → 走上面登录流程的 Cookie 存 + 跳转
 *
 *  关闭弹窗：
 *    点遮罩 / 点 ✕
 *      → close()
 *        → setOpen(false)      // 隐藏弹窗
 *        → resetForm()         // 清空输入 + 清提示
 *
 * 【状态说明】
 *   open     — 弹窗是否可见
 *   mode     — 'login' | 'register'，控制 Tab 高亮和提交逻辑
 *   username — 用户名输入（login/register 共用）
 *   password — 密码输入（login/register 共用）
 *   msg      — { type: 'error'|'success', text: 'xxx' }，内联提示
 *   loading  — 提交中禁用按钮 + 显示"处理中..."
 * ==================================================================== */

const LoginModal = () => {
  // ── 弹窗开关 ──
  const [open, setOpen] = useState(false)

  // ── 当前模式：登录 / 注册 ──
  const [mode, setMode] = useState('login')

  // ── 输入框状态（登录/注册共用） ──
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // ── 内联提示消息 ──
  const [msg, setMsg] = useState(null)

  // ── 提交中防重复点击 ──
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  /* ================================================================
   * handleSubmit — 点击"登录"或"注册"按钮时触发
   *
   * 根据 mode 决定调用 login() 还是 register()
   * 注册成功后自动调 login() 完成登录
   * ================================================================ */
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

        if (res.data.message === 'ok') {
          // mock 返回 { token, uid }，兜底全存进 Cookie
          // 【面试必考】Object.entries 把对象拆成 [key, value] 对
          for (const [key, value] of Object.entries(res.data.data)) {
            Cookies.set(key, value)
          }
          setMsg({ type: 'success', text: '登录成功，正在跳转...' })
          // 延迟 800ms 让用户看到成功提示再跳
          setTimeout(() => {
            setOpen(false)
            resetForm()
            navigate('/user/profile')
          }, 800)
        } else {
          setMsg({ type: 'error', text: '用户名或密码错误' })
        }
      } else {
        // === 注册 ===
        await register(username, password)

        // 注册成功 → 直接调 login() 免去手动切回登录 tab
        const res = await login(username, password)
        if (res.data.message === 'ok') {
          for (const [key, value] of Object.entries(res.data.data)) {
            Cookies.set(key, value)
          }
          setMsg({ type: 'success', text: '注册成功，正在登录...' })
          setTimeout(() => {
            setOpen(false)
            resetForm()
            navigate('/user/profile')
          }, 800)
        }
      }
    } catch {
      // 网络错误或 mock 未匹配
      setMsg({ type: 'error', text: '请求失败，请重试' })
    } finally {
      setLoading(false)
    }
  }

  /* ================================================================
   * close — 关闭弹窗并清空表单
   * 触发点：遮罩点击 / ✕ 按钮
   * ================================================================ */
  const close = () => {
    setOpen(false)
    resetForm()
  }

  /* ================================================================
   * resetForm — 重置输入框和提示消息
   * ================================================================ */
  const resetForm = () => {
    setMsg(null)
    setUsername('')
    setPassword('')
  }

  /* ================================================================
   * switchMode — 点 Tab 切换登录/注册模式，同时清掉旧提示
   * ================================================================ */
  const switchMode = (m) => {
    setMode(m)
    setMsg(null)
  }

  return (
    <>
      {/* ===== 触发按钮：导航头"登录"入口 ===== */}
      {/* 【Tailwind】px-4 py-1.5 水平垂直内边距 | rounded-lg 圆角 | hover: 悬浮变色 */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-1.5 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
      >
        登录
      </button>

      {/* ===== 弹窗主体（open 为 true 时才渲染） ===== */}
      {open && (
        /* 【Tailwind】fixed inset-0 全屏固定 | z-50 最高层 | flex 居中 */
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* 半透明遮罩 — 点空白处关闭弹窗 */}
          {/* 【Tailwind】absolute inset-0 撑满父容器 | bg-black/50 50%透明度黑色 */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={close}
          />

          {/* 弹窗卡片 */}
          {/* 【Tailwind】relative 相对定位（在遮罩之上）| max-w-sm 最大宽度 | rounded-xl 大圆角
              shadow-2xl 重阴影 | mx-4 移动端左右留边距 */}
          <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 mx-4 text-gray-900">

            {/* ── 标题栏：标题 + 关闭按钮 ── */}
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

            {/* ── Tab 切换：登录 / 注册 ── */}
            {/* 【Tailwind】flex 横向排列 | border-b 底部边框 | flex-1 等宽分配 */}
            <div className="flex border-b border-gray-200 mb-5">
              {(['login', 'register']).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  /* border-b-2 底部 2px 线 | border-transparent 透明（未选中时）
                     text-blue-600 border-blue-600 选中态蓝色 */
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

            {/* ── 内联提示消息（成功绿色 / 失败红色） ── */}
            {msg && (
              <div className={`mb-4 px-3 py-2 text-sm rounded-lg ${
                msg.type === 'error'
                  ? 'bg-red-50 text-red-600'
                  : 'bg-green-50 text-green-600'
              }`}>
                {msg.text}
              </div>
            )}

            {/* ── 表单：用户名 + 密码 + 提交按钮（login/register 共用） ── */}
            <div className="space-y-4">

              {/* 用户名输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  用户名
                </label>
                {/* 【Tailwind】w-full 撑满宽度 | border 灰色边框 | focus:ring-2 聚焦蓝色光晕
                    focus:border-transparent 聚焦时隐藏原边框 */}
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

              {/* 提交按钮 — 文字随 mode 变化 */ }
              <button
                onClick={handleSubmit}
                disabled={loading}
                /* disabled:opacity-50 禁用时半透明 */
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
