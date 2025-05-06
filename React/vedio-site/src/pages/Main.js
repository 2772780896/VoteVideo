import TopMenuApp from "@/components/common/TopMenu";
import CarouselApp from '@/components/common/Carousel'
import React from 'react';
import MainVideoFlex from '@/components/common/MainVideoFlex'
import { Col, Row } from "antd";

const App = () => {
    return (
        <Row>
            <Col span={24}>    
                <TopMenuApp />
            </Col>
            <Col span={20} offset={2}>
                <CarouselApp />
                <MainVideoFlex />
            </Col>
        </Row>
    )
}
export default App