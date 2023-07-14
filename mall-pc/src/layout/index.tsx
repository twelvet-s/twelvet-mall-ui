import React from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import {Col, Layout as AntdLayout, Menu, Row} from 'antd'
import './index.css'
import logo from '../assets/logo.svg'

const {Header, Content, Footer} = AntdLayout;

const Layout: React.FC = () => {

    const navigate = useNavigate()

    return (
        <AntdLayout className="layout">
            <Header style={{display: 'flex', alignItems: 'center'}}>
                <div className={'logo'}>
                    <img src={logo} alt="logo"/>
                    twelvet
                </div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['home']}
                    onClick={(e) => {
                        if (e.key === 'home') {
                            navigate('/')
                        }
                    }}
                    items={[
                        {
                            key: 'home',
                            label: `首页`,
                        },
                    ]}
                />
            </Header>
            <Content>
                <Row>
                    <Col sm={4} xs={1}></Col>
                    <Col sm={16} xs={22}>
                        <Outlet/>
                    </Col>
                </Row>
            </Content>
            <Footer style={{textAlign: 'center'}}>twelvet mall ©2023 Created by twelvet</Footer>
        </AntdLayout>
    )
}

export default Layout
