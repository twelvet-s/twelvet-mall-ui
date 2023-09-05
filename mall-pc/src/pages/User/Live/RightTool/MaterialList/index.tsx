import React from 'react'

import styles from './style.module.css'
import { EyeOutlined, EyeInvisibleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button } from 'antd'


const MateralList: React.FC = () => {

    const genMaterial = () => {
        return (
            <div className={styles.ctnListItem}>
                <div className={styles.ctnListItemLeft}>
                    <EyeOutlined className={`${styles.marginRight10} ${styles.cursorPointer}`} />
                    {/* <EyeInvisibleOutlined /> */}
                    <span className={`${styles.cursorPointer}`}>自行车自自行车自自行</span>
                </div>
                <div className={styles.ctnListItemRight}>
                    <EditOutlined className={`${styles.marginRight10} ${styles.cursorPointer}`} />
                    <DeleteOutlined className={`${styles.cursorPointer}`} />
                </div>
            </div>
        )
    }

    return (
        <div className={styles.ctn}>
            <h4 className={styles.ctnTitle}>素材列表</h4>
            <div className={styles.ctnList}>

                {
                    [genMaterial(),
                    genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial()]
                }

            </div>
            <div className={styles.control}>
                <Button>添加素材</Button>
                <Button type="link">Clean All</Button>
            </div>
        </div>
    )
}

export default MateralList
