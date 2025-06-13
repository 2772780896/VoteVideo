import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Pagination } from 'antd';
import VideoCard from '@/components/common/DataCard/VideoCard'
import useData from '@/hooks/useData';
import getVideoList from '@/apis/getDataList/getVideoList';

const App = ({sort, request=getVideoList, params=[]}) => {
  
  // 控制分页
  console.log('sort:',sort)
  const [page, setPage] = useState(1) // 当前页
  const onChange = page => {
    setPage(page)
  };
  
  // 数据获取
  const data = useData(request, sort, page, 16, ...params)
  console.log('videoFlexData:',data)
  const navigate = useNavigate()
  useEffect(() => {
    if (data.code !== 200 && data.code !== undefined) {
      if (typeof window !== 'undefined' && window.alert) { // 仅在浏览器环境且 alert 可用时
        alert('token错误');
      }
      navigate('/main')
    }
  }, [data])

  // 列表映射
  const videoList = useMemo(() => (
    (data.data.length !== 0 && data?.data?.map(i => (
      <VideoCard key={i.vid} video={i} />
    ))
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