import React from 'react';
import { Card, Flex } from 'antd';
import { Link } from 'react-router-dom';

const App = ({width=250}) => (
  <Card>
    <Flex vertical justify="space-between">
      <div style={{position:'relative'}}>
        <Link to='/vedio'>
            <img 
                alt="example"
                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                style={{ width:`${width}px`, aspectRatio:'16/9'}}>
            </img>
        </Link>
        <Flex  justify="space-between" style={{
            width:`${width}px`,
            position:'absolute',
            bottom:'0px'
            // position实现图片上显示文字
        }}
        >
            <span>播放量 弹幕量</span>
            <span>时长</span>
        </Flex>
      </div>
      <Flex vertical justify="space-between">
        <Link to='/vedio'>
            <span>视频标题</span>
        </Link>
        <Flex justify="space-between">
            <span>up名</span>
            <span>日期</span>
        </Flex>
      </Flex>
    </Flex>
  </Card>
);
export default App;