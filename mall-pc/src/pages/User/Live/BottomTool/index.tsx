import React, { useContext } from 'react'
import styles from './style.module.css'
import { Button, Select } from 'antd'
import { BugOutlined, EditOutlined, QuestionCircleOutlined, ShareAltOutlined } from '@ant-design/icons'
import LiveContext, { LiveContextType } from '../LiveContextProvider'


const BottomTool: React.FC<{
    handleLiveStatus: () => void
    liveStatus: 0 | 1 | 2
}> = (props) => {

    const {
        handleBitrate,
        handleResolutionRatio
    } = useContext(LiveContext as React.Context<LiveContextType>)

    return (
        <>
            <img className={styles.avatar} src="https://static.twelvet.cn/avatar.jpg" alt="" />
            <div className={styles.ctn}>
                <div className={styles.ctnTop}>
                    <div className={styles.flex}>
                        <div className={styles.liveTitle}>
                            <span className={styles.liveTitleText}>twelvet直播</span>
                            <Button type='link' onClick={() => {
                                alert(123)
                            }}>
                                <EditOutlined />
                            </Button>

                        </div>
                        <div>
                            <Button type='primary' className={styles.liveArea}>知识·职场·技能</Button>
                        </div>
                    </div>

                    <div className={styles.flex}>
                        <div className={`${styles.marginRight10}`}>
                            <ShareAltOutlined />
                            <Button type='link'>分享直播间</Button>
                        </div>
                        <div className={`${styles.marginRight10}`}>
                            <QuestionCircleOutlined />
                            <Button type='link'>帮助中心</Button>
                        </div >
                        <div>
                            <BugOutlined />
                            <Button type='link'>反馈</Button>
                        </div>
                    </div>
                </div>
                <div className={styles.ctnBottom}>
                    <div className={styles.flex}>
                        <div className={styles.marginRight10}>
                            码率设置：
                            <Select
                                defaultValue={4000}
                                style={{ width: 120 }}
                                options={[
                                    { value: 1000, label: '1000' },
                                    { value: 2000, label: '2000' },
                                    { value: 3000, label: '3000' },
                                    { value: 4000, label: '4000' },
                                    { value: 5000, label: '5000' },
                                    { value: 6000, label: '6000' },
                                    { value: 7000, label: '7000' },
                                    { value: 8000, label: '8000' },
                                ]}
                                onChange={(val: number) => {
                                    handleBitrate!(val);
                                }}
                            />
                        </div>


                        <div >
                            分辨率设置：
                            <Select
                                defaultValue={1080}
                                style={{ width: 120 }}
                                options={[
                                    { value: 360, label: '360P' },
                                    { value: 540, label: '540P' },
                                    { value: 720, label: '720P' },
                                    { value: 1080, label: '1080P' },
                                ]}
                                onChange={(val: number) => {
                                    handleResolutionRatio!(val);
                                }}
                            />
                        </div>
                    </div>

                    <Button type='primary' onClick={() => {
                        props.handleLiveStatus()
                    }}>
                        {(props.liveStatus === 0 || props.liveStatus === 2) ? '开始直播' : '关闭直播'}
                    </Button>
                </div>
            </div>
        </>
    )
}

export default BottomTool
