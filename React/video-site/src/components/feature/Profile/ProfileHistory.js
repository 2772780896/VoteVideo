import React, {useState} from 'react';
import { Tabs } from 'antd'
import SearchSortDropdown from '@/components/common/SortDropdown'
import SearchVideoFlex from '@/components/common/DataList/VideoList'
import SearchPostFlex from '@/components/common/DataList/PostList'
import SearchEssayFlex from '@/components/common/DataList/EssayList'
import { getHistoryEssay } from '@/apis/profile/showHitory';
import { getHistoryPost } from '@/apis/profile/showHitory';
import { getHistoryVideo } from '@/apis/profile/showHitory';

const App = ({uid, token}) => {
    const [sort, setSort] = useState('1')
    const items = [
        {
            key: '1',
            label: '视频',
            children: (
                <>
                <SearchSortDropdown pushSort={setSort}/>
                <SearchVideoFlex sort={sort} func={getHistoryVideo} params={[uid, token]}/>
                </>)
        },
        {
            key: '2',
            label: '动态',
            children: (
                <>
                <SearchSortDropdown pushSort={setSort}/>
                <SearchPostFlex sort={sort} func={getHistoryPost} params={[uid, token]}/>
                </>)
        },
        {
            key: '3',
            label: '文章',
            children: (
                <>
                <SearchSortDropdown pushSort={setSort}/>
                <SearchEssayFlex sort={sort} func={getHistoryEssay} params={[uid, token]}/>
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