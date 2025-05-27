import request from '@/utils/request'

async function getCarouselPicture(number) {
    const response = await request({
        url: `/api/picture/carousel?number=${number}`,
        method: 'get',
    })
    return response
}

export default getCarouselPicture