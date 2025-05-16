import React from 'react';
import { Card, Flex, Row, Col } from 'antd';

const App = () => (
  <Card>
    <Flex justify="space-between">
      <Row>
        <Col xs={16} sm={8} style={{minWidth:'150px'}}>
          <img 
            alt="example"
            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            style={{ width:'100%', aspectRatio:'16/9' }}>
          </img>
        </Col>
        <Col offset={1}>
          <Flex vertical justify="start">
            <span>专栏标题</span>
            <Flex justify="start" gap={'middle'}>
              <span>up名</span>
              <span>查看量</span>
              <span>评论数</span>
            </Flex>
            <div>简介</div>
          </Flex>
        </Col>
      </Row>
    </Flex>
  </Card>
);
export default App;