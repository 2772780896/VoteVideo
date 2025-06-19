import TagCard from '@/components/common/DataCard/TagCard'
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Pagination } from 'antd';
import useData from '@/hooks/useData';
import getTagList from '@/apis/getDataList/getTagList';

const App = ({sort, request=getTagList, params=[]}) => {
  // 控制分页
  console.log('sort:',sort)
  const [page, setPage] = useState(1) // 当前页
  const onChange = page => {
    setPage(page)
  };

  // 数据获取
  const data = useData(request, sort, page, 16, ...params)
  console.log('tagListData:', data)
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