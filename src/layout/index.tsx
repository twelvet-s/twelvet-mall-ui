import React from 'react'
import {Layout as AntdLayout} from 'antd'

const {Header, Footer, Content} = AntdLayout

const headerStyle: React.CSSProperties = {
    width: '100vw',
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 50,
    backgroundColor: '#7dbcea',
}

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    color: '#fff',
    backgroundColor: '#108ee9',
}

const footerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#7dbcea',
}

interface LayoutProps {
    children?: React.ReactNode
    sider?: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
        <div style={{
            width: '100vw',
        }}>
            <Header style={headerStyle}>Header</Header>
            <Content style={contentStyle}>
                <main>{children}</main>
            </Content>
            <Footer style={footerStyle}>Footer</Footer>
        </div>
    )
}

export default Layout
