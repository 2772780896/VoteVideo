import React from 'react';

const App = ({playVideo}) => {
    return (
        <video 
            controls 
            poster={playVideo?.coverUrl}
            key={playVideo?.vid}
            style={{width:'100%', aspectRatio: '16/9'}}>
            <source src={playVideo?.videoUrl} type="video/mp4" />
        </video>
    )
}
export default App