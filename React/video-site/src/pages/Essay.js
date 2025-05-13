import React from 'react';
import TopMenuApp from '@/components/common/TopMenu'
import { Col, Row, Flex, Avatar } from "antd";
import CommentFlexApp from '@/components/common/CommentFlex'
import { UserOutlined } from '@ant-design/icons';

const App = () => {
  return (
    <Row>
      <Col span={24}>    
        <TopMenuApp />
      </Col>
      <Col span={16} offset={4}>
        <h1>标题</h1>
        <Row>
            <Col span={2}>
                <Avatar size={50} icon={<UserOutlined />} />
            </Col>
            <Col>
                <Flex justify="space-between" gap="middle">
                    <span>用户名</span>
                    <span>编辑于 日期</span>
                </Flex>
            </Col>
        </Row>
        <h3>内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容</h3>
        <Flex justify="start" gap="middle">
          <span>点赞</span>
          <span>收藏</span>
          <span>转发</span>
        </Flex>
        <CommentFlexApp />
      </Col>
    </Row>
  )
}
export default App