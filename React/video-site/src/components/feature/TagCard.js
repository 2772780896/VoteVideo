import React from 'react';
import { Card, Flex } from 'antd';

const App = () => (
  <Card>
    <Flex justify="space-between">
      <div style={{width:'20%'}}>
        <img 
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          style={{ width:'100%', aspectRatio:'16/9' }}>
        </img>
      </div>
      <Flex vertical justify="start" style={{width:'80%'}}>
        <a href='tag'>
            <span>标签名</span>
        </a>
        <Flex justify="start" gap={'middle'}>
          <span>点赞数</span>
          <span>关注数</span>
          <span>评论数</span>
        </Flex>
        <div>高赞评论</div>
      </Flex>
    </Flex>
  </Card>
);
export default App;