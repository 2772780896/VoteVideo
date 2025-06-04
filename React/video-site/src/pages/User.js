import TopMenuApp from "@/components/common/TopMenu";
import {useSearchParams} from 'react-router-dom'
import React, {useEffect, useState} from 'react';
import { Col, Row, Segmented, Tabs} from "antd";
import UserCard from '@/components/common/UserCard'
import UserPostFlex from '@/components/feature/UserPostFlex'
import UserEssayFlex from '@/components/feature/UserEssayFlex'
import UserVideoFlex from '@/components/feature/UserVideoFlex'
import useData from '@/hooks/useData';
import getShowUser from '@/apis/user/getShowUser';


const App = () => {
    const [params] = useSearchParams()
    const uid = params.get('uid')
    console.log('uid:', uid)
    const showUserList = useData(getShowUser, uid).data
    const showUser = showUserList?.[0]
    const [activeKey, setActiveKey] = useState('1')
    useEffect(() => {
        if (showUser?.videoList.length !== 0) {
            setActiveKey('1')
        }else if (showUser?.postList.length !== 0) {
            setActiveKey('2')
        }else if (showUser?.essayList.length !== 0) {
            setActiveKey('3')
        }else {
            setActiveKey('1')
        }
    }, [showUser])
    console.log('videoList:', showUser?.videoList)
    console.log('activeKey:', activeKey)
    const contentList = [
        {key: '1', label: '视频', children: (
            <UserVideoFlex videoList={showUser?.videoList} />
        )},
        {key: '2', label: '动态', children: (
            <UserPostFlex postList={showUser?.postList} />
        )},
        {key: '3', label: '文章', children: (
            <UserEssayFlex essayList={showUser?.essayList} />
        )},
    ]
    const handleChange = (key) => {setActiveKey(key)}
    return (
        <Row>
            <Col span={24}>    
                <TopMenuApp />
                <Col offset={1}>
                    <UserCard user={showUser} />
                </Col>
            </Col>
            <Col span={22} offset={1}>
                <Tabs activeKey={activeKey} items={contentList} onChange={handleChange}/>
            </Col>
        </Row>
    )
}
export default App