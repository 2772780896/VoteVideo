import React from 'react';
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
  const link = `/user/${user?.uid}`;
  return (
    <Link
      to={link}
      className="block no-underline text-inherit hover:no-underline"
    >
      <div className="flex" style={{ minWidth: '250px' }}>
        <div className="w-[20%]">
          <img
            src={user?.profilePictureUrl}
            alt={user?.userName}
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
        </div>
        <div className="w-[80%] pl-3">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-900">{user?.userName}</span>
            <a className="text-xs text-blue-500 hover:text-blue-600">发消息</a>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded">
            +关注 {user?.followerCount}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default UserCard;