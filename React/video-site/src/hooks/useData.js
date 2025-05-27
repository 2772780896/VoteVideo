import { useState, useEffect } from "react"

const useData = (requestFunc, ...params) =>{
    const [data, setData] = useState([])
    useEffect(() => {
        async function getData() {
            const response = await requestFunc(...params)
            setData(response.data.data)
        }
        getData()
    },[])
    return data
}
export default useData