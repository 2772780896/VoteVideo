import TopMenuApp from "@/components/common/TopMenu";
import {useSearchParams, useNavigate} from 'react-router-dom'
import React, {useMemo, useEffect} from 'react';
import { Col, Row, Segmented, Tabs} from "antd";
import ProfileCard from '@/components/common/DataList/ProfileCard'
import ProfileMessage from '@/components/feature/Profile/ProfileMessage/ProfileMessage'
import ProfileFavourite from '@/components/feature/Profile/ProfileFavourite'
import ProfileUpload from '@/components/feature/Profile/ProfileUpload'
import ProfileHistory from '@/components/feature/Profile/ProfileHistory'
import ProfileFollow from '@/components/feature/Profile/ProfileFollow'
import getProfile from '@/apis/profile/getProfile'
import useData from "@/hooks/useData";

const App = () => {
    // 发送请求
    const data = useData(getProfile)
    const profile = data.data
    console.log('profile:', profile)

    // 数据验证
    const navigate = useNavigate()
    useEffect(() => {
        if (data.code !== 200 && data.code !== undefined) {
            if (typeof window !== 'undefined' && window.alert) { // 仅在浏览器环境且 alert 可用时
                alert(data.message);
            }
            navigate('/main')
        }
    }, [data])

    // 当get参数更新时获取参数
    const [params] = useSearchParams()
    const activeKey = useMemo(() => {
        if (params.size !== 0) {return params.get('search')}
        else {return '1'}
    }, [params])
    // 当元素切换时更新url，通过get传递key参数
    const handleChange = (key) => {
        navigate(`/user/profile?search=${key}`)
    }

    const contentList = [
        // {key: '1', label: '消息', children: <ProfileMessage />},
        // {key: '2', label: '关注', children: <ProfileFollow />},
        {key: '1', label: '稿件', children: <ProfileUpload />},
        {key: '4', label: '收藏', children: <ProfileFavourite />},
        {key: '5', label: '历史', children: <ProfileHistory />},

    ]

    return (
        <Row>
            <Col span={24}>    
                <TopMenuApp />
                <Col offset={1}>
                    <ProfileCard user={profile} />
                </Col>
            </Col>
            <Col span={22} offset={1}>
                <Tabs activeKey={activeKey} items={contentList} onChange={handleChange} />
            </Col>
        </Row>
    )
}
export default App