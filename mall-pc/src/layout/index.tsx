import React from 'react'
import {Outlet} from 'react-router-dom'
import {Layout as AntdLayout, Menu} from 'antd'
import './index.css'
import logo from '../assets/logo.svg'

const {Header, Content, Footer} = AntdLayout;

const Layout: React.FC = () => {
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
                    items={[
                        {
                            key: 'home',
                            label: `首页`,
                        },
                    ]}
                />
            </Header>
            <Content className={'ctn'}>
                <Outlet/>
            </Content>
            <Footer style={{textAlign: 'center'}}>twelvet mall ©2023 Created by twelvet</Footer>
        </AntdLayout>
    )
}

export default Layout
