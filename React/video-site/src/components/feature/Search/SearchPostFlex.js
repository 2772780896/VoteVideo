import React, { useState, useMemo } from 'react';
import { Flex, Pagination } from 'antd';
import useData from '@/hooks/useData';
import getSearchPost from '@/apis/search/getSearchPost';
import PostCard from '@/components/common/PostCard'


const App = ({sort='1'}) => {
  // 控制分页
  console.log('sort:',sort)
  const [page, setPage] = useState(1) // 当前页
  const onChange = page => {
    setPage(page)
  };
  // 数据获取
  const data = useData(getSearchPost, Number(sort), page, 16)

  // 列表映射
  const postList = useMemo(() => (
    data?.data.map(i => (
      <PostCard key={i.pid} post={i} />
    )
  )), [data])

  return (
    <>
    <Flex wrap gap="middle">
      {postList}
    </Flex>
    <Pagination current={page} onChange={onChange} total={data?.total} pageSize={16} />
    </>

  );
};
export default App;