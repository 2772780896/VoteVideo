import React, {useState} from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, message, Space, Flex } from 'antd';
import SearchVideoFlexApp from '@/components/feature/SearchVideoFlex'

const App = ({pushSort}) => {
  const [sort, setSort] = useState('播放排序')
  const onClick = ({key}) => {
    setSort(key)
  };
  const items = [
    {
      label: '播放排序',
      key: '播放排序',
    },
    {
      label: '时间顺序',
      key: '时间顺序',
    },
    {
      label: '时间倒序',
      key: '时间倒序',
    },
    {
      label: '点赞排序',
      key: '点赞排序',
    },
    {
      label: '收藏排序',
      key: '收藏排序',
    }
  ];
  pushSort(sort)
  return(
    <>
    <Flex justify='end'>
      <Dropdown menu={{ items, onClick }}>
        <a onClick={e => e.preventDefault()}>
          <Space>
            {sort}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </Flex>
    </>
  )
};
export default App;