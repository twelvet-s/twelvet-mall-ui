import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Col, Layout as AntdLayout, Menu, Row, FloatButton } from 'antd'
import { VideoCameraOutlined, WhatsAppOutlined, TeamOutlined } from '@ant-design/icons'
import './index.css'
import logo from '../assets/logo.svg'

const { Header, Content, Footer } = AntdLayout;

const Layout: React.FC = () => {

    const navigate = useNavigate()

    const currentPath = location.pathname;

    let defaultSelectedKey = '';

    if (currentPath === '/') {
        defaultSelectedKey = 'home'
    } else if (currentPath === '/goods/list') {
        defaultSelectedKey = 'goodsList'
    }

    return (
        <AntdLayout className="layout">
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className={'logo'}>
                    <img src={logo} alt="logo" />
                    twelvet
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={[defaultSelectedKey]}
                    onClick={(e) => {
                        if (e.key === 'home') {
                            navigate('/')
                        } else if (e.key === 'goodsList') {
                            navigate('/goods/list')
                        }
                    }}
                    items={[
                        {
                            key: 'home',
                            label: `首页`,
                        },
                        {
                            key: 'goodsList',
                            label: `商品列表`,
                        },
                    ]}
                />
            </Header>
            <Content>
                <Row>
                    <Col sm={4} xs={1}></Col>
                    <Col sm={16} xs={22}>
                        <Outlet />
                    </Col>
                </Row>
            </Content>
            <Footer style={{ textAlign: 'center' }}>twelvet mall ©2023 Created by twelvet</Footer>


            <FloatButton.Group
                trigger='hover'
                icon={<WhatsAppOutlined />}
            >
                <FloatButton href='/live' target='_blank' icon={<VideoCameraOutlined />} tooltip='直播间' />
                <FloatButton href='/chat' target='_blank' icon={<TeamOutlined />} tooltip='聊天室' />
            
            </FloatButton.Group>
        </AntdLayout>
    )
}

export default Layout
