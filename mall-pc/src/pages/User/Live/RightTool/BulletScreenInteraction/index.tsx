import React from 'react'

import styles from './style.module.css'
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
            <h4 className={styles.ctnTitle}>弹幕互动区</h4>
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