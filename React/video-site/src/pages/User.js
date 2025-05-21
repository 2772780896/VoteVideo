import TopMenuApp from "@/components/common/TopMenu";
import {useSearchParams} from 'react-router-dom'
import React from 'react';
import { Col, Row, Segmented, Tabs} from "antd";
import UserCardApp from '@/components/common/UserCard'
import UserMessageApp from '@/components/feature/UserMessage/UserMessage'
import UserFocusApp from '@/components/feature/UserFocus'
import UserFavouriteApp from '@/components/feature/UserFavourite'
import UserVideoApp from '@/components/feature/UserVideo'
import UserHistoryApp from '@/components/feature/UserHistory'


const App = () => {
    const [params] = useSearchParams()
    let search = '1'
    if (params.get('search')){
        search = params.get('search')
    }
    const contentList = [
        {key: '1', label: '消息', children: <UserMessageApp />},
        {key: '2', label: '动态', children: <UserFocusApp />},
        {key: '3', label: '收藏', children: <UserFavouriteApp />},
        {key: '4', label: '历史', children: <UserHistoryApp />},
        {key: '5', label: '视频', children: <UserVideoApp />},
    ]
    return (
        <Row>
            <Col span={24}>    
                <TopMenuApp />
                <Col offset={1}>
                    <UserCardApp />
                </Col>
            </Col>
            <Col span={22} offset={1}>
                <Tabs defaultActiveKey={search} items={contentList} />
            </Col>
        </Row>
    )
}
export default App