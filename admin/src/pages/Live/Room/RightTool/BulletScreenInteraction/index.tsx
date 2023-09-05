import React from 'react'

import styles from './index.css'
import { EyeOutlined, EyeInvisibleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'


const BulletScreenInteraction: React.FC = () => {

    const genMaterial = () => {
        return (
            <div className={styles.ctnListItem}>
                <div className={styles.ctnListItemLeft}>
                    <span className={`${styles.marginRight10}`}>twelvet-s:</span>
                    <span>你好，进入直播观看</span>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.ctn}>
            <h3>弹幕互动区</h3>
            <div className={styles.ctnList}>

                {
                    [genMaterial(),
                    genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial(), genMaterial()]
                }

            </div>
            <div className={styles.control}>
                <Input />
                <Button id={styles.controlSend}>发送</Button>
            </div>
        </div>
    )
}

export default BulletScreenInteraction
