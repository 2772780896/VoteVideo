import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, Typography } from 'antd';
import { PlayCircleOutlined, AlignLeftOutlined } from '@ant-design/icons'

const { Text } = Typography
const App = ({post}) => {
  const link = `/post/${post.pid}`
  const video = post.videoList?.[0]
  const picture = post.pictureList?.[0]
  return (
    <Link to={link} style={{ color: 'inherit', textDecoration: 'none' }}>
      <Flex justify="space-between" style={{minWidth:'250px', maxWidth:'450px'}}>
        {video && (
          <div style={{position:'relative', width:'30%'}}>
            <img 
              alt="example"
              src={video.coverUrl}
              style={{ width:'100%', aspectRatio:'16/9' }}>
            </img>
            <div style={{
              position:'absolute',
              right:'0px',
              bottom:'0px'
            }}>{video.duration}</div>
          </div>
        )}
        {picture && <img src={picture} style={{position:'relative', width:'30%', aspectRatio:'16/9'}} />}
        <Flex vertical justify="start" style={{ width:'70%' }}>
          <Text strong>{post.title}</Text>
          <Flex justify="start" gap={'middle'}>
            <span>{post.uploader.userName}</span>
            <span><PlayCircleOutlined />{post.viewCount}</span>
            <span><AlignLeftOutlined />{post.commentCount}</span>
          </Flex>
          <span>{post.date}</span>
        </Flex>
      </Flex>
    </Link>
  )
}
export default App;