import TopMenuApp from "@/components/common/TopMenu";
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import React, { useEffect } from 'react';
import ProfileTabContent from '@/components/feature/Profile/ProfileTabContent'
import ProfileFollow from '@/components/feature/Profile/ProfileFollow'
import ProfileMessage from '@/components/feature/Profile/ProfileMessage'
import { getMyProfile } from '@/apis/account'
import useData from "@/hooks/useData";

/**
 * 【面试必考】URL 驱动的 Tab 通信模式
 *
 * 通信链路（外部 → Profile 页）：
 *   导航头点击"稿件"
 *     → navigate('/user/profile?tab=upload')
 *       → useSearchParams() 读到 tab=upload
 *         → activeKey='upload' → Tab 高亮 + ProfileUpload 渲染
 *
 * 通信链路（内部 Tab 切换）：
 *   用户点"收藏"
 *     → handleTab('favourite')
 *       → navigate('/user/profile?tab=favourite')
 *         → URL 变化 → useSearchParams 返回新值
 *           → activeKey='favourite' → 切换内容
 *
 * 为什么用 URL 而非 useState？
 *   - 外部页面（导航头）可以直接通过 URL 指定要打开的 Tab
 *   - 浏览器前进/后退支持 Tab 间切换
 *   - 两个组件无需互相引用（松耦合，只通过 URL 约定通信）
 */
const tabs = [
  { key: 'uploads',    label: '稿件' },
  { key: 'favourites', label: '收藏' },
  { key: 'history',    label: '历史' },
  { key: 'follow',     label: '关注' },
  { key: 'message',    label: '消息' },
]

const ProfilePage = () => {
  const { data: profileData, loading, error, refresh } = useData(getMyProfile)
  const profile = profileData

  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const activeKey = searchParams.get('tab') || 'uploads'

  // 外部私信传入的目标用户（来自 ProfileFollow / User 页的私信按钮）
  const targetUser = location.state?.targetUser

  // 未登录跳转
  useEffect(() => {
    if (!loading && (error?.data?.code === 401)) {
      navigate('/main')
    }
  }, [loading, error, navigate])

  const handleTab = (key) => {
    navigate(`/user/profile?tab=${key}`)
  }

  return (
    <div className="min-h-screen bg-white">

      <TopMenuApp />

      <main className="max-w-4xl mx-auto px-4 py-6">

        {/* ② 加载态 */}
        {loading && (
          <div className="animate-pulse">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0" />
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-48" />
              </div>
            </div>
          </div>
        )}

        {/* ② 错误态 */}
        {!loading && error && error?.data?.code !== 401 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="text-5xl mb-3">⚠</span>
            <span className="text-lg font-medium text-gray-500 mb-1">个人中心加载失败</span>
            <button
              onClick={refresh}
              className="mt-3 px-5 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
            >
              重试
            </button>
          </div>
        )}

        {/* ② 正常态 */}
        {!loading && !error && profile && (
          <>
            {/* 用户信息卡 */}
            <div className="flex items-start gap-4 mb-8">
              <img
                src={profile.profilePictureUrl}
                alt={profile.userName}
                className="w-14 h-14 rounded-full object-cover flex-shrink-0 bg-gray-200"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-gray-900">{profile.userName}</span>
                  <span className="text-sm text-gray-500">{profile.date}</span>
                </div>
                {profile.info && (
                  <p className="text-sm text-gray-600">{profile.info}</p>
                )}
              </div>
            </div>

            {/* ③ Tailwind Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {tabs.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleTab(key)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                    key === activeKey
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 稿件/收藏/历史：合并为一个组件，profileType 驱动 */}
            {activeKey !== 'follow' && activeKey !== 'message' && (
              <ProfileTabContent profileType={activeKey} />
            )}
            {/* 关注：独立组件（列表项是用户而非视频/动态/文章） */}
            {activeKey === 'follow' && <ProfileFollow />}
            {/* 消息：原始 antd 组件（后续重构） */}
            {activeKey === 'message' && <ProfileMessage targetUser={targetUser} />}
          </>
        )}

      </main>
    </div>
  )
}
export default ProfilePage
