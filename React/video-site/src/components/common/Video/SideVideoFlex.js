/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Flex, Radio } from 'antd';
import SideVideoCardApp from '@/components/common/Video/SideVideoCard'

const App = () => {
  const [value, setValue] = React.useState('horizontal');
  return (
    <Flex gap="small" vertical>
      <h2>视频推荐</h2>
      <SideVideoCardApp />
      <SideVideoCardApp />
      <SideVideoCardApp />
    </Flex>
  );
};
export default App;