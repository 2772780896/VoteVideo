import React, { useState } from 'react';
import { Menu } from 'antd';
import SearchInputApp from '@/components/common/SearchInput'
import LoginModalApp from '@/components/common/LoginModal'

const section = [
  {
    label: (
      <div>
        <a href="search?search=2">
          视频
        </a>
      </div>
    ),
    key: 'video'
  },
  {
    label: (
      <div>
        <a href="search?search=3">
          文章
        </a>
      </div>
    ),
    key: 'essay'
  },
  {
    label: (
      <div>
        <a href="search?search=4">
          动态
        </a>
      </div>
    ),
    key: 'post'
  },
  {
    label: (
      <div>
        <a href="search?search=5">
          用户
        </a>
      </div>
    ),
    key: 'user'
  },
  {
    label: (
      <div>
        <a href="search?search=6">
          标签
        </a>
      </div>
    ),
    key: 'tag'
  }
]
const items = [
  {
    label: (
      <div>
        <a href="main">
          VoteVideo
        </a>
      </div>
    ),
    key: 'icon'
  },
  {
    label: (
      <div>
        <a href="main">
          首页
        </a>
      </div>
    ),
    key: 'main'
  },
  {
    label: (
      <div>
        <a href="search?search=1">
          热门
        </a>
      </div>
    ),
    key: 'hot',
    children:  section
  },
  {
    label: (
      <a href='search'>
        <SearchInputApp /> 
      </a>
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
        <a href="user?search=1">
          消息
        </a>
      </div>
    ),
    key: 'message'
  },
  {
    label: (
      <div>
        <a href="follow">
          关注
        </a>
      </div>
    ),
    key: 'follow'
  },
  {
    label: (
      <div>
        <a href="user?search=3">
          收藏
        </a>
      </div>
    ),
    key: 'favorite'
  },
  {
    label: (
      <div>
        <a href="user?search=4">
          历史
        </a>
      </div>
    ),
    key: 'history'
  },
  {
    label: (
      <div>
        <a href="user?search=5">
          稿件
        </a>
      </div>
    ),
    key: 'post'
  },
  {
    label: (
      <div>
        <a href="upload">
          上传
        </a>
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