import TopMenuApp from "@/components/common/TopMenu";
import CarouselApp from '@/components/common/Carousel'
import React, {useState,useEffect} from 'react';
import MainVideoFlex from '@/components/common/MainVideoFlex'
import { Col, Row } from "antd";
import {ask} from '@/apis/request'

const App = () => {
    const [image, setImage] = useState()
    useEffect(() => {
            async function getCarousel() {
                const carousel = await ask({
                    picture: 'carouselPicture',
                    quantity: '5'
                })
                setImage(carousel.data)
            }
            getCarousel()
    },[])
    console.log(image)
    return (
        <>
        <Row>
            <Col span={24}>    
                <TopMenuApp />
            </Col>
            <Col span={20} offset={2}>
                <CarouselApp />
                <MainVideoFlex />
            </Col>
        </Row>
        </>
    )
}
export default App