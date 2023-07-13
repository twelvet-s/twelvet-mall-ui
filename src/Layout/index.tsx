import React from 'react'
import { Layout as AntdLayout } from 'antd'

const { Header, Footer, Sider, Content } = AntdLayout

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
}

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#108ee9',
}

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#3ba0e9',
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
const Layout: React.FC<LayoutProps> = ({ sider, children }) => {
  return (
    <div className="w-full h-full">
      <AntdLayout>
        <Header style={headerStyle}>Header</Header>
        <AntdLayout hasSider className="h-86vh">
          <Sider style={siderStyle}>{sider}</Sider>
          <Content style={contentStyle}>
            <main>{children}</main>
          </Content>
        </AntdLayout>
        <Footer style={footerStyle}>Footer</Footer>
      </AntdLayout>
    </div>
  )
}

export default Layout
