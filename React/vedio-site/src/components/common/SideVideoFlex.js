/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Flex, Radio } from 'antd';
import SideVideoCardApp from '@/components/common/SideVideoCard'

const App = () => {
  const [value, setValue] = React.useState('horizontal');
  return (
    <Flex gap="small" vertical>
      <SideVideoCardApp />
      <SideVideoCardApp />
      <SideVideoCardApp />
    </Flex>
  );
};
export default App;