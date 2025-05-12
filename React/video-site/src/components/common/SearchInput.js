import React, { useState } from 'react';
import { CloseSquareFilled } from '@ant-design/icons';
import { AutoComplete, Button } from 'antd';

const mockVal = (str, repeat = 1) => ({
  value: str.repeat(repeat),
});
const App = () => {
  const [options, setOptions] = useState([]);
  const getPanelValue = searchText =>
    !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];
  return (
    <>
      <AutoComplete
        options={options}
        style={{ width: '90%' }}
        onSearch={text => setOptions(getPanelValue(text))}
        placeholder=""
        allowClear={{ clearIcon: <CloseSquareFilled /> }}
      />
      <Button type='primary' style={{ width: '10%' }}>搜索</Button>
    </>
  );
};
export default App;