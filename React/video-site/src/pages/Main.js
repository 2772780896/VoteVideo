import TopMenuApp from "@/components/common/TopMenu";
import CarouselApp from '@/components/common/Carousel'
import React, {useState,useEffect, use} from 'react';
import MainVideoFlex from '@/components/common/MainVideoFlex'
import { Col, Row } from "antd";
import useData from '@/hooks/useData'
import getCarouselPicture from "@/apis/main/getCarouselPicture";
import getMainVideo from "@/apis/main/getMainVideo";

const App = () => {
    const carouselUrlList = useData(getCarouselPicture, 5)
    const mainVideoList = useData(getMainVideo, 1, 16)
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