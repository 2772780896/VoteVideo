import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Pagination } from 'antd';
import EssayCardApp from '@/components/common/DataCard/EssayCard'
import useData from '@/hooks/useData';
import getSearchEssay from '@/apis/search/getSearchEssay';

const App = ({sort='1', func=getSearchEssay, params=[]}) => {
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
  console.log('essayFlexData:',data)

  // 列表映射
  const essayList = useMemo(() => (
    (data.data.length !== 0 && data?.data.map(i => (
      <EssayCardApp key={i.eid} essay={i} />
    ))
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