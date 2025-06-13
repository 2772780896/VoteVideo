/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Flex } from 'antd';
import MainVideoCardApp from '@/components/common/DataCard/VideoCard'

const App = ({videoList}) => {
  const videoCardList = videoList.map((i) => (
    <MainVideoCardApp video={i}/>
  ))
  return (
    <Flex wrap gap="middle" style={{width:'100%'}}>
      {videoCardList}
    </Flex>
  );
};
export default App;