import React from 'react';
import { Input } from 'antd';

const App = () => {
    const { TextArea } = Input;
    return(
        <TextArea 
            showCount
            maxLength={100} 
            placeholder="动态内容"
            style={{ height: 120, width: '100%'}}
        />
    )
}
export default App