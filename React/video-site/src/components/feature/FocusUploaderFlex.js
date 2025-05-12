/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Flex } from 'antd';
import FocusUploaderCardApp from '@/components/feature/FocusUploaderCard'

const App = () => {
  return (
    <Flex gap="small" vertical>
      <FocusUploaderCardApp />
      <FocusUploaderCardApp />
      <FocusUploaderCardApp />
    </Flex>
  );
};
export default App;