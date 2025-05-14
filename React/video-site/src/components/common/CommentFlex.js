import React from 'react';
import CommentCardApp from '@/components/common/CommentCard'
import {Flex} from 'antd'

const App = ({sort}) => {
  const showFocus = (sort) => {
    if (sort === '播放排序') {
      return (
        <Flex vertical>
            <CommentCardApp />
            <CommentCardApp />
        </Flex>
      )
    } else if (sort === '时间顺序'){
      return (
        <Flex vertical>
            <CommentCardApp />
        </Flex>
      )
    } else if (sort === '时间倒序'){
      return (
        <Flex vertical>
            <CommentCardApp />
        </Flex>
      )
    } else if (sort === '点赞排序'){
      return (
        <Flex vertical>
            <CommentCardApp />
        </Flex>
      )
    } else if (sort === '收藏排序'){
      return (
        <Flex vertical>
            <CommentCardApp />
        </Flex>
      )
    }
  }
  return (
    showFocus(sort)
  );
};
export default App;