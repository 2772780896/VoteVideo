import UploadCardApp from '@/components/common/UploaderCard'
import React from 'react';
import { Flex, Col, Row } from 'antd';

const App = ({sort}) => {
  const showFocus = (sort) => {
    if (sort === '播放排序') {
      return (
        <Flex wrap gap="middle">
            <Row>
                <Col span={8}>
                <UploadCardApp/>
                </Col>
                <Col span={8}>
                <UploadCardApp/>
                </Col>
                <Col span={8}>
                <UploadCardApp/>
                </Col>
                <Col span={8}>
                <UploadCardApp/>
                </Col>
                <Col span={8}>
                <UploadCardApp/>
                </Col>
                <Col span={8}>
                <UploadCardApp/>
                </Col>
            </Row>
        </Flex>
      )
    } else if (sort === '时间顺序'){
      return (
        <Flex wrap gap="middle">
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
        </Flex>
      )
    } else if (sort === '时间倒序'){
      return (
        <Flex wrap gap="middle">
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
        </Flex>
      )
    } else if (sort === '点赞排序'){
      return (
        <Flex wrap gap="middle">
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
        </Flex>
      )
    } else if (sort === '收藏排序'){
      return (
        <Flex wrap gap="middle">
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
            </Col>
            <Col span={8}>
              <UploadCardApp/>
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