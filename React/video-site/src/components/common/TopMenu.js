import React, { useState } from 'react';
import { Menu } from 'antd';
import SearchInputApp from '@/components/common/SearchInput'
import LoginModalApp from '@/components/common/LoginModal'
import {Link} from 'react-router-dom'

const section = [
  {
    label: (
      <div>
        <Link to="/search?search=2">
          视频
        </Link>
      </div>
    ),
    key: 'video'
  },
  {
    label: (
      <div>
        <Link to="/search?search=3">
          文章
        </Link>
      </div>
    ),
    key: 'essay'
  },
  {
    label: (
      <div>
        <Link to="/search?search=4">
          动态
        </Link>
      </div>
    ),
    key: 'post'
  },
  {
    label: (
      <div>
        <Link to="/search?search=5">
          用户
        </Link>
      </div>
    ),
    key: 'user'
  },
  {
    label: (
      <div>
        <Link to="/search?search=6">
          标签
        </Link>
      </div>
    ),
    key: 'tag'
  }
]
const items = [
  {
    label: (
      <div>
        <Link to="/main">
          VoteVideo
        </Link>
      </div>
    ),
    key: 'icon'
  },
  {
    label: (
      <div>
        <Link to="/main">
          首页
        </Link>
      </div>
    ),
    key: 'main'
  },
  {
    label: (
      <div>
        <Link to="/search?search=1">
          热门
        </Link>
      </div>
    ),
    key: 'hot',
    children:  section
  },
  {
    label: (
      <Link to='/search'>
        <SearchInputApp /> 
      </Link>
    ),
    key: 'search',
    style:{width: '50%'}
  },
  {
    label: (
      <div>
        <LoginModalApp />
      </div>
    ),
    key: 'login'
  },
  {
    label: (
      <div>
        <Link to="/user?search=1">
          消息
        </Link>
      </div>
    ),
    key: 'message'
  },
  {
    label: (
      <div>
        <Link to="/follow">
          关注
        </Link>
      </div>
    ),
    key: 'follow'
  },
  {
    label: (
      <div>
        <Link to="/user?search=3">
          收藏
        </Link>
      </div>
    ),
    key: 'favorite'
  },
  {
    label: (
      <div>
        <Link to="/user?search=4">
          历史
        </Link>
      </div>
    ),
    key: 'history'
  },
  {
    label: (
      <div>
        <Link to="/user?search=5">
          稿件
        </Link>
      </div>
    ),
    key: 'post'
  },
  {
    label: (
      <div>
        <Link to="/upload">
          上传
        </Link>
      </div>
    ),
    key: 'upload'
  },
];
const App = () => {
  const [current, setCurrent] = useState('');
  const onClick = e => {
    setCurrent(e.key);
  };
  return (
    <Menu 
      onClick={onClick} 
      selectedKeys={[current]} 
      mode="horizontal" 
      items={items} 
      theme="dark" 
      style={{display:'flex', justifyContent:'space-between'}}
    />

  )
};
export default App;