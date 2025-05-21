import React from 'react';
import { Flex } from 'antd';
import FocusUploaderCardApp from '@/components/feature/FollowUploader/FollowUploaderCard'

const App = ({sort}) => {
  const showFocus = (sort) => {
    if (sort === '播放排序') {
      return (
        <Flex wrap gap="middle">
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
        </Flex>
      )
    } else if (sort === '时间顺序'){
      return (
        <Flex wrap gap="middle">
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
        </Flex>
      )
    } else if (sort === '时间倒序'){
      return (
        <Flex wrap gap="middle">
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
        </Flex>
      )
    } else if (sort === '点赞排序'){
      return (
        <Flex wrap gap="middle">
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
        </Flex>
      )
    } else if (sort === '收藏排序'){
      return (
        <Flex wrap gap="middle">
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
            <FocusUploaderCardApp/>
        </Flex>
      )
    }
  }
  return (
    showFocus(sort)
  );
};
export default App;