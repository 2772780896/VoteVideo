import React, { useState } from 'react';
import interact from '@/apis/content';

/**
 * 上传者卡片：自身管理关注状态
 */
const App = ({ playVideo }) => {
  const uploader = playVideo?.uploader;
  const uid = uploader?.uid;

  // ===== 关注状态（自身持有） =====
  const [isFollowing, setIsFollowing] = useState(uploader?.isFollowing ?? false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    if (!uid || isLoading) return;
    const prev = isFollowing;
    setIsFollowing(!prev);
    setIsLoading(true);
    try {
      if (prev) {
        await interact('user', 'unfollow', uid);
      } else {
        await interact('user', 'follow', uid);
      }
    } catch {
      setIsFollowing(prev);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
      {/* 头像 */}
      <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
        {uploader?.profilePictureUrl ? (
          <img
            src={uploader.profilePictureUrl}
            alt={uploader.userName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
            👤
          </div>
        )}
      </div>

      {/* 用户信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="font-medium text-gray-900 truncate">
            {uploader?.userName ?? '未登录'}
          </span>
          <a className="text-sm text-blue-500 hover:text-blue-600 whitespace-nowrap">
            发消息
          </a>
        </div>
        <button
          onClick={handleFollow}
          disabled={isLoading}
          className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${
            isFollowing
              ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              : 'text-white bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isFollowing ? '已关注' : '+ 关注'}
        </button>
      </div>
    </div>
  );
};

export default App;
