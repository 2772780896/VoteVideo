import TopMenuApp from "@/components/common/TopMenu";
import {useSearchParams, useNavigate} from 'react-router-dom'
import React, {useMemo, useEffect} from 'react';
import { Col, Row, Segmented, Tabs} from "antd";
import ProfileCard from '@/components/feature/Profile/ProfileCard'
import ProfileMessage from '@/components/feature/Profile/ProfileMessage/ProfileMessage'
import ProfileFavourite from '@/components/feature/Profile/ProfileFavourite'
import ProfileUpload from '@/components/feature/Profile/ProfileUpload'
import ProfileHistory from '@/components/feature/Profile/ProfileHistory'
import ProfileFollow from '@/components/feature/Profile/ProfileFollow'
import getProfile from '@/apis/profile/getProfile'
import Cookies from 'js-cookie'
import useData from "@/hooks/useData";

const App = () => {
    // 发送请求
    const token = Cookies.get('token')
    const uid = Cookies.get('uid')
    const data = useData(getProfile, uid, token)
    const profileList = data.data
    console.log('profileList:', profileList)

    // 数据验证
    const navigate = useNavigate()
    useEffect(() => {
    if (data.code === 401) {
        if (typeof window !== 'undefined' && window.alert) { // 仅在浏览器环境且 alert 可用时
        alert('token错误');
        }
        navigate('/main', )
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
        navigate(`/profile?search=${key}`)
    }

    const contentList = [
        {key: '1', label: '消息', children: <ProfileMessage uid={uid} token={token} />},
        {key: '2', label: '关注', children: <ProfileFollow uid={uid} token={token} />},
        {key: '3', label: '稿件', children: <ProfileUpload uid={uid} token={token} />},
        {key: '4', label: '收藏', children: <ProfileFavourite uid={uid} token={token} />},
        {key: '5', label: '历史', children: <ProfileHistory uid={uid} token={token} />},

    ]

    return (
        <Row>
            <Col span={24}>    
                <TopMenuApp />
                <Col offset={1}>
                    <ProfileCard profile={profileList?.[0]} />
                </Col>
            </Col>
            <Col span={22} offset={1}>
                <Tabs activeKey={activeKey} items={contentList} onChange={handleChange} />
            </Col>
        </Row>
    )
}
export default App