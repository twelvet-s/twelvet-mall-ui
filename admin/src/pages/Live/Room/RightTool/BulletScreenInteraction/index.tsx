import React from 'react'

import styles from './index.css'
import { EyeOutlined, EyeInvisibleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'


const BulletScreenInteraction: React.FC = () => {

    const genMaterial = () => {
        return (
            <div className={styles.ctnListItem}>
                <div className={styles.ctnListItemLeft}>
                    <EyeOutlined className={`${styles.marginRight10} ${styles.cursorPointer}`} />
                    {/* <EyeInvisibleOutlined /> */}
                    <span className={`${styles.cursorPointer}`}>自行车自自行车自自行</span>
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
