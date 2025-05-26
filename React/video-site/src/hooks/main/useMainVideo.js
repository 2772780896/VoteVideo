import { useState, useEffect } from "react"
import getMainVideo from "@/apis/main/getMainVideo"

const useMainVideo = (page=1, element=16) =>{
    const [mainVideo, setMainVideo] = useState([])
    useEffect(() => {
        async function getVideo() {
            const carousel = await getMainVideo(page, element)
            setMainVideo(carousel.data.data)
        }
        getVideo()
    },[])
    return mainVideo
}
export default useMainVideo