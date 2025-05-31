import React from 'react';
import { Flex, Col, Row } from 'antd';
import EssayCardApp from '@/components/feature/EssayCard'

const App = ({sort}) => {
  console.log('Essay')
  const showFocus = (sort) => {
    if (sort === '1') {
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
    } else if (sort === '2'){
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
    } else if (sort === '3'){
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
    } else if (sort === '4'){
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
    } else if (sort === '5'){
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