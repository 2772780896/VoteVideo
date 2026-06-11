import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, Typography } from 'antd';
import { PlayCircleOutlined, AlignLeftOutlined } from '@ant-design/icons'

const { Text } = Typography
const App = ({essay}) => {
  const link = `/essay/${essay.eid}`
  return (
    <Link to={link} style={{ color: 'inherit', textDecoration: 'none' }}>
      <Flex justify="space-between" style={{minWidth:'250px', maxWidth:'450px'}}>
        <img 
          alt="example"
          src={essay.coverUrl}
          style={{ width:'30%', aspectRatio:'16/9' }}>
        </img>
        <Flex vertical justify="start" style={{ width:'70%' }}>
          <Text strong>{essay.title}</Text>
          <Flex justify="start" gap={'middle'}>
            <span>{essay.uploader.userName}</span>
            <span><PlayCircleOutlined />{essay.viewCount}</span>
            <span><AlignLeftOutlined />{essay.commentCount}</span>
          </Flex>
          <span>{essay.date}</span>
        </Flex>
      </Flex>
    </Link>
  )
}
export default App;