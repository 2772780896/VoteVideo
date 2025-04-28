/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Flex, Radio } from 'antd';
import SideVedioCardApp from '@/components/common/SideVedioCard'

const App = () => {
  const [value, setValue] = React.useState('horizontal');
  return (
    <Flex gap="middle" vertical>
      <SideVedioCardApp />
      <SideVedioCardApp />
      <SideVedioCardApp />
    </Flex>
  );
};
export default App;