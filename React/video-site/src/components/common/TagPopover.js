import React from 'react';
import { Button, Popover, Flex } from 'antd';
import TagCard from '@/components/common/DataCard/TagCard'

const App = ({tag}) => {
  const content = (
    <div style={{width:'300px'}}>
      <TagCard tag={tag}/>
      <Flex justify='start' gap='middle'>
          <span>点赞</span>
          <span>点踩</span>
      </Flex>
    </div>
  );
  return(
    <Popover content={content} trigger="click">
        <Button>{tag.tagName}</Button>
    </Popover>
  )
}
export default App;