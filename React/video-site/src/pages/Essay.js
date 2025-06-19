import React from 'react';
import { useParams } from 'react-router-dom'
import TopMenuApp from '@/components/common/TopMenu'
import { Col, Row, Flex, Avatar } from "antd";
import CommentFlexApp from '@/components/common/DataList/CommentList'
import { UserOutlined } from '@ant-design/icons';
import useData from '@/hooks/useData';
import getEssay from '@/apis/getData/getEssay';

const App = () => {
  const { eid } = useParams()
  const essay = useData(getEssay, eid)?.data
  return (
    <Row>
      <Col span={24}>    
        <TopMenuApp />
      </Col>
      <Col span={16} offset={4}>
        <h1>{essay?.title}</h1>
        <Row>
            <Col span={2}>
                <Avatar size={50} icon={<UserOutlined />} />
            </Col>
            <Col>
                <Flex justify="space-between" gap="middle">
                    <span>{essay?.uploader?.userName}</span>
                    <span>编辑于 {essay?.date}</span>
                </Flex>
            </Col>
        </Row>
        <h3>{essay?.text}</h3>
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