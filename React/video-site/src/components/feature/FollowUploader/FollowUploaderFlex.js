import React from 'react';
import { Flex } from 'antd';
import FocusUploaderCardApp from '@/components/feature/FollowUploader/FollowUploaderCard'

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