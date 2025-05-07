import React, { useState } from 'react';
import { Menu } from 'antd';
import SearchInputApp from '@/components/common/SearchInput'
import LoginModalApp from '@/components/common/LoginModal'

const section = [
  {
    label: (
      <div>
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          动漫
        </a>
      </div>
    ),
    key: 'animation'
  },
  {
    label: (
      <div>
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          游戏
        </a>
      </div>
    ),
    key: 'game'
  }
]
const items = [
  {
    label: (
      <div>
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          BL
        </a>
      </div>
    ),
    icons: <span>BL</span>,
    key: 'icon',
  },
  {
    label: (
      <div>
        <a href="main">
          首页
        </a>
      </div>
    ),
    key: 'main',
    children:  section
  },
  {
    label: (
      <div>
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          番剧
        </a>
      </div>
    ),
    key: 'animation',
  },
  {
    label: (
      <div>
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          直播
        </a>
      </div>
    ),
    key: 'living'
  },
  {
    label: (
      <div>
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          游戏中心
        </a>
      </div>
    ),
    key: 'gameCenter'
  },
  {
    label: (
      <div style={{margin:'0px 200px 0px 200px'}}>
        <SearchInputApp /> 
      </div>
    ),
    key: 'search'
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
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          消息
        </a>
      </div>
    ),
    key: 'message'
  },
  {
    label: (
      <div>
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          动态
        </a>
      </div>
    ),
    key: 'focus'
  },
  {
    label: (
      <div>
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          收藏
        </a>
      </div>
    ),
    key: 'favorite'
  },
  {
    label: (
      <div>
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          历史
        </a>
      </div>
    ),
    key: 'history'
  },
  {
    label: (
      <div>
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          稿件
        </a>
      </div>
    ),
    key: 'post'
  },
  {
    label: (
      <div>
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
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
    console.log('click ', e);
    setCurrent(e.key);
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} theme="dark" style={{ flex: 1, minWidth: 0 }}/>
    </div>
  )
};
export default App;