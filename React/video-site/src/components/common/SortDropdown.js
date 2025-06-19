import React, {useState, useEffect} from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, Flex } from 'antd';

const App = ({pushSort, defaultSort='-viewCount', sortList=[
  {label: '浏览排序', key: '-viewCount'},
  {label: '日期排序', key: '-date'},
  {label: '时长排序', key: '-duration'},
  {label: '点赞排序', key: '-likeCount'},
  {label: '收藏排序', key: '-favouriteCount'},
]}) => {
  const [sort, setSort] = useState(defaultSort)

  useEffect(() => {
    pushSort(sort)
  }, [sort, pushSort])

  const onClick = ({key}) => {
    setSort(key)
  };
  return(
    <>
    <Flex justify='end'>
      <Dropdown menu={{ items: sortList, onClick }}>
        <a onClick={e => e.preventDefault()}>
          <Space>
            {sortList.find(i => i.key === sort).label}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </Flex>
    </>
  )
};
export default App;