import React, { useMemo } from 'react';
import { Flex } from 'antd';
import PostCard from '@/components/common/PostCard'

const App = ({postList}) => {

  // 列表映射
  const dataList = useMemo(() => (
    postList?.map(i => (
      <PostCard key={i.vid} post={i} />
    )
  )), [postList])

  return (
    <>
    <Flex wrap gap="middle">
      {dataList}
    </Flex>
    </>

  );
};
export default App;