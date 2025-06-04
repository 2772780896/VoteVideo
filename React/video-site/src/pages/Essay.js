import React from 'react';
import { useSearchParams } from 'react-router-dom'
import TopMenuApp from '@/components/common/TopMenu'
import { Col, Row, Flex, Avatar } from "antd";
import CommentFlexApp from '@/components/common/CommentFlex'
import { UserOutlined } from '@ant-design/icons';
import useData from '@/hooks/useData';
import getShowEssay from '@/apis/essay/getShowEssay';

const App = () => {
  const [params] = useSearchParams()
  const eid = params.get('eid')
  const showEssayList = useData(getShowEssay, eid).data
  const showEssay = showEssayList[0]
  return (
    <Row>
      <Col span={24}>    
        <TopMenuApp />
      </Col>
      <Col span={16} offset={4}>
        <h1>{showEssay?.title}</h1>
        <Row>
            <Col span={2}>
                <Avatar size={50} icon={<UserOutlined />} />
            </Col>
            <Col>
                <Flex justify="space-between" gap="middle">
                    <span>{showEssay?.uploader}</span>
                    <span>编辑于 {showEssay?.date}</span>
                </Flex>
            </Col>
        </Row>
        <h3>{showEssay?.text}</h3>
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