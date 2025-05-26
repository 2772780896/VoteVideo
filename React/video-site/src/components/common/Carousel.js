import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'antd';


const App = ({urlList}) => {
  const pictureList = urlList.map(
    (i) => (
      <Link>
      <img src={i.src} alt='图片载入中' style={{width:'100%', aspectRatio:'16/9'}}></img>
      </Link>)
  )
  return (
    <>
    <Carousel 
      arrows 
      infinite
      autoplay
      autoplaySpeed={1000}
      style={{width:'100%', aspectRatio:'16/9'}}>
        {pictureList}
    </Carousel>
    </>
  )
}
export default App;