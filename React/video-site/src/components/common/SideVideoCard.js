import React from 'react';
import { Card, Flex } from 'antd';

const App = () => (
  <Card>
    <Flex justify="space-between">
      <div style={{position:'relative', width:'70%'}}>
        <img 
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          style={{ width:'100%', aspectRatio:'16/9' }}>
        </img>
        <div style={{
          position:'absolute',
          right:'0px',
          bottom:'0px'
        }}>
          时长
        </div>
      </div>
      <Flex vertical justify="start" style={{width:'30%'}}>
        <span>视频标题</span>
        <span>up名</span>
        <Flex justify="space-between">
          <span>播放量</span>
          <span>弹幕量</span>
        </Flex>
      </Flex>
    </Flex>
  </Card>
);
export default App;