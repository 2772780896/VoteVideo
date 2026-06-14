import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const link = `/post/${post.pid}`;
  const video = post.videoList?.[0];
  const picture = post.pictureList?.[0];

  return (
    <Link
      to={link}
      className="block no-underline text-inherit hover:no-underline"
    >
      <div className="flex justify-between" style={{ minWidth: '250px', maxWidth: '450px' }}>
        {video && (
          <div className="relative w-[30%]">
            <img
              alt={post.title}
              src={video.coverUrl}
              className="w-full aspect-video object-cover rounded"
            />
            <div className="absolute right-0 bottom-0 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
              {video.duration}
            </div>
          </div>
        )}
        {picture && (
          <img
            src={picture}
            alt={post.title}
            className="relative w-[30%] aspect-video object-cover rounded"
          />
        )}
        <div className="flex flex-col justify-start w-[70%] pl-3">
          <span className="font-bold text-sm text-gray-900">{post.title}</span>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
            <span>{post.uploader.userName}</span>
            <span className="flex items-center gap-1">▶ {post.viewCount}</span>
            <span className="flex items-center gap-1">💬 {post.commentCount}</span>
          </div>
          <span className="text-xs text-gray-400 mt-1">{post.date}</span>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;