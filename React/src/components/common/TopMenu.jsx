import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LoginModalApp from '@/components/common/LoginModal'
import UserMenu from '@/components/common/UserMenu'
import Cookies from 'js-cookie'

const navLinks = [
  { to: '/',    label: '首页' },
  { to: '/',    label: '视频' },
  { to: '/',    label: '文章' },
  { to: '/',    label: '动态' },
  { to: '/',    label: '标签' },
]

const App = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')

  const handleSearch = () => {
    const q = keyword.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}&tab=videos`)
    else navigate('/search')
    setKeyword('')
  }

  // 根据 Cookie 中的 token 判断登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('token'))

  // 登录成功回调
  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* 左侧：Logo + 导航链接 */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/" className="text-lg font-bold tracking-wide hover:text-blue-400 transition-colors">
            VoteVideo
          </Link>

          {/* 导航链接 */}
          {navLinks.map(({ to, label }) => (
            <Link
              key={label}
              to={to}
              className={`text-sm transition-colors hover:text-blue-400 ${
                pathname === to && to !== '/' ? 'text-blue-400' : 'text-gray-300'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* 右侧：搜索 + 登录/用户菜单 */}
        <div className="flex items-center gap-3">
          {/* 搜索输入框 — 手输回车跳转 Search 页 */}
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="搜索"
            className="w-40 px-3 py-1.5 text-sm bg-gray-800 border border-gray-700 rounded-md
              text-gray-200 placeholder-gray-500
              focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          {/* 根据登录状态显示不同内容 */}
          {isLoggedIn ? <UserMenu /> : <LoginModalApp onLoginSuccess={handleLoginSuccess} />}
        </div>
      </div>
    </nav>
  )
};

export default App;
