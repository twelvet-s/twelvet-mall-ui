import React from 'react'
import {Carousel, Card, List} from 'antd'
import './index.css'

const data = [
    {
        price: 91,
        img: 'https://msb-edu-dev.oss-cn-beijing.aliyuncs.com/mall-product/product-category/1111111%20(4).png',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 92,
        img: 'https://msb-edu-dev.oss-cn-beijing.aliyuncs.com/mall-product/product-category/%E5%BE%AE%E6%9C%8D%E5%8A%A1%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F%E5%92%8C%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 93,
        img: 'https://msb-edu-prod.oss-cn-beijing.aliyuncs.com/mall-product/product/4a194b70-0830-4686-8d45-3d30bce709d3.png',
        desc: '  JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 94,
        img: 'https://msb-edu-prod.oss-cn-beijing.aliyuncs.com/mall-product/product/f202ad66-5d98-4f61-a071-a35f5afaf075.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 91,
        img: 'https://msb-edu-prod.oss-cn-beijing.aliyuncs.com/mall-product/product/5c48e84e-989c-4a70-b647-e4dfa69efbaf.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 92,
        img: 'https://msb-edu-prod.oss-cn-beijing.aliyuncs.com/mall-product/product/4a194b70-0830-4686-8d45-3d30bce709d3.png',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 93,
        img: 'https://msb-edu-prod.oss-cn-beijing.aliyuncs.com/mall-product/product/70a71721-f542-4bc5-a65a-24000bcce947.png',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 94,
        img: 'https://msb-edu-dev.oss-cn-beijing.aliyuncs.com/mall-product/productrBEhWlKb234IAAAAAAQe--TPULkAAGMcAB9W-wABB8T163.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 91,
        img: 'https://msb-edu-dev.oss-cn-beijing.aliyuncs.com/mall-product/productO1CN01v6iIYJ2KcJrJ4xSX0_!!2211629699577.jpg_430x430q90.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 92,
        img: 'https://msb-edu-dev.oss-cn-beijing.aliyuncs.com/mall-product/product8288d649f0e94a73.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 93,
        img: 'https://msb-edu-dev.oss-cn-beijing.aliyuncs.com/mall-product/productO1CN01zqy0wD1v5vPm9f7Xk_!!1614846122.jpg_430x430q90.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 94,
        img: 'https://msb-edu-dev.oss-cn-beijing.aliyuncs.com/mall-product/productO1CN01Nhd52x1va9QmyfcIj_!!3446196188.jpg_430x430q90.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 91,
        img: 'https://msb-edu-dev.oss-cn-beijing.aliyuncs.com/mall-product/productO1CN01Qfyp2r1rN5qW6ltfr_!!859515618.jpg_430x430q90.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 92,
        img: 'https://msb-edu-dev.oss-cn-beijing.aliyuncs.com/mall-product/productO1CN010A7WjS1CP1BmI67Qg-101450072.jpg_430x430q90.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 93,
        img: 'https://msb-edu-dev.oss-cn-beijing.aliyuncs.com/mall-product/productTB2MXsfyiOYBuNjSsD4XXbSkFXa_!!1614846122-0-item_pic.jpg_430x430q90.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 94,
        img: 'https://msb-edu-dev.oss-cn-beijing.aliyuncs.com/mall-product/productO1CN01TWDMD41v5vCLOUNhs_!!0-item_pic.jpg_430x430q90.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 91,
        img: 'https://msb-edu-dev.oss-cn-beijing.aliyuncs.com/mall-product/productO1CN012lxjMG1v5vNZolfWL_!!0-item_pic.jpg_430x430q90.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 92,
        img: 'https://msb-edu-dev.oss-cn-beijing.aliyuncs.com/mall-product/productrBEhWlKb234IAAAAAAQe--TPULkAAGMcAB9W-wABB8T163.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 93,
        img: 'https://msb-edu-dev.oss-cn-beijing.aliyuncs.com/mall-product/product945e8503207dec67.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
    {
        price: 94,
        img: 'https://msb-edu-dev.oss-cn-beijing.aliyuncs.com/mall-product/productO1CN01i6wirP1v5vH1exCTz_!!1614846122.jpg_430x430q90.jpg',
        desc: 'JavaScript百炼成仙 杨逸飞 JavaScript初学入门教材书JavaScript编程入门',
    },
];

const Home: React.FC = () => {
    return (
        <>
            <Carousel className={'carousel'} autoplay>

                <a target={'_blank'} href="/goods/detail">
                    <img
                        src="https://msb-edu-prod.oss-cn-beijing.aliyuncs.com/mall-product/advertise/PC-%E7%89%9B%E5%A5%B6banner(1200).jpg"
                        alt=""/>
                </a>

                <a target={'_blank'} href="/goods/detail">
                    <img
                        src="https://msb-edu-prod.oss-cn-beijing.aliyuncs.com/mall-product/advertise/PC-%E4%BA%BA%E4%BD%93%E5%B7%A5%E7%A8%8B%E6%A4%85banner(1200).jpg"
                        alt=""/>
                </a>

                <a target={'_blank'} href="/goods/detail">
                    <img
                        src="https://msb-edu-prod.oss-cn-beijing.aliyuncs.com/mall-product/advertise/PC-%E6%8C%89%E6%91%A9%E5%99%A8banner(1200).jpg"
                        alt=""/>
                </a>

                <a target={'_blank'} href="/goods/detail">
                    <img
                        src="https://msb-edu-prod.oss-cn-beijing.aliyuncs.com/mall-product/advertise/PC-%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3Java%E9%AB%98%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-banner(1200).jpg"
                        alt=""/>
                </a>

            </Carousel>

            <List
                className={'product-list'}
                grid={{gutter: 16, column: 4}}
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <Card className={'card'}>
                            <a target={'_blank'} href="/goods/detail">
                                <img
                                    src={item.img}
                                    alt=""/>
                                <span>
                                    {item.desc}
                                </span>
                                <p id={'goods-price'}>
                                    ¥ {item.price}
                                </p>
                            </a>
                        </Card>
                    </List.Item>
                )}
            />
        </>
    )
}

export default Home
