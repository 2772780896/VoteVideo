import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, Typography } from 'antd';
import { PlayCircleOutlined, AlignLeftOutlined } from '@ant-design/icons'

const { Text } = Typography
const App = ({video}) => {
  const link = `/video?vid=${video.vid}`
  return (
    <Link to={link} style={{ color: 'inherit', textDecoration: 'none' }}>
      <Flex vertical justify="space-between">
        <div style={{position:'relative'}}>
            <img 
                src={video.coverUrl}
                style={{ width:`300px`, aspectRatio:'16/9'}}>
            </img>
          <Flex  justify="space-between" style={{
              width:`300px`,
              position:'absolute',
              bottom:'0px'
              // position实现图片上显示文字
          }}
          >
              <Flex justify='start' gap='small'>
                <span>
                  <PlayCircleOutlined />{video.viewCount}
                </span>
                <span>
                  <AlignLeftOutlined />{video.messageCount}
                </span>
              </Flex>
              <span>{video.duration}</span>
          </Flex>
        </div>
        <Flex vertical justify="space-between">
          <Text strong>{video.title}</Text>
          <Flex justify="space-between">
              <span>{video.uploader.userName}</span>
              <span>{video.date}</span>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  )
}
export default App;