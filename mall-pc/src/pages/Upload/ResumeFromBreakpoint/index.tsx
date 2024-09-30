import { Button, Divider, Upload, message } from 'antd'
import axios from 'axios';
import React, { useState } from 'react'

const ResumeFromBreakpoint: React.FC = () => {

    const [fileList, setFileList] = useState([]);
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunk size

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 文件上传成功`);
            setFileList([...info.fileList]);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
        }
    };

    const uploadFile = async (file) => {

        // 申请上传
        const formDataInit = new FormData();
        formDataInit.append('originalName', file.name);
        formDataInit.append('breakpointStatus', 'init')

        const dataInit = await axios.post('http://127.0.0.1:8080/file/upload-form-breakpoint', formDataInit, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'authorization': 'bearer ac40db51-08e2-4d9b-a77d-f141c37dc4ed'
            },
        });

        console.log('=====返回数据=====', dataInit)


        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        let uploadedChunks = 0;
        console.log('========需要上传块数量=====', totalChunks)

        const partEtagList = []
        console.log('========uploadId==========', dataInit?.data.data.uploadId)
        for (let i = 0; i < totalChunks; i++) {
            const chunk = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
            const formData = new FormData();
            formData.append('park', chunk);
            // 块的序号必须要是1头
            formData.append('parkNumber', i + 1);
            //formData.append('totalChunks', totalChunks);
            formData.append('uploadId', dataInit.data.data.uploadId);
            formData.append('fileId', dataInit.data.data.fileId)
            formData.append('breakpointStatus', 'upload')


            console.log('=============上传文件', file)
            console.log('=============上传块', chunk)

            try {

                // http://127.0.0.1:8080/file/upload-form-breakpoint
                const dataPark = await axios.post('http://127.0.0.1:8080/file/upload-form-breakpoint', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'authorization': 'bearer ac40db51-08e2-4d9b-a77d-f141c37dc4ed'
                    },
                });
                partEtagList.push({
                    etag: dataPark.data.data.partEtag.etag,
                    partNumber: dataPark.data.data.partEtag.partNumber
                })
                uploadedChunks++;
                message.info(`Chunk ${i + 1}/${totalChunks} uploaded`);
            } catch (error) {
                message.error(`Error uploading chunk ${i + 1}`);
                break; // Stop on error; you can implement a retry mechanism here
            }
        }

        console.log('=======partEtagList========', partEtagList)

        // 申请合并
        const formDataMerge = new FormData();
        formDataMerge.append('fileId', dataInit.data.data.fileId)
        formDataMerge.append('uploadId', dataInit.data.data.uploadId);
        partEtagList.forEach((partEtag, index) => {
            formDataMerge.append(`partEtagList[${index}].etag`, partEtag.etag);
            formDataMerge.append(`partEtagList[${index}].partNumber`, partEtag.partNumber);
        });
        
        formDataMerge.append('breakpointStatus', 'merge')

        await axios.post('http://127.0.0.1:8080/file/upload-form-breakpoint', formDataMerge, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'authorization': 'bearer ac40db51-08e2-4d9b-a77d-f141c37dc4ed'
            },
        });

        if (uploadedChunks === totalChunks) {
            message.success(`${file.name} uploaded successfully!`);
        }
    };

    const beforeUpload = (file) => {
        setFileList([file]); // Reset the file list to the new file
        uploadFile(file);
        return false; // Prevent automatic upload
    };

    return (
        <>
            <Divider />

            <Upload
                beforeUpload={beforeUpload}
                onChange={handleChange}
                fileList={fileList}
                showUploadList={false}
            >
                <Button type="primary">选择文件</Button>
            </Upload>
        </>
    )
}

export default ResumeFromBreakpoint