import { AudioOutlined, DesktopOutlined, FolderOpenOutlined, FolderViewOutlined, FontSizeOutlined, PictureOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button, Card, Form, List, Modal } from 'antd';
import React from 'react'


// 添加素材
const AddMateral: React.FC = () => {

    // 选择直播素材
    const [materialSelectModal, setMaterialSelectModal] = React.useState<boolean>(false)

    const materialSelect = [
        {
            type: 'camera',
            icon: <FolderViewOutlined />,
            title: '摄像头',
        },
        {
            type: 'audio',
            icon: <AudioOutlined />,
            title: '音频',
        },
        {
            type: 'window',
            icon: <DesktopOutlined />,
            title: '窗口',
        },
        {
            type: 'picture',
            icon: <PictureOutlined />,
            title: '图片',
        },
        {
            type: 'text',
            icon: <FontSizeOutlined />,
            title: '文本',
        },
        {
            type: 'video',
            icon: <VideoCameraOutlined />,
            title: '多媒体',
        },
        {
            type: 'folder',
            icon: <FolderOpenOutlined />,
            title: '相册',
        }
    ];

    // 填写直播素材信息
    const [materialModal, setMaterialModal] = React.useState<boolean>(false)

    const [form] = Form.useForm<{ name: string; company: string }>()

    // 处理选择的直播素材
    const handleSelectMaterial = (type: string) => {
        setMaterialModal(true)
        setMaterialSelectModal(false)
        if (type === 'text') {

        }
    }

    return (
        <>
            <Button onClick={() => setMaterialSelectModal(true)}>添加素材</Button>

            <Modal
                title={'添加直播素材'}
                open={materialSelectModal}
                onCancel={() => setMaterialSelectModal(false)}
                footer
            >
                <List
                    grid={{ gutter: 16, column: 5 }}
                    dataSource={materialSelect}
                    renderItem={(item) => (
                        <List.Item>
                            <Button onClick={() => handleSelectMaterial(item.type)}>
                                {
                                    item.icon
                                }
                                {item.title}
                            </Button>
                        </List.Item>
                    )}
                />
            </Modal>

            <Modal
                open={materialModal}
                title={'添加直播素材'}
                onCancel={() => {
                    setMaterialSelectModal(false)
                    setMaterialModal(false)
                }}
            >

            </Modal>
        </>
    )
}

export default AddMateral
