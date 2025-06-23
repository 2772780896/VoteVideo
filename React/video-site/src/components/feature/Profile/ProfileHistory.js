import React, {useState} from 'react';
import { Tabs } from 'antd'
import SearchSortDropdown from '@/components/common/SortDropdown'
import SearchVideoFlex from '@/components/common/DataList/VideoList'
import SearchPostFlex from '@/components/common/DataList/PostList'
import SearchEssayFlex from '@/components/common/DataList/EssayList'
import getProfileSubdata from '@/apis/profile/getProfileSubdata'

const App = () => {
    const [sort, setSort] = useState()
    const items = [
        {
            key: '1',
            label: '视频',
            children: (
                <>
                <SearchSortDropdown pushSort={setSort}/>
                <SearchVideoFlex sort={sort} func={getProfileSubdata} params={['history', 'videoList']}/>
                </>)
        },
        {
            key: '2',
            label: '动态',
            children: (
                <>
                <SearchSortDropdown pushSort={setSort}/>
                <SearchPostFlex sort={sort} func={getProfileSubdata} params={['history', 'postList']}/>
                </>)
        },
        {
            key: '3',
            label: '文章',
            children: (
                <>
                <SearchSortDropdown pushSort={setSort}/>
                <SearchEssayFlex sort={sort} func={getProfileSubdata} params={['history', 'essayList']}/>
                </>)
        },
    ];
    const [activeKey, setActiveKey] = useState('1')
    const handleChange = (key) => {setActiveKey(key)}
    return (
        <Tabs activeKey={activeKey} items={items} onChange={handleChange} />
    )
}

export default App