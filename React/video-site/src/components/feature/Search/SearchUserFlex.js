import UserCard from '@/components/common/UserCard'
import React, { useState, useMemo } from 'react';
import { Flex, Pagination } from 'antd';
import useData from '@/hooks/useData';
import getSearchUser from '@/apis/search/getSearchUser';

const App = ({sort}) => {
  // 控制分页
  console.log('sort:',sort)
  const [page, setPage] = useState(1) // 当前页
  const onChange = page => {
    setPage(page)
  };
  // 数据获取
  const data = useData(getSearchUser, Number(sort), page, 16)

  // 列表映射
  const userList = useMemo(() => (
    data?.data.map(i => (
      <UserCard key={i.vid} user={i}/>
    )
  )), [data])

  return (
    <>
    <Flex wrap gap="middle">
      {userList}
    </Flex>
    <Pagination current={page} onChange={onChange} total={data?.total} pageSize={16} />
    </>

  );
};
export default App;