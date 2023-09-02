import React, { useEffect, useRef } from 'react'
import { push } from '../service'

import './index.css'

interface VideoProps {
    liveType: 'video' | 'shareScreen'
}

const Video: React.FC<VideoProps> = porps => {

    // 发起的直播类型
    const { liveType } = porps

    const videoRef = useRef<HTMLVideoElement>(null);

    const rtcPeerConnection = new RTCPeerConnection();
    const mediaStream = new MediaStream();



    // 使用webrtc发送数据
    const startScreenSharing = async (stream: MediaProvider) => {
        if (videoRef.current) {
            const tid = 1;
            rtcPeerConnection.addTransceiver("audio", { direction: "sendonly" });
            rtcPeerConnection.addTransceiver("video", { direction: "sendonly" });
            //rtcPeerConnection.addTransceiver("video", {direction: "sendonly"});
            //rtcPeerConnection.addTransceiver("audio", {direction: "sendonly"});

            videoRef.current.srcObject = stream;
            videoRef.current.play();
            // @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream#Migrating_to_addTrack
            stream.getTracks().forEach(function (track: MediaStreamTrack) {
                rtcPeerConnection.addTrack(track);

                // Notify about local track when stream is ok.
                //mediaStream.addTrack(track);
            });

            let offer = await rtcPeerConnection.createOffer();
            await rtcPeerConnection.setLocalDescription(offer);
            // 发送数据
            let session: {
                sdp: string,
            } = await push({
                // 自定义直播token
                token: tid,
                // webrtc规范主要
                streamurl: "webrtc://localhost/live/livestream/1",
                clientip: null,
                sdp: offer.sdp
            })
            
            console.log('=======', session)
            if (session) {
                await rtcPeerConnection.setRemoteDescription(
                    new RTCSessionDescription({ type: 'answer', sdp: session.sdp })
                );
            }

        }

    };


    // 开始直播
    const startLive = async () => {
        if (liveType === 'video') { // 视频直播
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                // 获取用户媒体设备的权限
                const stream = navigator.mediaDevices.getUserMedia({
                    video: true
                })
                startScreenSharing(stream)
            } else {
                // 浏览器不支持 getUserMedia
                alert('浏览器不支持')
            }
        } else if (liveType === 'shareScreen') { // 共享屏幕直播
            const stream = await navigator.mediaDevices.getDisplayMedia();
            startScreenSharing(stream)

        }
    }

    useEffect(() => {
        startLive()
    }, [])

    return (
        <>
            <video ref={videoRef} controls autoPlay={false} style={{ width: '100%', height: '100%' }} />
        </>
    )
}

export default Video
