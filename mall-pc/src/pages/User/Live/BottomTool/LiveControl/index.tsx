import React, { useContext } from 'react'
import { LiveContext } from '../../LiveContextProvider'
import { Button } from 'antd'

const LiveControl: React.FC = () => {

    const {startLive} = useContext(LiveContext)

    return (
        <Button type='primary' onClick={() => { startLive().then(() => {
            console.log('start live success')
        }).catch((err) => {
            console.log(err)
        }) }}>开始直播</Button>
    )
}

export default LiveControl
