import React from 'react';
import { Breadcrumb, Layout, theme, Flex } from 'antd';
import TopMenuApp from '@/components/common/TopMenu'
import SideVideoFlexApp from '@/components/common/SideVideoFlex'
import VideoPlayerApp from '@/components/common/VideoPlayer'
import { Col, Row } from "antd";
import CommentFlexApp from '@/components/common/CommentFlex'
import UploadCardApp from '@/components/common/UploaderCard'

const App = () => {
  return (
    <Row>
      <Col span={24}>    
        <TopMenuApp />
      </Col>
      <Col span={16} offset={1}>
        <h1>标题</h1>
        <Flex justify="start" gap="middle">
          <span>播放量</span>
          <span>弹幕数</span>
          <span>日期</span>
        </Flex>
        <VideoPlayerApp />
        <Flex justify="start" gap="middle">
          <span>点赞</span>
          <span>收藏</span>
          <span>转发</span>
        </Flex>
        <CommentFlexApp />
      </Col>
      <Col span={5} offset={1}>
        <UploadCardApp />
        <SideVideoFlexApp />
      </Col>
    </Row>
  )
}
export default App