import React, { useMemo } from 'react';
import { Flex } from 'antd';
import MainVideoCardApp from '@/components/common/DataCard/VideoCard'

const App = ({videoList}) => {

  // 列表映射
  const dataList = useMemo(() => (
    videoList?.map(i => (
      <MainVideoCardApp key={i.vid} video={i} />
    )
  )), [videoList])

  return (
    <>
    <Flex wrap gap="middle">
      {dataList}
    </Flex>
    </>

  );
};
export default App;