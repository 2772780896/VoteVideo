import TagCard from '@/components/common/TagCard'
import React, { useState, useMemo } from 'react';
import { Flex, Pagination } from 'antd';
import useData from '@/hooks/useData';
import getSearchTag from '@/apis/search/getSearchTag';

const App = ({sort='1'}) => {
  // 控制分页
  console.log('sort:',sort)
  const [page, setPage] = useState(1) // 当前页
  const onChange = page => {
    setPage(page)
  };
  // 数据获取
  const data = useData(getSearchTag, Number(sort), page, 16)
  console.log('data:', data)

  // 列表映射
  const tagList = useMemo(() => (
    data?.data.map(i => (
      <TagCard key={i?.tid} tag={i} />
    )
  )), [data])

  return (
    <>
    <Flex wrap gap="middle">
      {tagList}
    </Flex>
    <Pagination current={page} onChange={onChange} total={data?.total} pageSize={16} />
    </>

  );
};
export default App;