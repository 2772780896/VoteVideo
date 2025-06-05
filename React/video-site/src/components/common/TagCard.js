import React from 'react';
import { Flex, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Text } = Typography
const App = ({tag}) => {
  const link = `/tag?tid=${tag?.tid}`
  return (
    <Link to={link} style={{ color: 'inherit', textDecoration: 'none' }}>
      <Flex justify="space-between" style={{minWidth:'250px'}}>
        <div style={{width:'30%', minWidth:'150px'}}>
          <img 
            alt="example"
            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            style={{ width:'100%', aspectRatio:'16/9' }}>
          </img>
        </div>
        <Flex vertical justify="start" style={{width:'70%', minWidth:'200px'}}>
          <Text strong>{tag?.tagName}</Text>
          <Flex justify="start" gap={'middle'}>
            <span>{tag?.likeCount}</span>
            <span>{tag?.favouriteCount}</span>
            <span>{tag?.commentCount}</span>
          </Flex>
          <div>高赞评论</div>
        </Flex>
      </Flex>
    </Link>
  )
}
export default App;