import Mock from 'mockjs'
export const carouselPicture = Mock.mock(
    'picture/carousel',
    'get',
    {
        'list|1-10':[
            {'string|1-10':'1'},
        ],
        code: 200,
        message: 'ok'
    }
)