import CommentCard from '@/components/common/CommentCard'
import React, { useState, useMemo } from 'react';
import { Flex, Pagination } from 'antd';
import useData from '@/hooks/useData';
import getComment from '@/apis/getComment';

const App = ({sort='1'}) => {
  // 控制分页
  console.log('sort:',sort)
  const [page, setPage] = useState(1) // 当前页
  const onChange = page => {
    setPage(page)
  };
  // 数据获取
  const data = useData(getComment, Number(sort), page, 16)
  console.log('commentdata:', data)

  // 列表映射
  const commentList = useMemo(() => (
    data?.data.map(i => (
      <CommentCard key={i.eid} comment={i} />
    )
  )), [data])

  return (
    <>
    <Flex wrap gap="middle">
      {commentList}
    </Flex>
    <Pagination current={page} onChange={onChange} total={data?.total} pageSize={16} />
    </>

  );
};
export default App;