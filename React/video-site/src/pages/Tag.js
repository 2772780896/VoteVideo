import React, {useState} from 'react';
import { useParams } from 'react-router-dom'
import TopMenuApp from '@/components/common/TopMenu'
import { Col, Row, Flex, Avatar } from "antd";
import CommentFlexApp from '@/components/common/DataList/CommentList'
import useData from '@/hooks/useData';
import getTag from '@/apis/getData/getTag';

const App = () => {
  const {tid} = useParams()
  console.log('TagTid:', tid)
  const tag = useData(getTag, tid)?.data
  console.log('tagData:', tag)

  return (
    <Row>
      <Col span={24}>    
        <TopMenuApp />
      </Col>
      <Col span={16} offset={4}>
        <h1>{tag?.tagName}</h1>
        <CommentFlexApp sort={'1'} />
      </Col>
    </Row>
  )
}
export default App