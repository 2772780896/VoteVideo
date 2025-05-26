import { useState, useEffect } from "react"
import getCarouselPicture from "@/apis/main/getCarouselPicture"

const useCarouselPicture = (number) =>{
    const [carouselPicture, setCarouselPicture] = useState([])
    useEffect(() => {
        async function getPicture() {
            const carousel = await getCarouselPicture(number)
            setCarouselPicture(carousel.data.data)
        }
        getPicture()
    },[])
    return carouselPicture
}
export default useCarouselPicture