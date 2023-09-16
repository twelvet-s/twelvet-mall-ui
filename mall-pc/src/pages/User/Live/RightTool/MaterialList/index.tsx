import React, { useContext, useState } from 'react'

import styles from './style.module.css'
import { EyeOutlined, EditOutlined, DeleteOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { Button, Popconfirm } from 'antd'
import LiveContext, { LiveContextType, LiveStreamingMaterial } from '../../LiveContextProvider'
import AddMaterial from './AddMaterial'
import MateralModal from './AddMaterial/MaterialModal'


const MateralList: React.FC = () => {

    // 填写直播素材信息
    const [materialModal, setMaterialModal] = useState<{
        open: boolean
        type: string
        material: LiveStreamingMaterial | undefined
    }>({
        open: false,
        type: '',
        material: undefined
    })

    const {
        liveStreamingMaterials,
        handleDeleteLiveStreamingMaterial,
        handleVisibleLiveStreamingMaterial
    } = useContext(LiveContext as React.Context<LiveContextType>)

    return (
        <>
            <div className={styles.ctn}>
                <h4 className={styles.ctnTitle}>素材列表</h4>
                <div className={styles.ctnList}>

                    {liveStreamingMaterials.map((item: LiveStreamingMaterial) => (
                        <div className={styles.ctnListItem} key={item.id}>
                            <div className={styles.ctnListItemLeft}>
                                {
                                    item.visible
                                        ? <EyeOutlined onClick={() => handleVisibleLiveStreamingMaterial(item.id)} className={`${styles.marginRight10} ${styles.cursorPointer}`} /> :
                                        <EyeInvisibleOutlined onClick={() => handleVisibleLiveStreamingMaterial(item.id)} className={`${styles.marginRight10} ${styles.cursorPointer}`} />
                                }
                                <span className={`${styles.cursorPointer}`} onClick={() => {
                                    setMaterialModal({
                                        open: true,
                                        type: item.type,
                                        material: {
                                            ...item
                                        }
                                    })
                                }}>{item.title}</span>
                            </div>
                            <div className={styles.ctnListItemRight}>
                                <EditOutlined className={`${styles.marginRight10} ${styles.cursorPointer}`} onClick={() => {
                                    setMaterialModal({
                                        open: true,
                                        type: item.type,
                                        material: {
                                            ...item
                                        }
                                    })
                                }} />
                                <Popconfirm
                                    title="删除素材"
                                    description="是否删除素材？"
                                    onConfirm={() => handleDeleteLiveStreamingMaterial(item.id)}
                                    okText="是"
                                    cancelText="否"
                                >
                                    <DeleteOutlined className={`${styles.cursorPointer}`} />
                                </Popconfirm>
                            </div>
                        </div>
                    ))}


                </div>
                <div className={styles.control}>
                    <AddMaterial />
                    <Popconfirm
                        title="清空素材"
                        description="是否清空素材？"
                        onConfirm={() => {
                            handleDeleteLiveStreamingMaterial(0)
                        }}
                        okText="是"
                        cancelText="否"
                    >
                        <Button type="link">Clean All</Button>
                    </Popconfirm>
                </div>
            </div>

            {/* 编辑直播信息 */}
            <MateralModal
                open={materialModal.open}
                materialType={materialModal.type}
                data={materialModal.material}
                close={() => {
                    setMaterialModal({
                        open: false,
                        type: '',
                        material: undefined
                    })
                }}
            />
        </>
    )
}

export default MateralList
