import React from 'react';
import { Card, Flex } from 'antd';

const App = () => (
  <>
    <Flex justify="space-between" style={{flex:'0 1 350px'}}>
      <div style={{width:'30%', minWidth:'150px'}}>
        <img 
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          style={{ width:'100%', aspectRatio:'16/9' }}>
        </img>
      </div>
      <Flex vertical justify="start" style={{width:'70%', minWidth:'200px'}}>
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
  </>
);
export default App;