import React, { useEffect, useRef, useState } from 'react'

import './index.css'
import mpegts from 'mpegts.js'

const Video: React.FC = () => {

    const videoRef = useRef<HTMLVideoElement>(null)

    const [player, setPlayer] = useState<mpegts.Player>()

    /**
     * 全屏播放
     * @param event 
     */
    const handleFullscreen = (event: KeyboardEvent) => {
        if (event.key === 'f' || event.key === 'F') {
            if (videoRef.current?.requestFullscreen) {
                if (document.fullscreenElement) {
                    document.exitFullscreen().then(() => {
                        console.log('Exited fullscreen mode');
                    }).catch(error => {
                        console.error('Error exiting fullscreen:', error);
                    });
                } else {
                    videoRef.current?.requestFullscreen().then(() => {
                        console.log('Entered fullscreen mode');
                    })
                        .catch(error => {
                            console.error('Error entering fullscreen:', error);
                        });
                }

            }
        }
    }

    useEffect(() => {
        if (mpegts.getFeatureList().mseLivePlayback && videoRef && videoRef.current) {
            const playerMpegts = mpegts.createPlayer({
                type: 'flv',  // could also be mpegts, m2ts, flv
                isLive: true,
                url: 'https://sf1-hscdn-tos.pstatp.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv'
            });
            playerMpegts.attachMediaElement(videoRef.current);
            playerMpegts.load();


            setPlayer(playerMpegts);
        }

        // 监听全屏
        document.addEventListener('keydown', event => {
            handleFullscreen(event)
        });

    }, [])

    useEffect(() => {
        // 关闭页面需要销毁
        // return () => {
        //     if (player) {
        //         player.destroy();
        //     }
        // };
    }, [player])


    return (
        <>
            <video controls autoPlay={false} ref={videoRef} style={{ width: '100%', height: '100%' }} />
        </>
    )
}

export default Video
