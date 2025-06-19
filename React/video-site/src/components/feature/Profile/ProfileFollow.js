import React, {useState} from 'react';
import { Tabs } from 'antd';
import SearchPostFlex from '@/components/common/DataList/PostList'
import useData from '@/hooks/useData';
import { getFollowUser, getFollowPost } from '@/apis/profile/showFollow';
import SearchSortDropdown from '@/components/common/SortDropdown'

const App = ({uid, token}) => {
    const followPostList = useData(getFollowUser, uid, token).data
    let followUserList = []
    for (const i of followPostList) {
        followUserList.push(i.uploader)
    }
    const [sort, setSort] = useState('1')
    const tab = followUserList.map(i => (
        {key: i.uid, label: i.userName, children: (
            <>
                <SearchSortDropdown pushSort={setSort}/>
                <SearchPostFlex sort={sort} func={getFollowPost} params={[uid, token, i.userName]}/>
            </>
        )}
    ))
    const [activeKey, setActiveKey] = useState(followUserList?.[0]?.uid)
    const handleChange = (key) => {setActiveKey(key)}
    return (
        <Tabs activeKey={activeKey} items={tab} onChange={handleChange} destroyInactiveTabPane></Tabs>
    )
}

export default App
