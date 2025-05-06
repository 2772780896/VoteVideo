/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Flex, Radio } from 'antd';
import MainVideoCardApp from '@/components/common/MainVideoCard'

const App = () => {
  const [value, setValue] = React.useState('horizontal');
  return (
    <Flex wrap gap="middle">
      <MainVideoCardApp />
      <MainVideoCardApp />
      <MainVideoCardApp />
      <MainVideoCardApp />
      <MainVideoCardApp />
      <MainVideoCardApp />
    </Flex>
  );
};
export default App;