import React from 'react';
import { Flex } from 'antd';
import FocusUploaderCardApp from '@/components/feature/FocusUploaderCard'

const App = () => {
  return (
    <Flex gap="small" vertical>
      <FocusUploaderCardApp />
      <FocusUploaderCardApp />
      <FocusUploaderCardApp />
      <FocusUploaderCardApp type='text' />
    </Flex>
  );
};
export default App;