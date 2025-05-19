import React from 'react';
import { Flex } from 'antd';
import MainVideoCardApp from '@/components/common/MainVideoCard'

const App = ({sort}) => {
  const showVideo = (sort) => {
    if (sort === '播放排序') {
      return (
        <Flex wrap gap="middle">
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
        </Flex>
      )
    } else if (sort === '时间顺序'){
      return (
        <Flex wrap gap="middle">
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
        </Flex>
      )
    } else if (sort === '时间倒序'){
      return (
        <Flex wrap gap="middle">
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
        </Flex>
      )
    } else if (sort === '点赞排序'){
      return (
        <Flex wrap gap="middle">
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
        </Flex>
      )
    } else if (sort === '收藏排序'){
      return (
        <Flex wrap gap="middle">
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
            <MainVideoCardApp width={175}/>
        </Flex>
      )
    }
  }
  return (
    showVideo(sort)
  );
};
export default App;
