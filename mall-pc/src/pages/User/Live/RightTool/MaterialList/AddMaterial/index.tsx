import React, { useState } from 'react'
import { AudioOutlined, DesktopOutlined, FolderOpenOutlined, FolderViewOutlined, FontSizeOutlined, PictureOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Button, List, Modal } from 'antd'
import styles from './style.module.css'
import { MaterialTypeEnum } from './interface'
import MateralModal from './MaterialModal'


// 添加素材
const AddMateral: React.FC = () => {

    // 选择直播素材
    const [materialSelectModal, setMaterialSelectModal] = useState<boolean>(false)

    // 当前素材组件类型
    const [materialComponentType, setMaterialComponentType] = useState<string>()

    // 素材列表
    const materialSelect = [
        {
            type: MaterialTypeEnum.CAMERA,
            icon: <FolderViewOutlined className={styles.icons} />,
            title: '摄像头',
        },
        {
            type: MaterialTypeEnum.AUDIO,
            icon: <AudioOutlined className={styles.icons} />,
            title: '音频',
        },
        {
            type: MaterialTypeEnum.SCREEN,
            icon: <DesktopOutlined className={styles.icons} />,
            title: '窗口',
        },
        {
            type: MaterialTypeEnum.PICTURE,
            icon: <PictureOutlined className={styles.icons} />,
            title: '图片',
        },
        {
            type: MaterialTypeEnum.TEXT,
            icon: <FontSizeOutlined className={styles.icons} />,
            title: '文本',
        },
        {
            type: MaterialTypeEnum.VIDEO,
            icon: <VideoCameraOutlined className={styles.icons} />,
            title: '多媒体',
        },
        // {
        //     type: MaterialTypeEnum.FOLDER,
        //     icon: <FolderOpenOutlined className={styles.icons} />,
        //     title: '相册',
        // }
    ]

    // 填写直播素材信息
    const [materialModal, setMaterialModal] = useState<boolean>(false)


    return (
        <>
            <Button onClick={() => setMaterialSelectModal(true)}>添加素材</Button>

            <Modal
                title={'添加直播素材'}
                centered={true}
                open={materialSelectModal}
                onCancel={() => setMaterialSelectModal(false)}
                footer
            >
                <List
                    grid={{ gutter: 16, column: 5 }}
                    dataSource={materialSelect}
                    renderItem={(item) => (
                        <List.Item
                            onClick={() => {
                                setMaterialModal(true)
                                setMaterialSelectModal(false)
                                setMaterialComponentType(item.type)
                            }}
                            style={{
                                marginBlockEnd: 0
                            }}
                        >
                            <div className={styles.materialListCtn}>
                                {item.icon}
                                <p>{item.title}</p>
                            </div>
                        </List.Item>
                    )}
                />
            </Modal>

            <MateralModal
                open={materialModal}
                materialType={materialComponentType!}
                close={() => {
                    setMaterialModal(false)
                }}
            />
        </>
    )
}

export default AddMateral
