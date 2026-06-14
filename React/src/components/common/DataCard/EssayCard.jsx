import React from 'react';
import { Link } from 'react-router-dom';

const EssayCard = ({ essay }) => {
  const link = `/essay/${essay.eid}`;
  return (
    <Link
      to={link}
      className="block no-underline text-inherit hover:no-underline"
    >
      <div className="flex justify-between" style={{ minWidth: '250px', maxWidth: '450px' }}>
        <img
          alt={essay.title}
          src={essay.coverUrl}
          className="w-[30%] aspect-video object-cover rounded"
        />
        <div className="flex flex-col justify-start w-[70%] pl-3">
          <span className="font-bold text-sm text-gray-900">{essay.title}</span>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
            <span>{essay.uploader.userName}</span>
            <span className="flex items-center gap-1">▶ {essay.viewCount}</span>
            <span className="flex items-center gap-1">💬 {essay.commentCount}</span>
          </div>
          <span className="text-xs text-gray-400 mt-1">{essay.date}</span>
        </div>
      </div>
    </Link>
  );
};

export default EssayCard;