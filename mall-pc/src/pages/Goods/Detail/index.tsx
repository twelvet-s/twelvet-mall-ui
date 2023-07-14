import React from 'react'
import {Carousel, Card, List} from 'antd'
import './index.css'

const data = [
    {
        price: 91,
    },
    {
        price: 92,
    },
    {
        price: 93,
    },
    {
        price: 94,
    },
    {
        price: 91,
    },
    {
        price: 92,
    },
    {
        price: 93,
    },
    {
        price: 94,
    },
    {
        price: 91,
    },
    {
        price: 92,
    },
    {
        price: 93,
    },
    {
        price: 94,
    },
    {
        price: 91,
    },
    {
        price: 92,
    },
    {
        price: 93,
    },
    {
        price: 94,
    },
    {
        price: 91,
    },
    {
        price: 92,
    },
    {
        price: 93,
    },
    {
        price: 94,
    },
];

const GoodsDetail: React.FC = () => {
    return (
        <>
            <Carousel className={'carousel'} autoplay>

                <img
                    src="https://msb-edu-prod.oss-cn-beijing.aliyuncs.com/mall-product/advertise/PC-%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3Java%E9%AB%98%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-banner(1200).jpg"
                    alt=""/>

                <img
                    src="https://msb-edu-prod.oss-cn-beijing.aliyuncs.com/mall-product/advertise/PC-%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3Java%E9%AB%98%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-banner(1200).jpg"
                    alt=""/>

                <img
                    src="https://msb-edu-prod.oss-cn-beijing.aliyuncs.com/mall-product/advertise/PC-%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3Java%E9%AB%98%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-banner(1200).jpg"
                    alt=""/>

                <img
                    src="https://msb-edu-prod.oss-cn-beijing.aliyuncs.com/mall-product/advertise/PC-%E6%B7%B1%E5%85%A5%E7%90%86%E8%A7%A3Java%E9%AB%98%E5%B9%B6%E5%8F%91%E7%BC%96%E7%A8%8B-banner(1200).jpg"
                    alt=""/>

            </Carousel>

            <List
                className={'product-list'}
                grid={{gutter: 16, column: 4}}
                dataSource={data}
                renderItem={(item) => (
                    <List.Item>
                        <Card>
                            <img
                                src="https://msb-edu-prod.oss-cn-beijing.aliyuncs.com/mall-product/product/bff78027-b936-45eb-b70e-c19071dc487c.jpg"
                                alt=""/>
                            <span>
                                罗技MX Master2s无线蓝牙高端鼠标办公笔记本电脑可充电人体工学
                            </span>
                            <p>
                                ¥ {item.price}
                            </p>
                        </Card>
                    </List.Item>
                )}
            />
        </>
    )
}

export default GoodsDetail
