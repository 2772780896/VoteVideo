import React from 'react';
import { Flex } from 'antd';
import TagCardApp from '@/components/feature/TagCard'


const App = ({sort}) => {
  const showFocus = (sort) => {
    if (sort === '播放排序') {
      return (
        <Flex wrap gap="middle">
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
        </Flex>
      )
    } else if (sort === '时间顺序'){
      return (
        <Flex wrap gap="middle">
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
        </Flex>
      )
    } else if (sort === '时间倒序'){
      return (
        <Flex wrap gap="middle">
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
        </Flex>
      )
    } else if (sort === '点赞排序'){
      return (
        <Flex wrap gap="middle">
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
        </Flex>
      )
    } else if (sort === '收藏排序'){
      return (
        <Flex wrap gap="middle">
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
            <TagCardApp/>
        </Flex>
      )
    }
  }
  return (
    showFocus(sort)
  );
};
export default App;