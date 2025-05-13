import React from 'react';
import { Flex, Col, Row } from 'antd';
import EssayCardApp from '@/components/feature/EssayCard'

const App = ({sort}) => {
  const showFocus = (sort) => {
    if (sort === '播放排序') {
      return (
        <Flex wrap gap="middle">
          <Row>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
          </Row>
        </Flex>
      )
    } else if (sort === '时间顺序'){
      return (
        <Flex wrap gap="middle">
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
        </Flex>
      )
    } else if (sort === '时间倒序'){
      return (
        <Flex wrap gap="middle">
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
        </Flex>
      )
    } else if (sort === '点赞排序'){
      return (
        <Flex wrap gap="middle">
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
        </Flex>
      )
    } else if (sort === '收藏排序'){
      return (
        <Flex wrap gap="middle">
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
            <Col span={12}>
              <EssayCardApp/>
            </Col>
        </Flex>
      )
    }
  }
  return (
    showFocus(sort)
  );
};
export default App;