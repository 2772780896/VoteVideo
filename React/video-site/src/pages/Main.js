import TopMenuApp from "@/components/common/TopMenu";
import CarouselApp from '@/components/common/Carousel'
import React, {useState,useEffect, use} from 'react';
import MainVideoFlex from '@/components/common/MainVideoFlex'
import { Col, Row } from "antd";
import useCarouselPicture from '@/hooks/main/useCarouselPicture'
import useMainVideo from '@/hooks/main/useMainVideo'

const App = () => {
    const carouselUrlList = useCarouselPicture(5)
    const mainVideoList = useMainVideo(1, 16)
    return (
        <>
        <Row>
            <Col span={24}>    
                <TopMenuApp />
            </Col>
            <Col offset={6} span={12}>
                <CarouselApp urlList={carouselUrlList}/>
            </Col>
            <Col span={20} offset={2}>
                <MainVideoFlex videoList={mainVideoList}/>
            </Col>
        </Row>
        </>
    )
}
export default App