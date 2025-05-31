import React, { useState, useEffect, useMemo } from 'react';
import { Flex, Pagination } from 'antd';
import MainVideoCardApp from '@/components/common/MainVideoCard'
import useData from '@/hooks/useData';
import getSearchVideo from '@/apis/search/getSearchVideo';

const App = ({sort}) => {
  // 控制分页
  console.log('sort:',sort)
  const [page, setPage] = useState(1) // 当前页
  const onChange = page => {
    setPage(page)
  };
  // 数据获取
  const data = useData(getSearchVideo, Number(sort), page, 16)

  // 列表映射
  const videoList = useMemo(() => (
    data?.data.map(i => (
      <MainVideoCardApp key={i.vid} video={i} />
    )
  )), [data])

  return (
    <>
    <Flex wrap gap="middle">
      {videoList}
    </Flex>
    <Pagination current={page} onChange={onChange} total={data?.total} pageSize={16} />
    </>

  );
};
export default App;