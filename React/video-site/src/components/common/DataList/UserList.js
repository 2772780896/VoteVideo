import UserCard from '@/components/common/DataCard/UserCard'
import React, { useState, useMemo, useEffect } from 'react';
import { Flex, Pagination } from 'antd';
import useData from '@/hooks/useData';
import getUserList from '@/apis/getDataList/getUserList';
import { useNavigate } from 'react-router-dom';

const App = ({sort, request=getUserList, params=[]}) => {
  // 控制分页
  console.log('sort:',sort)
  const [page, setPage] = useState(1) // 当前页
  const onChange = page => {
    setPage(page)
  };
  // 数据获取
  const data = useData(request, sort, page, 16, ...params)
  console.log('userListData:',data)
  const navigate = useNavigate()
  useEffect(() => {
    if (data.code !== 200 && data.code !== undefined) {
      if (typeof window !== 'undefined' && window.alert) { // 仅在浏览器环境且 alert 可用时
        alert(data.message);
      }
      navigate('/main')
    }
  }, [data])


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