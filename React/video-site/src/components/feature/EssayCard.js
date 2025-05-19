import React from 'react';
import { Card, Flex, Row, Col } from 'antd';

const App = () => (
  <Card>
    <Flex justify="space-between" style={{flex:'0 1 300px'}}>
      <img 
        alt="example"
        src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        style={{ width:'30%', aspectRatio:'16/9' }}>
      </img>
      <Flex vertical justify="start" style={{ width:'70%' }}>
        <span>专栏标题</span>
        <Flex justify="start" gap={'middle'}>
          <span>up名</span>
          <span>查看量</span>
          <span>评论数</span>
        </Flex>
        <div>简介</div>
      </Flex>
    </Flex>
  </Card>
);
export default App;