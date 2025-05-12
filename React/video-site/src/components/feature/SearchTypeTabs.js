import React, {useState} from 'react';
import { Col, Row, Segmented, Tabs } from "antd";
import SearchSortDropdownApp from '@/components/feature/SearchSortDropdown'
import SearchVideoFlexApp from '@/components/feature/SearchVideoFlex'
import FocusUploaderFlexApp from '@/components/feature/FocusUploaderFlex'

const App = () => {
    const  [sort, setSort] = useState()
    const tab = [
        {key: '1', label: '综合', children: (
            <>
            <SearchSortDropdownApp pushSort={setSort}/>
            <SearchVideoFlexApp sort={sort}/>
            </>
        )},
        {key: '2', label: '视频', children: <SearchSortDropdownApp />},
        {key: '3', label: '专栏', children: <SearchSortDropdownApp />},
        {key: '4', label: '动态', children: <FocusUploaderFlexApp />},
        {key: '5', label: '用户', children: <SearchSortDropdownApp />},
    ]
    return (
        <Tabs defaultActiveKey="1" items={tab}></Tabs>
    )
}

export default App