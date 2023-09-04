import React from 'react'
import MateralList from './MaterialList'
import BulletScreenInteraction from './BulletScreenInteraction'
import styles from './index.css'
import { Row, Col } from 'antd'


const RightTool: React.FC = () => {

    return (
        <div id={styles.ctn}>
            <Row id={styles.materalList} className={styles.item}>
                <Col span={24}>
                    <MateralList />
                </Col>
            </Row>
            <Row className={styles.item}>
                <Col span={24}>
                    <BulletScreenInteraction />
                </Col>
            </Row>
        </div>
    )
}

export default RightTool
