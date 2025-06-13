import React, {useState} from 'react';
import { Tabs } from 'antd'
import SearchSortDropdown from '@/components/feature/Search/SearchSortDropdown'
import SearchVideoFlex from '@/components/common/DataList/VideoList'
import SearchPostFlex from '@/components/common/DataList/PostList'
import SearchEssayFlex from '@/components/common/DataList/EssayList'
import { getUploadEssay } from '@/apis/profile/showUpload';
import { getUploadPost } from '@/apis/profile/showUpload';
import { getUploadVideo } from '@/apis/profile/showUpload';

const App = ({uid, token}) => {
    const [sort, setSort] = useState('1')
    const items = [
        {
            key: '1',
            label: '视频',
            children: (
                <>
                <SearchSortDropdown pushSort={setSort}/>
                <SearchVideoFlex sort={sort} func={getUploadVideo} params={[uid, token]}/>
                </>
            )
        },
        {
            key: '2',
            label: '动态',
            children: (
                <>
                <SearchSortDropdown pushSort={setSort}/>
                <SearchPostFlex sort={sort} func={getUploadPost} params={[uid, token]}/>
                </>
            )
        },
        {
            key: '3',
            label: '文章',
            children: (
                <>
                <SearchSortDropdown pushSort={setSort}/>
                <SearchEssayFlex sort={sort} func={getUploadEssay} params={[uid, token]}/>
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