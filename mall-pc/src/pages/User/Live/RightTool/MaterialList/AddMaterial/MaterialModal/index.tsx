import React, { useContext, useEffect, useState } from 'react'
import { Button, Checkbox, ColorPicker, Form, Input, Modal, Select, Slider, Upload, UploadFile, message } from 'antd'
import { MaterialTypeEnum } from './../interface'
import LiveContext, { LiveContextType, LiveStreamingMaterial } from '../../../../LiveContextProvider'
import { UploadOutlined } from '@ant-design/icons'
import { Color } from 'antd/lib/color-picker'


// 添加素材
const MateralModal: React.FC<{
    open: boolean
    data?: LiveStreamingMaterial
    materialType: string
    close: () => void
}> = props => {

    const { open, data, materialType, close } = props

    const [messageApi, contextHolder] = message.useMessage()

    const formItemLayout = {
        labelCol: {
            sm: { span: 6 },
        },
        wrapperCol: {
            sm: { span: 16 },
        },
    }

    const {
        liveStreamingMaterials,
        handleLiveStreamingMaterials
    } = useContext(LiveContext as React.Context<LiveContextType>)

    // 摄像头/音频设备列表
    const [inputOptions, setInputOptions] = useState<{
        label: string
        value: string
    }[]>([])

    const [form] = Form.useForm<{
        // 不透明度
        opacity?: number

        title: string
        // 内容
        text?: string
        // 字体
        fontFamily?: string
        // 字体大小
        fontSize?: number
        // 字体风格
        fontStyle?: "normal" | "italic" | "weight" | "italicAndWeight"
        // 字体颜色
        color?: string | Color
        // 是否开启描边
        textStroke?: [boolean]
        // 描边颜色
        textStrokeColor?: string | Color
        // 描边大小
        textStrokeWeight?: number


        // 图片地址
        picture?: {
            file: File,
            fileList: UploadFile[]
        }
        // 动画效果
        animation?: string
        // 放映时间
        showTime?: number
        // 过渡时间
        transitionTime?: number

        // 媒体地址
        video?: {
            file: File,
            fileList: UploadFile[]
        }

        // 摄像头/麦克风ID
        deviceId?: string
    }>()

    // 初始化
    const init = async () => {
        if (materialType === MaterialTypeEnum.CAMERA) {
            const enumerateDevices = await navigator.mediaDevices.enumerateDevices()
            const mediaDevices: {
                label: string
                value: string
            }[] = []
            enumerateDevices.forEach((item) => {
                if (item.kind === 'videoinput' && item.deviceId !== 'default') {
                    mediaDevices.push({
                        label: item.label,
                        value: item.deviceId,
                    })
                }
            })
            if (mediaDevices.length === 0) {
                void messageApi.open({
                    type: 'warning',
                    content: '设备列表为空，请检查该设备权限是否打开 _(•̀ᴗ•́ 」∠ ❀)_',
                })
                return
            }
            setInputOptions(mediaDevices)
        } else if (materialType === MaterialTypeEnum.AUDIO) {
            const enumerateDevices = await navigator.mediaDevices.enumerateDevices()
            const mediaDevices: {
                label: string
                value: string
            }[] = []
            enumerateDevices.forEach((item) => {
                if (item.kind === 'audioinput' && item.deviceId !== 'default') {
                    mediaDevices.push({
                        label: item.label,
                        value: item.deviceId,
                    })
                }
            })

            if (mediaDevices.length === 0) {
                void messageApi.open({
                    type: 'warning',
                    content: '设备列表为空，请检查该设备权限是否打开 _(•̀ᴗ•́ 」∠ ❀)_',
                })
                return
            }
            setInputOptions(mediaDevices)
        }
    }

    useEffect(() => {
        init().catch(e => {
            console.log(e)
        })
    }, [materialType])

    // 处理选择的直播素材
    const genMaterial = () => {
        const length = liveStreamingMaterials ? liveStreamingMaterials.length + 1 : 1
        if (data) {
            switch (materialType) {
                case MaterialTypeEnum.CAMERA:
                    form.setFieldsValue({
                        title: data.title,
                        deviceId: data.deviceId
                    })
                    return camareMaterial()
                case MaterialTypeEnum.AUDIO:
                    form.setFieldsValue({
                        title: data.title,
                        deviceId: data.deviceId
                    })
                    return audioMaterial()
                case MaterialTypeEnum.SCREEN:
                    form.setFieldsValue({
                        title: data.title
                    })
                    return screenMaterial()
                case MaterialTypeEnum.PICTURE:
                    console.log('=============', data.imageInfo?.picture)
                    form.setFieldsValue({
                        ...data.imageInfo,
                        title: data.title,
                        picture: data.imageInfo?.picture.fileList
                    })
                    return pictureMaterial()
                case MaterialTypeEnum.TEXT:
                    form.setFieldsValue({
                        ...data.textInfo,
                        title: data.title
                    })
                    return textMaterial()
                case MaterialTypeEnum.VIDEO:
                    form.setFieldsValue({
                        ...data.videoInfo,
                        title: data.title,
                        picture: data.imageInfo?.picture.fileList
                    })
                    return videoMaterial()
                case MaterialTypeEnum.FOLDER:
                    form.setFieldsValue({
                        title: data.title,
                        picture: data.imageInfo?.picture.fileList
                    })
                    return folderMaterial()
            }
        } else {
            switch (materialType) {
                case MaterialTypeEnum.CAMERA:
                    form.setFieldsValue({
                        title: `摄像头 - ${length}`,
                        deviceId: inputOptions[0] ? inputOptions[0].value : undefined
                    })
                    return camareMaterial()
                case MaterialTypeEnum.AUDIO:
                    form.setFieldsValue({
                        title: `音频 - ${length}`,
                        deviceId: inputOptions[0] ? inputOptions[0].value : undefined
                    })
                    return audioMaterial()
                case MaterialTypeEnum.SCREEN:
                    form.setFieldValue('title', `屏幕 - ${length}`)
                    return screenMaterial()
                case MaterialTypeEnum.PICTURE:
                    form.setFieldValue('title', `图片 - ${length}`)
                    return pictureMaterial()
                case MaterialTypeEnum.TEXT:
                    form.setFieldValue('title', `文本 - ${length}`)
                    return textMaterial()
                case MaterialTypeEnum.VIDEO:
                    form.setFieldValue('title', `视频 - ${length}`)
                    return videoMaterial()
                case MaterialTypeEnum.FOLDER:
                    form.setFieldValue('title', `文件夹 - ${length}`)
                    return folderMaterial()
            }
        }

    }

    // 摄像头组件
    const camareMaterial = () => {
        return (
            <>
                <Form.Item
                    {...formItemLayout}
                    label="设备选择"
                    name="deviceId"
                    rules={[{ required: true, message: '设备为空' }]}
                >
                    <Select
                        allowClear
                        options={inputOptions}
                    />
                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    label="来源命名"
                    name="title"
                    rules={[{ required: true, message: '来源命名不能为空' }]}
                >
                    <Input placeholder="来源命名" />
                </Form.Item>
            </>
        )
    }

    // 音频组件
    const audioMaterial = () => {
        return (
            <>
                <Form.Item
                    {...formItemLayout}
                    label="设备选择"
                    name="deviceId"
                    rules={[{ required: true, message: '设备为空' }]}
                >
                    <Select
                        allowClear
                        options={inputOptions}
                    />
                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    label="来源命名"
                    name="title"
                    rules={[{ required: true, message: '来源命名不能为空' }]}
                >
                    <Input placeholder="来源命名" />
                </Form.Item>
            </>
        )
    }

    // 窗口组件
    const screenMaterial = () => {
        return (
            <>
                <Form.Item
                    {...formItemLayout}
                    label="来源命名"
                    name="title"
                    rules={[{ required: true, message: '来源命名不能为空' }]}
                >
                    <Input placeholder="来源命名" />
                </Form.Item>
            </>
        )
    }

    // 图片组件
    const pictureMaterial = () => {
        return (
            <>
                <Form.Item
                    {...formItemLayout}
                    label="来源命名"
                    name="title"
                    rules={[{ required: true, message: '来源命名不能为空' }]}
                >
                    <Input placeholder="来源命名" />
                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    label="添加本地图片"
                    rules={[{ required: true, message: '请选择文件' }]}
                    name="picture"
                >
                    <Upload
                        accept='.jpg,.jpeg,.png,.gif'
                        name="file"
                        multiple={false}
                        beforeUpload={() => false}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>选择文件</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    label="不透明度"
                    name="opacity"
                    initialValue={100}
                >
                    <Slider
                        min={1}
                        max={100}
                    />
                </Form.Item>
            </>
        )
    }

    // 文字组件
    const textMaterial = () => {
        return (
            <>
                <Form.Item
                    {...formItemLayout}
                    label="来源命名"
                    name="title"
                    rules={[{ required: true, message: '来源命名不能为空' }]}
                >
                    <Input placeholder="来源命名" />
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label="内容"
                    name="text"
                    rules={[{ required: true, message: '内容为空' }]}
                >
                    <Input.TextArea placeholder="内容" />
                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    label="字体样式"
                >
                    <Form.Item
                        name="fontFamily"
                        style={{ display: 'inline-block', width: 'calc(35% - 5px)' }}
                        initialValue={'Microsoft YaHei'}
                    >
                        <Select
                            style={{ width: 95 }}
                            allowClear
                            options={[{ value: 'Microsoft YaHei', label: '微软雅黑' }]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="fontSize"
                        style={{ display: 'inline-block', width: 'calc(22% - 5px)' }}
                        initialValue={32}
                    >
                        <Select
                            style={{ width: 55 }}
                            allowClear
                            options={[
                                { value: 12, label: '12' },
                                { value: 14, label: '14' },
                                { value: 16, label: '16' },
                                { value: 18, label: '18' },
                                { value: 20, label: '20' },
                                { value: 24, label: '24' },
                                { value: 28, label: '28' },
                                { value: 32, label: '32' },
                                { value: 36, label: '36' },
                                { value: 40, label: '40' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="fontStyle"
                        style={{ display: 'inline-block', width: 'calc(30% - 5px)' }}
                        initialValue={'normal'}
                    >
                        <Select
                            style={{ width: 82 }}
                            allowClear
                            options={[
                                { value: 'normal', label: '默认' },
                                { value: 'italic', label: '斜体' },
                                { value: 'weight', label: '粗体' },
                                { value: 'italicAndWeight', label: '粗斜体' }
                            ]}
                        />
                    </Form.Item>
                    <Form.Item
                        name="color"
                        style={{ display: 'inline-block', width: 'calc(13% - 5px)' }}
                        initialValue={'#ffffff'}
                    >
                        <ColorPicker />
                    </Form.Item>
                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    label="描边"
                >
                    <Form.Item
                        name="textStroke"
                        style={{ display: 'inline-block', width: 'calc(35% - 12px)' }}
                        initialValue={[false]}
                    >
                        <Checkbox.Group>
                            <Checkbox value={true}>
                                启用描边
                            </Checkbox>
                        </Checkbox.Group>

                    </Form.Item>

                    <Form.Item
                        name="textStrokeColor"
                        style={{ display: 'inline-block', width: 'calc(29% - 12px)' }}
                        initialValue={'#ffffff'}
                    >
                        <ColorPicker />
                    </Form.Item>

                    <Form.Item
                        name="textStrokeWeight"
                        initialValue={2}
                    >
                        <Slider
                            min={1}
                            max={20}
                        />
                    </Form.Item>
                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    label="不透明度"
                    name="opacity"
                    initialValue={100}
                >
                    <Slider
                        min={1}
                        max={100}
                        value={0}
                    />
                </Form.Item>
            </>
        )
    }

    // 媒体组件
    const videoMaterial = () => {
        return (
            <>
                <Form.Item
                    {...formItemLayout}
                    label="来源命名"
                    name="title"
                    rules={[{ required: true, message: '来源命名不能为空' }]}
                >
                    <Input placeholder="来源命名" />
                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    label="多媒体文件"
                    name="video"
                >
                    <Upload
                        accept='.mp4,.avi,.mov'
                        name="file"
                        multiple={false}
                        beforeUpload={() => false}
                        maxCount={1}
                    >
                        <Button icon={<UploadOutlined />}>选择文件</Button>
                    </Upload>
                </Form.Item>
            </>
        )
    }

    // 相册组件
    const folderMaterial = () => {
        return (
            <>
                <Form.Item
                    {...formItemLayout}
                    label="来源命名"
                    name="title"
                    rules={[{ required: true, message: '来源命名不能为空' }]}
                >
                    <Input placeholder="来源命名" />
                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    label="添加本地图片"
                    rules={[{ required: true, message: '请选择文件' }]}
                    name="pictures"
                >
                    <Upload
                        accept='.jpg,.jpeg,.png,.gif'
                        name="file"
                        multiple={true}
                        beforeUpload={() => false}
                    >
                        <Button icon={<UploadOutlined />}>选择文件</Button>
                    </Upload>
                </Form.Item>


                <Form.Item
                    {...formItemLayout}
                    label="动画效果"
                    name="animation"
                    initialValue={'fade'}
                >
                    <Select
                        style={{ width: 100 }}
                        allowClear
                        options={[
                            { value: 'fade', label: '淡入淡出' },
                            { value: 'toLeft', label: '向左滑动' },
                            { value: 'toRight', label: '向左退出' }
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    label="放映时间"
                    name="showTime"
                    initialValue={3000}
                >
                    <Slider
                        min={100}
                        max={10000}
                    />
                </Form.Item>

                <Form.Item
                    {...formItemLayout}
                    label="过渡时间"
                    name="transitionTime"
                    initialValue={1000}
                >
                    <Slider
                        min={100}
                        max={10000}
                    />
                </Form.Item>
            </>
        )
    }

    // 发送素材
    const handleSendtMaterial = () => {
        form.validateFields()
            .then((fields) => {
                let type: 'add' | 'update' = 'add'
                if (data) {
                    type = 'update'
                }
                const length = liveStreamingMaterials ? liveStreamingMaterials.length + 1 : 1
                let idVal: number = length
                if (type === 'update') {
                    idVal = data!.id
                }
                switch (materialType) {
                    case MaterialTypeEnum.CAMERA:
                        handleLiveStreamingMaterials!({
                            id: idVal,
                            type: MaterialTypeEnum.CAMERA,
                            visible: true,
                            rect: {
                                top: 0,
                                left: 0
                            },
                            title: fields.title,
                            deviceId: fields.deviceId
                        }, type)
                        break
                    case MaterialTypeEnum.AUDIO:
                        handleLiveStreamingMaterials!({
                            id: idVal,
                            type: MaterialTypeEnum.AUDIO,
                            visible: true,
                            rect: {
                                top: 0,
                                left: 0
                            },
                            title: fields.title,
                            deviceId: fields.deviceId
                        }, type)
                        break
                    case MaterialTypeEnum.SCREEN:
                        handleLiveStreamingMaterials!({
                            id: idVal,
                            type: MaterialTypeEnum.SCREEN,
                            visible: true,
                            rect: {
                                top: 0,
                                left: 0
                            },
                            title: fields.title
                        }, type)
                        break
                    case MaterialTypeEnum.PICTURE:
                        handleLiveStreamingMaterials!({
                            id: idVal,
                            type: MaterialTypeEnum.PICTURE,
                            visible: true,
                            rect: {
                                top: 0,
                                left: 0
                            },
                            title: fields.title,
                            imageInfo: {
                                // 图片地址
                                picture: fields.picture!,
                                // 不透明度
                                opacity: fields.opacity!,
                            }
                        }, type)
                        break
                    case MaterialTypeEnum.TEXT:
                        if (typeof fields.color === 'object') {
                            fields.color = fields.color.toHexString()
                        }
                        if (typeof fields.textStrokeColor === 'object') {
                            fields.textStrokeColor = fields.textStrokeColor.toHexString()
                        }
                        handleLiveStreamingMaterials!({
                            id: idVal,
                            type: MaterialTypeEnum.TEXT,
                            visible: true,
                            rect: {
                                top: 0,
                                left: 0
                            },
                            title: fields.title,
                            textInfo: {
                                // 内容
                                text: fields.text!,
                                // 字体
                                fontFamily: fields.fontFamily!,
                                // 字体大小
                                fontSize: fields.fontSize!,
                                // 字体风格
                                fontStyle: fields.fontStyle!,
                                // 字体颜色
                                color: fields.color!,
                                // 是否开启描边
                                textStroke: fields.textStroke![0],
                                // 描边颜色
                                textStrokeColor: fields.textStrokeColor!,
                                // 描边大小
                                textStrokeWeight: fields.textStrokeWeight!,
                                // 不透明度
                                opacity: fields.opacity!
                            }
                        }, type)
                        break
                    case MaterialTypeEnum.VIDEO:
                        handleLiveStreamingMaterials!({
                            id: idVal,
                            type: MaterialTypeEnum.VIDEO,
                            visible: true,
                            rect: {
                                top: 0,
                                left: 0
                            },
                            title: fields.title,
                            videoInfo: {
                                // 媒体地址
                                video: fields.video!
                            }
                        }, type)
                        break
                    case MaterialTypeEnum.FOLDER:
                        
                        handleLiveStreamingMaterials!({
                            id: idVal,
                            type: MaterialTypeEnum.FOLDER,
                            visible: true,
                            rect: {
                                top: 0,
                                left: 0
                            },
                            title: fields.title,
                            imageInfo: {
                                // 图片地址
                                picture: fields.picture!,
                                // 不透明度
                                opacity: fields.opacity!,
                                // 动画效果
                                animation: fields.animation!,
                                // 放映时间
                                showTime: fields.showTime!,
                                // 过渡时间
                                transitionTime: fields.transitionTime!,
                            }
                        }, type)
                        break
                }
                handleClose()
            }).catch((e) => {
                console.error(e)
            })
    }

    const handleClose = () => {
        form.resetFields()
        setInputOptions([])
        close()
    }

    return (
        <>
            <Modal
                open={open}
                title={'添加直播素材'}
                centered={true}
                onOk={() => {
                    handleSendtMaterial()
                }}
                onCancel={() => {
                    handleClose()
                }}
                okText={'发送'}
                cancelText={'取消'}
            >
                <Form
                    name="material"
                    form={form}
                >
                    {genMaterial()}
                </Form>
            </Modal>
            {contextHolder}
        </>
    )
}

export default MateralModal
