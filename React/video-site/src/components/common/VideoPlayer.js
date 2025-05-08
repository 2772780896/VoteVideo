import React from 'react';

const App = () => {
    return (
        <video 
            controls 
            poster='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'
            style={{width:'100%', aspectRatio: '16/9'}}>
            <source src='https://cdn.pixabay.com/video/2025/04/29/275633_large.mp4' />
        </video>
    )
}
export default App