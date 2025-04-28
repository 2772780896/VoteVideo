import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import MenuApp from '@/components/common/Menu'
const items = [
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

const { Header, Content, Footer, Sider } = Layout;
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,
    children: Array.from({ length: 4 }).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});
const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Header>
        <MenuApp />
      </Header>
      <div style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Layout
          style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG }}
        >
          <Sider style={{ background: colorBgContainer }} width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{ height: '100%' }}
              items={items2}
            />
          </Sider>
          <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content>
        </Layout>
      </div>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};
export default App;