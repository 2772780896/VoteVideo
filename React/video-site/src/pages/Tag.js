import React, {useState} from 'react';
import { useSearchParams } from 'react-router-dom'
import TopMenuApp from '@/components/common/TopMenu'
import { Col, Row, Flex, Avatar } from "antd";
import CommentFlexApp from '@/components/common/CommentFlex'
import useData from '@/hooks/useData';
import getShowTag from '@/apis/tag/getShowTag';

const App = () => {
  const [params] = useSearchParams()
  const tid = params.get('tid')
  console.log('TagTid:', tid)
  const showTagList = useData(getShowTag, tid).data
  const showTag = showTagList[0]
  return (
    <Row>
      <Col span={24}>    
        <TopMenuApp />
      </Col>
      <Col span={16} offset={4}>
        <h1>{showTag?.tagName}</h1>
        <CommentFlexApp sort={'1'} />
      </Col>
    </Row>
  )
}
export default App