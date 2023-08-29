import React, { useEffect, useRef, useState } from 'react'

import './index.css'
import mpegts from 'mpegts.js'



const Video: React.FC<{
    flvSource: string
}> = props => {

    const { flvSource } = props

    const videoRef = useRef<HTMLCanvasElement>(null)

    const [player, setPlayer] = useState<mpegts.Player>()

    // 创建播放器
    const videoEl = document.createElement('video');

    videoEl.autoplay = true;
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoEl.loop = true;
    videoEl.controls = true;
    videoEl.setAttribute('webkit-playsinline', 'true');
    videoEl.setAttribute('x5-video-player-type', 'h5');
    videoEl.setAttribute('x5-video-player-fullscreen', 'true');
    videoEl.setAttribute('x5-video-orientation', 'portraint');
    videoEl.oncontextmenu = (e) => {
        e.preventDefault();
    };

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
        // 监听全屏
        document.addEventListener('keydown', event => {
            handleFullscreen(event)
        });

    }, [])

    /**
     * 渲染canvas
     */
    const renderCanvas = () => {
        if (videoRef.current) {
            const w = 1066;
            const h = 750;
            videoRef.current.width = w;
            videoRef.current.height = h;
            const ctx = videoRef.current.getContext('2d')!
            ctx.drawImage(videoEl, 0, 0, w, h)
        }
        requestAnimationFrame(renderCanvas)
    }

    useEffect(() => {
        if (flvSource && mpegts.getFeatureList().mseLivePlayback && videoRef && videoRef.current) {
            const playerMpegts = mpegts.createPlayer({
                type: 'flv',  // could also be mpegts, m2ts, flv
                isLive: true,
                url: flvSource
            });


            playerMpegts.attachMediaElement(videoEl);
            playerMpegts.load();
            const play = playerMpegts.play()

            renderCanvas()
            setPlayer(playerMpegts);
        }
    }, [flvSource])

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
            {/* <video controls autoPlay={false} ref={videoRef} style={{ width: '100%', height: '100%' }} /> */}
            <canvas ref={videoRef}></canvas>
        </>
    )
}

export default Video
