import React from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import TopMenuApp from '@/components/common/TopMenu'
import SideVedioFlexApp from '@/components/common/SideVedioFlex'

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
        <TopMenuApp />
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
          <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content>
          <Sider style={{ background: colorBgContainer }} width={200}>
            <SideVedioFlexApp />
          </Sider>
        </Layout>
      </div>
      <Footer style={{ textAlign: 'center' }}>
        已展示所有评论
      </Footer>
    </Layout>
  );
};
export default App;