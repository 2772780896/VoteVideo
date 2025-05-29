import React, {useState} from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, message, Space, Flex } from 'antd';

const App = ({pushSort, defaultSort='1'}) => {
  const [sort, setSort] = useState(defaultSort)
  const onClick = ({key}) => {
    setSort(key)
  };
  const items = [
    {
      label: '播放排序',
      key: '1',
    },
    {
      label: '时间顺序',
      key: '2',
    },
    {
      label: '时间倒序',
      key: '3',
    },
    {
      label: '点赞排序',
      key: '4',
    },
    {
      label: '收藏排序',
      key: '5',
    }
  ];
  pushSort(sort)
  return(
    <>
    <Flex justify='end'>
      <Dropdown menu={{ items, onClick }}>
        <a onClick={e => e.preventDefault()}>
          <Space>
            {items.find(i => i.key === sort).label}
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </Flex>
    </>
  )
};
export default App;