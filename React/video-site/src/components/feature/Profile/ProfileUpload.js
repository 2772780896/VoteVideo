import React, {useState} from 'react';
import { Tabs } from 'antd'
import SortDropdown from '@/components/common/SortDropdown'
import VideoList from '@/components/common/DataList/VideoList'
import PostList from '@/components/common/DataList/PostList'
import EssayList from '@/components/common/DataList/EssayList'
import getProfileSubdata from '@/apis/profile/getProfileSubdata';

const App = () => {
    const [sort, setSort] = useState()
    const items = [
        {
            key: '1',
            label: '视频',
            children: (
                <>
                <SortDropdown pushSort={setSort}/>
                <VideoList sort={sort} func={getProfileSubdata} params={['upload', 'videoList']}/>
                </>
            )
        },
        {
            key: '2',
            label: '动态',
            children: (
                <>
                <SortDropdown pushSort={setSort}/>
                <PostList sort={sort} func={getProfileSubdata} params={['upload', 'postList']}/>
                </>
            )
        },
        {
            key: '3',
            label: '文章',
            children: (
                <>
                <SortDropdown pushSort={setSort}/>
                <EssayList sort={sort} func={getProfileSubdata} params={['essay']}/>
                </>
            )
        },
    ];
    const [activeKey, setActiveKey] = useState('1')
    const handleChange = (key) => {setActiveKey(key)}
    return (
        <Tabs activeKey={activeKey} destroyInactiveTabPane items={items} onChange={handleChange} />
    )
}

export default App