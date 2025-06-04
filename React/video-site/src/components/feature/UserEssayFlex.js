import React, { useMemo } from 'react';
import { Flex } from 'antd';
import EssayCard from '@/components/common/EssayCard'

const App = ({essayList}) => {

  // 列表映射
  const dataList = useMemo(() => (
    essayList?.map(i => (
      <EssayCard key={i.vid} essay={i} />
    )
  )), [essayList])

  return (
    <>
    <Flex wrap gap="middle">
      {dataList}
    </Flex>
    </>

  );
};
export default App;