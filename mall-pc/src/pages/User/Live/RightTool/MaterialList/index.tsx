import React, { useContext } from 'react'

import styles from './style.module.css'
import { EyeOutlined, EditOutlined, DeleteOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { Button, Popconfirm } from 'antd'
import LiveContext, { LiveContextType, LiveStreamingMaterial } from '../../LiveContextProvider'
import AddMaterial from './AddMaterial'


const MateralList: React.FC = () => {

    const {
        liveStreamingMaterials,
        handleLiveStreamingMaterials
    } = useContext(LiveContext as React.Context<LiveContextType>)

    // 修改素材状态
    const handleStatusLiveStreamingMaterial = (id: string) => {
        const liveStreamingMaterialsFilter = liveStreamingMaterials.map((item: LiveStreamingMaterial) => {
            if (item.id === id) {
                item.disabled = !item.disabled
            }
            return item
        })
        handleLiveStreamingMaterials(liveStreamingMaterialsFilter)
    }


    // 添加素材
    const handleAddLiveStreamingMaterial = () => {

    }

    // 删除素材
    const handleDelLiveStreamingMaterial = (id: string) => {
        const liveStreamingMaterialsFilter = liveStreamingMaterials.filter((item: LiveStreamingMaterial) => item.id !== id)
        handleLiveStreamingMaterials(liveStreamingMaterialsFilter)
    }

    return (
        <div className={styles.ctn}>
            <h4 className={styles.ctnTitle}>素材列表</h4>
            <div className={styles.ctnList}>

                {liveStreamingMaterials.map((item: LiveStreamingMaterial) => (
                    <div className={styles.ctnListItem} key={item.id}>
                        <div className={styles.ctnListItemLeft}>
                            {
                                item.disabled
                                    ? <EyeInvisibleOutlined onClick={() => handleStatusLiveStreamingMaterial(item.id)} className={`${styles.marginRight10} ${styles.cursorPointer}`} /> :
                                    <EyeOutlined onClick={() => handleStatusLiveStreamingMaterial(item.id)} className={`${styles.marginRight10} ${styles.cursorPointer}`} />
                            }
                            <span className={`${styles.cursorPointer}`}>{item.title}</span>
                        </div>
                        <div className={styles.ctnListItemRight}>
                            <EditOutlined className={`${styles.marginRight10} ${styles.cursorPointer}`} />
                            <Popconfirm
                                title="删除素材"
                                description="是否删除素材？"
                                onConfirm={() => handleDelLiveStreamingMaterial(item.id)}
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
                        handleLiveStreamingMaterials([])
                    }}
                    okText="是"
                    cancelText="否"
                >
                    <Button type="link">Clean All</Button>
                </Popconfirm>
            </div>
        </div>
    )
}

export default MateralList
