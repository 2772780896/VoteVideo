import React, { useState, useMemo } from 'react';
import { Flex, Pagination } from 'antd';
import EssayCardApp from '@/components/common/EssayCard'
import useData from '@/hooks/useData';
import getSearchEssay from '@/apis/search/getSearchEssay';

const App = ({sort='1'}) => {
  // 控制分页
  console.log('sort:',sort)
  const [page, setPage] = useState(1) // 当前页
  const onChange = page => {
    setPage(page)
  };
  // 数据获取
  const data = useData(getSearchEssay, Number(sort), page, 16)
  console.log('data:', data)

  // 列表映射
  const essayList = useMemo(() => (
    data?.data.map(i => (
      <EssayCardApp key={i.eid} essay={i} />
    )
  )), [data])

  return (
    <>
    <Flex wrap gap="middle">
      {essayList}
    </Flex>
    <Pagination current={page} onChange={onChange} total={data?.total} pageSize={16} />
    </>

  );
};
export default App;