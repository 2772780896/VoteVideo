import TopMenuApp from "@/components/common/TopMenu";
import React, { useState } from 'react';
import { Col, Row, Segmented, Tabs} from "antd";
import UserCardApp from '@/components/common/UserCard'
import UserMainApp from '@/components/feature/UserMain'
import UserMessageApp from '@/components/feature/UserMessage'
import UserFocusApp from '@/components/feature/UserFocus'
import UserFavouriteApp from '@/components/feature/UserFavourite'
import UserPostApp from '@/components/feature/UserPost'
import UserHistoryApp from '@/components/feature/UserHistory'


const App = () => {
    const contentList = [
        {key: '1', label: '主页', children: <UserMainApp />},
        {key: '2', label: '消息', children: <UserMessageApp />},
        {key: '3', label: '动态', children: <UserFocusApp />},
        {key: '4', label: '收藏', children: <UserFavouriteApp />},
        {key: '5', label: '历史', children: <UserHistoryApp />},
        {key: '6', label: '稿件', children: <UserPostApp />},
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
                <Tabs defaultActiveKey="1" items={contentList} />
            </Col>
        </Row>
    )
}
export default App