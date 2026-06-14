import React from 'react';
import { Link } from 'react-router-dom';

const TagCard = ({ tag }) => {
  const link = `/tag/${tag?.tid}`;
  return (
    <Link
      to={link}
      className="block no-underline text-inherit hover:no-underline"
    >
      <div className="flex justify-between" style={{ minWidth: '250px' }}>
        <div className="w-[30%] min-w-[150px]">
          <img
            alt={tag?.tagName}
            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            className="w-full aspect-video object-cover rounded"
          />
        </div>
        <div className="flex flex-col justify-start w-[70%] min-w-[200px] pl-3">
          <span className="font-bold text-sm text-gray-900">{tag?.tagName}</span>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
            <span>👍 {tag?.likeCount}</span>
            <span>⭐ {tag?.favouriteCount}</span>
            <span>💬 {tag?.commentCount}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">高赞评论</div>
        </div>
      </div>
    </Link>
  );
};

export default TagCard;