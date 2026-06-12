import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import TopMenuApp from '@/components/common/TopMenu'
import useData from '@/hooks/useData';
import { fetchItem, fetchItemList } from '@/apis/content';
import interact from '@/apis/content';
import DataList from '@/components/common/DataList';
import VideoCard from '@/components/common/DataCard/VideoCard';
import PostCard from '@/components/common/DataCard/PostCard';
import EssayCard from '@/components/common/DataCard/EssayCard';

const tabs = ['视频', '动态', '文章']

const UserPage = () => {
  const { uid } = useParams()
  const navigate = useNavigate()
  const { data: userData, loading, error, refresh } = useData(fetchItem, 'user', uid)
  const user = userData?.data

  const [active, setActive] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)

  const handleFollow = async () => {
    const next = !isFollowing
    try {
      await interact('user', next ? 'follow' : 'unfollow', user.uid)
      setIsFollowing(next)
    } catch { /* 失败不动 */ }
  }

  const handleMessage = () => {
    navigate('/user/profile?tab=message', {
      state: { targetUser: { uid: user.uid, userName: user.userName, profilePictureUrl: user.profilePictureUrl } }
    })
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
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="text-5xl mb-3">⚠</span>
            <span className="text-lg font-medium text-gray-500 mb-1">
              {error?.data?.code === 404 ? '用户不存在' : '用户加载失败'}
            </span>
            {error?.data?.code !== 404 && (
              <button
                onClick={refresh}
                className="mt-3 px-5 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
              >
                重试
              </button>
            )}
          </div>
        )}

        {/* ② 空态 */}
        {!loading && !error && !user && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="text-5xl mb-3">👤</span>
            <span className="text-lg font-medium text-gray-500">用户不存在</span>
          </div>
        )}

        {/* ② 正常态 */}
        {!loading && !error && user && (
          <>
            {/* 用户信息卡 */}
            <div className="flex items-start gap-4 mb-8">
              <img
                src={user.profilePictureUrl}
                alt={user.userName}
                className="w-20 h-20 rounded-full object-cover flex-shrink-0 bg-gray-200"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{user.userName}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                  <span>{user.followerCount?.toLocaleString()} 粉丝</span>
                  <span>{user.followingCount} 关注</span>
                </div>
                {user.info && (
                  <p className="text-sm text-gray-600 mt-2">{user.info}</p>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-2 flex-shrink-0 pt-1">
                <button
                  onClick={handleMessage}
                  className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  💬 对话
                </button>
                <button
                  onClick={handleFollow}
                  className={`px-4 py-1.5 text-sm rounded-full transition-colors cursor-pointer ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isFollowing ? '✓ 已关注' : '+ 关注'}
                </button>
              </div>
            </div>

            {/* ③ Tailwind Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {tabs.map((label, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                    i === active
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Tab 内容区 */}
            <div>
              {/* 视频 Tab */}
              {active === 0 && (
                <DataList
                  request={(sort, page, element) =>
                    fetchItemList('video', { uid: user?.uid, sort, page, element })
                  }
                  sort={null}
                  params={[user?.uid]}
                  pageSize={12}
                  renderItem={(video) => <VideoCard key={video.vid} video={video} />}
                  gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  emptyText="该用户还没有上传视频"
                />
              )}

              {/* 动态 Tab */}
              {active === 1 && (
                <DataList
                  request={(sort, page, element) =>
                    fetchItemList('post', { uid: user?.uid, sort, page, element })
                  }
                  sort={null}
                  params={[user?.uid]}
                  pageSize={10}
                  renderItem={(post) => <PostCard key={post.pid} post={post} />}
                  emptyText="该用户还没有发布动态"
                />
              )}

              {/* 文章 Tab */}
              {active === 2 && (
                <DataList
                  request={(sort, page, element) =>
                    fetchItemList('essay', { uid: user?.uid, sort, page, element })
                  }
                  sort={null}
                  params={[user?.uid]}
                  pageSize={10}
                  renderItem={(essay) => <EssayCard key={essay.eid} essay={essay} />}
                  emptyText="该用户还没有发布文章"
                />
              )}
            </div>
          </>
        )}

      </main>
    </div>
  )
}
export default UserPage
