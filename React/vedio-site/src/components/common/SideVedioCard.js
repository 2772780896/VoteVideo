import React from 'react';
import { Card, Flex } from 'antd';

const App = () => (
  <Card>
    <Flex justify="space-between">
      <img 
        alt="example"
        src="C:\Users\Alisfear\Desktop\实战项目\仿BiliBili视频站\ImitationBL\React\vedio-site\public\favicon.ico">
      </img>
      <Flex vertical justify="space-between">
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