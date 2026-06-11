import React, { useState } from 'react';
import interact from '@/apis/content';

/**
 * 评论卡片：自身管理点赞/点踩状态，不污染父组件
 * 每个卡片独立状态，操作只重渲染自己
 */
const App = ({ comment, depth = 0, maxDepth = 2 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // ===== 点赞/点踩状态（自身持有） =====
  const [isLiked, setIsLiked] = useState(comment.isLiked ?? false);
  const [likeCount, setLikeCount] = useState(comment.likeCount ?? 0);
  const [isDisliked, setIsDisliked] = useState(comment.isDisliked ?? false);

  // 点赞
  const handleLike = async () => {
    const prev = isLiked
    const prevCount = likeCount
    setIsLiked(!prev)
    setLikeCount(prev ? prevCount - 1 : prevCount + 1)
    try {
      if (prev) {
        await interact('comment', 'unlike', comment.cid)
      } else {
        await interact('comment', 'like', comment.cid)
      }
    } catch {
      setIsLiked(prev)
      setLikeCount(prevCount)
    }
  }

  // 点踩
  const handleDislike = async () => {
    const prev = isDisliked
    setIsDisliked(!prev)
    try {
      if (prev) {
        await interact('comment', 'undislike', comment.cid)
      } else {
        await interact('comment', 'dislike', comment.cid)
      }
    } catch {
      setIsDisliked(prev)
    }
  }

  const hasSubComments = comment.subCommentCount > 0 && comment.subCommentList?.length > 0;
  const canExpand = depth < maxDepth && hasSubComments;

  return (
    <div id={`comment-${comment.cid}`} className={`border-l-2 border-gray-300 pl-4 py-3 ${depth > 0 ? 'ml-4 mt-2' : ''}`}>
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        {comment.replyTo && (
          <span className="text-xs text-gray-400 flex-shrink-0">
            回复 <span className="text-blue-500">@{comment.replyTo.userName}</span>
          </span>
        )}
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
          <img
            src={comment.uploader.profilePictureUrl}
            alt={comment.uploader.userName}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-semibold text-gray-900 text-sm">
          {comment.uploader.userName}
        </span>
      </div>

      {comment.type === 'picture' && comment.pictureList?.length > 0 && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {comment.pictureList.map((imgUrl, idx) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`comment-img-${idx}`}
              className="w-[75px] aspect-video object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      <div className="text-gray-700 text-sm mb-2">
        {comment.text}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
        <span>{comment.date}</span>
        <button
          onClick={handleLike}
          className={`transition-colors cursor-pointer ${
            isLiked ? 'text-blue-500' : 'hover:text-blue-500'
          }`}
        >
          👍 {likeCount}
        </button>
        <button
          onClick={handleDislike}
          className={`transition-colors cursor-pointer ${
            isDisliked ? 'text-red-400' : 'hover:text-gray-700'
          }`}
        >
          👎 点踩
        </button>
        <button
          onClick={() => console.log('回复:', comment.cid)}
          className="hover:text-gray-700 transition-colors cursor-pointer"
        >
          💬 回复
        </button>
      </div>

      {canExpand && (
        <div>
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="text-xs text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            {isExpanded ? '▲ 收起' : `▼ 查看${comment.subCommentCount}条回复`}
          </button>

          {isExpanded && (
            <div>
              {comment.subCommentList.map(subComment => (
                <App
                  key={subComment.cid}
                  comment={subComment}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {depth >= maxDepth && hasSubComments && (
        <div className="text-xs text-gray-400 italic">
          还有 {comment.subCommentCount} 条回复
        </div>
      )}
    </div>
  );
};

export default App;
