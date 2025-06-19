import TopMenuApp from "@/components/common/TopMenu";
import {useParams} from 'react-router-dom'
import React, {useEffect, useState} from 'react';
import { Col, Row, Segmented, Tabs} from "antd";
import UserCard from '@/components/common/DataCard/UserCard'
import UserPostFlex from '@/components/feature/User/UserPostFlex'
import UserEssayFlex from '@/components/feature/User/UserEssayFlex'
import UserVideoFlex from '@/components/feature/User/UserVideoFlex'
import useData from '@/hooks/useData';
import getUser from '@/apis/getData/getUser';


const App = () => {
    // 获取数据
    const {uid} = useParams()
    console.log('uid:', uid)
    const showUser = useData(getUser, uid).data

    // 根据数据有无设置activeKey
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

    // 控制Tabs切换
    const handleChange = (key) => {setActiveKey(key)}

    // Tabs元素
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