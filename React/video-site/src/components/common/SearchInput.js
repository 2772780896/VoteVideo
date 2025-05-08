import React, { useState } from 'react';
import { CloseSquareFilled } from '@ant-design/icons';
import { AutoComplete } from 'antd';

const mockVal = (str, repeat = 1) => ({
  value: str.repeat(repeat),
});
const App = () => {
  const [options, setOptions] = useState([]);
  const getPanelValue = searchText =>
    !searchText ? [] : [mockVal(searchText), mockVal(searchText, 2), mockVal(searchText, 3)];
  return (
      <AutoComplete
        options={options}
        style={{ width: 400 }}
        onSearch={text => setOptions(getPanelValue(text))}
        placeholder="Customized clear icon"
        allowClear={{ clearIcon: <CloseSquareFilled /> }}
      />
  );
};
export default App;