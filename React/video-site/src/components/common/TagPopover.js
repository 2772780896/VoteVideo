import React from 'react';
import { Button, Popover, Flex } from 'antd';
import TagCard from '@/components/feature/TagCard'
const content = (
  <div style={{width:'250px'}}>
    <TagCard />
    <Flex justify='start' gap='middle'>
        <span>点赞</span>
        <span>点踩</span>
    </Flex>
  </div>
);
const App = () => (
    <Popover content={content} trigger="click">
        <Button>标签名</Button>
    </Popover>
);
export default App;