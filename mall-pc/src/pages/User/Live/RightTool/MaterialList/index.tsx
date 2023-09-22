import React, { useContext, useState } from 'react'

import styles from './style.module.css'
import { EyeOutlined, EditOutlined, DeleteOutlined, EyeInvisibleOutlined, SoundOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Slider } from 'antd'
import LiveContext, { LiveContextType, LiveStreamingMaterial } from '../../LiveContextProvider'
import AddMaterial from './AddMaterial'
import MateralModal from './AddMaterial/MaterialModal'
import { MaterialTypeEnum } from './AddMaterial/interface'


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
        handleVisibleLiveStreamingMaterial,
        handleVolume
    } = useContext(LiveContext as React.Context<LiveContextType>)

    return (
        <>
            <div className={styles.ctn}>
                <h4 className={styles.ctnTitle}>素材列表</h4>
                <div className={styles.ctnList}>

                    {liveStreamingMaterials?.map((item: LiveStreamingMaterial) => (
                        <div className={styles.ctnListItem} key={item.id}>
                            <div className={styles.ctnListItemLeft}>
                                {
                                    (item.visible && item.type !== MaterialTypeEnum.AUDIO)
                                        ? <EyeOutlined onClick={() => handleVisibleLiveStreamingMaterial!(item.id)} className={`${styles.marginRight10} ${styles.cursorPointer}`} /> :
                                        <EyeInvisibleOutlined onClick={() => {
                                            // 禁止隐藏音频
                                            if (item.type !== MaterialTypeEnum.AUDIO) {
                                                handleVisibleLiveStreamingMaterial!(item.id)
                                            }
                                        }} className={`${styles.marginRight10} ${styles.cursorPointer}`} />
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
                                {
                                    (item.type === MaterialTypeEnum.AUDIO || item.type === MaterialTypeEnum.VIDEO) && (
                                        <Popconfirm
                                            title={undefined}
                                            icon={null}
                                            description={
                                                <Slider
                                                    style={{ width: '100px'}}
                                                    min={1}
                                                    max={100}
                                                    defaultValue={100}
                                                    onAfterChange={val => handleVolume!(item.id, val)}
                                                />
                                            }
                                            onConfirm={() => handleDeleteLiveStreamingMaterial!(item.id)}
                                            trigger="hover"
                                            okButtonProps={{ style: { display: 'none' } }}
                                            cancelButtonProps={{ style: { display: 'none' } }}
                                        >
                                            <SoundOutlined onClick={() => handleVolume!(item.id, 0)} className={`${styles.marginRight10} ${styles.cursorPointer}`} />
                                        </Popconfirm>
                                    )
                                }
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
                                    onConfirm={() => handleDeleteLiveStreamingMaterial!(item.id)}
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
                            handleDeleteLiveStreamingMaterial!(0)
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
