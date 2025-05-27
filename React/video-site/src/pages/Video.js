import React, {useState} from 'react';
import { useSearchParams } from 'react-router-dom'
import { Breadcrumb, Layout, theme, Flex } from 'antd';
import TopMenuApp from '@/components/common/TopMenu'
import SideVideoFlexApp from '@/components/common/SideVideoFlex'
import VideoPlayerApp from '@/components/common/VideoPlayer'
import { Col, Row } from "antd";
import CommentFlexApp from '@/components/common/CommentFlex'
import UploadCardApp from '@/components/common/UploaderCard'
import TagFlex from '@/components/common/TagRow'
import useData from '@/hooks/useData';
import getPlayVideo from '@/apis/video/getPlayVideo';

const App = () => {
  const [params] = useSearchParams()
  const vid = params.get('vid')
  const playVideoList = useData(getPlayVideo, vid)
  const playVideo = playVideoList[0]
  return (
    <Row>
      <Col span={24}>    
        <TopMenuApp />
      </Col>
      <Col span={16} offset={1}>
        <h1>{playVideo?.title}</h1>
        <Flex justify="start" gap="middle">
          <span>{playVideo?.viewCount}</span>
          <span>{playVideo?.messageCount}</span>
          <span>{playVideo?.date}</span>
        </Flex>
        <VideoPlayerApp playVideo={playVideo} />
        <TagFlex />
        <Flex justify="start" gap="middle">
          <span>点赞</span>
          <span>收藏</span>
          <span>转发</span>
        </Flex>
        <CommentFlexApp />
      </Col>
      <Col span={5} offset={1}>
        <UploadCardApp playVideo={playVideo} />
        <SideVideoFlexApp />
      </Col>
    </Row>
  )
}
export default App