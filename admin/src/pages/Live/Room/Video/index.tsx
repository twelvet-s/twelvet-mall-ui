import React, { useEffect, useRef } from 'react'
import { push } from '../service'

import './index.css'


const Video: React.FC = () => {


    const videoRef = useRef<HTMLVideoElement>(null);

    const rtcPeerConnection = new RTCPeerConnection();
    //const mediaStream = new MediaStream();


    // 使用webrtc发送数据
    const startScreenSharing = async (stream: MediaStream) => {
        if (videoRef.current) {
            rtcPeerConnection.addTransceiver("audio", { direction: "sendonly" });
            rtcPeerConnection.addTransceiver("video", { direction: "sendonly" });

            // 本地播放
            videoRef.current.srcObject = stream;
            videoRef.current.play();

            // 添加流
            // @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream#Migrating_to_addTrack
            stream.getTracks().forEach(function (track: MediaStreamTrack) {
                rtcPeerConnection.addTrack(track);

                // Notify about local track when stream is ok.
                //mediaStream.addTrack(track);
            });

            const offer = await rtcPeerConnection.createOffer();

            await rtcPeerConnection.setLocalDescription(offer);

            // 发送数据
            const session: {
                sdp: string,
            } = await push({
                sdp: offer.sdp
            })

            if (session) {
                await rtcPeerConnection.setRemoteDescription(
                    new RTCSessionDescription({ type: 'answer', sdp: session.sdp })
                );
            }

        }

    };


    // 开始直播
    const startLive = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // 获取用户媒体设备的权限
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true
            })
            startScreenSharing(stream)
        } else {
            // 浏览器不支持 getUserMedia，开启共享桌面直播
            const stream = await navigator.mediaDevices.getDisplayMedia();
            startScreenSharing(stream)
        }
    }

    useEffect(() => {
        startLive()
    }, [])

    return (
        <>
            <video ref={videoRef} autoPlay={false} style={{ width: '100%', height: '100%' }} />
        </>
    )
}

export default Video
