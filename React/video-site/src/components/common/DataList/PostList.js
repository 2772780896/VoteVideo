import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Pagination } from 'antd';
import useData from '@/hooks/useData';
import getPostList from '@/apis/getDataList/getPostList';
import PostCard from '@/components/common/DataCard/PostCard'


const App = ({sort='+title', func=getPostList, params=[]}) => {
  
  // 控制分页
  console.log('sort:',sort)
  const [page, setPage] = useState(1) // 当前页
  const onChange = page => {
    setPage(page)
  };
  
  // 数据获取
  const data = useData(func, sort, page, 16, ...params)
  const navigate = useNavigate()
  useEffect(() => {
    if (data.code === 401) {
      if (typeof window !== 'undefined' && window.alert) { // 仅在浏览器环境且 alert 可用时
        alert('token错误');
      }
      navigate('/main')
    }
  }, [data])
  console.log('postFlexData:',data)

  // 列表映射
  const postList = useMemo(() => (
    (data.data.length !== 0 && data?.data.map(i => (
      <PostCard key={i.pid} post={i} />
    ))
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