import React from 'react';
import { Flex, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Text } = Typography
const App = ({post}) => {
  const link = `/video?vid=${post.vid}`
  return (
    <Link to={link} style={{ color: 'inherit', textDecoration: 'none' }}>
      <Flex justify="space-between">
        <div style={{position:'relative', width:'40%', minWidth:'250px'}}>
          <img 
            alt="example"
            src={post.coverUrl}
            style={{ width:'100%', aspectRatio:'16/9' }}>
          </img>
          <div style={{
            position:'absolute',
            right:'0px',
            bottom:'0px'
          }}>
            {post.duration}
          </div>
        </div>
        <Flex vertical justify="space-between" style={{width:'60%'}}>
          <Text strong>{post.title}</Text>
          <Flex justify="space-between">
            <span>{post.viewCount}</span>
            <span>{post.commentCount}</span>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  )
}
export default App;