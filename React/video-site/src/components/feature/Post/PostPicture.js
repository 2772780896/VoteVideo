import React from 'react';
import { Card, Flex, Image } from 'antd';

const App = ({post}) => {
    const pictureList = post.pictureList.map( i => (
         <Image src={i} style={{width:'150px', aspectRatio:'16/9'}}></Image>
    ))
    return (
        <>
            <div>{post.text}</div>
            <Flex wrap>
                {pictureList}
            </Flex>
        </>
    )
}
export default App;