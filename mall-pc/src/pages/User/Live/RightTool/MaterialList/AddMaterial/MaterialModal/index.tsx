import React, { useContext } from 'react'
import { Checkbox, ColorPicker, Form, Input, Modal, Select, Slider, Upload } from 'antd'
import { MaterialTypeEnum } from './../interface'
import LiveContext, { LiveContextType, LiveStreamingMaterial } from '../../../../LiveContextProvider'


// 添加素材
const MateralModal: React.FC<{
    open: boolean
    data?: LiveStreamingMaterial
    materialType: string
    close: () => void
}> = props => {

    const { open, data, materialType, close } = props

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

    const [form] = Form.useForm<{ title: string; company: string }>()

    // 处理选择的直播素材
    const genMaterial = () => {
        const length = liveStreamingMaterials.length + 1
        if (data) {
            switch (materialType) {
                case MaterialTypeEnum.CAMERA:
                    form.setFieldsValue(data)
                    return camareMaterial()
                case MaterialTypeEnum.AUDIO:
                    form.setFieldsValue(data)
                    return audioMaterial()
                case MaterialTypeEnum.SCREEN:
                    form.setFieldsValue(data)
                    return screenMaterial()
                case MaterialTypeEnum.PICTURE:
                    form.setFieldsValue(data)
                    return pictureMaterial()
                case MaterialTypeEnum.TEXT:
                    form.setFieldsValue(data)
                    return textMaterial()
                case MaterialTypeEnum.VIDEO:
                    form.setFieldsValue(data)
                    return videoMaterial()
                case MaterialTypeEnum.FOLDER:
                    form.setFieldsValue(data)
                    return folderMaterial()
            }
        } else {
            switch (materialType) {
                case MaterialTypeEnum.CAMERA:
                    form.setFieldValue('title', `摄像头 - ${length}`)
                    return camareMaterial()
                case MaterialTypeEnum.AUDIO:
                    form.setFieldValue('title', `音频 - ${length}`)
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
                    name="camare"
                    rules={[{ required: true, message: '内容为空' }]}
                >
                    <Select
                        defaultValue="lucy"
                        allowClear
                        options={[{ value: 'lucy', label: '微软雅黑' }]}
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
                    name="audio"
                    rules={[{ required: true, message: '内容为空' }]}
                >
                    <Select
                        defaultValue="lucy"
                        allowClear
                        options={[{ value: 'lucy', label: '微软雅黑' }]}
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
                    name="picture"
                >
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    >
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
                            defaultValue="lucy"
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
                        initialValue={12}
                    >
                        <Select
                            style={{ width: 82 }}
                            allowClear
                            options={[
                                { value: 'default', label: '默认' },
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
                        style={{ display: 'inline-block', width: 'calc(32% - 12px)' }}
                        initialValue={0}
                    >
                        <Checkbox value={1}>
                            启用描边
                        </Checkbox>
                    </Form.Item>

                    <Form.Item
                        name="textStrokeColor"
                        style={{ display: 'inline-block', width: 'calc(32% - 12px)' }}
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
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    >
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
                    name="pictures"
                >
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    >
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
                    label="showTime "
                    name="name"
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
                const length = liveStreamingMaterials!.length + 1
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
                            title: fields.title
                        }, type)
                        break
                    case MaterialTypeEnum.AUDIO:
                        handleLiveStreamingMaterials!({
                            id: idVal,
                            type: MaterialTypeEnum.AUDIO,
                            visible: true,
                            title: fields.title
                        }, type)
                        break
                    case MaterialTypeEnum.SCREEN:
                        handleLiveStreamingMaterials!({
                            id: idVal,
                            type: MaterialTypeEnum.SCREEN,
                            visible: true,
                            title: fields.title
                        }, type)
                        break
                    case MaterialTypeEnum.PICTURE:
                        handleLiveStreamingMaterials!({
                            id: idVal,
                            type: MaterialTypeEnum.PICTURE,
                            visible: true,
                            title: fields.title
                        }, type)
                        break
                    case MaterialTypeEnum.TEXT:
                        handleLiveStreamingMaterials!({
                            id: idVal,
                            type: MaterialTypeEnum.TEXT,
                            visible: true,
                            title: fields.title
                        }, type)
                        break
                    case MaterialTypeEnum.VIDEO:
                        handleLiveStreamingMaterials!({
                            id: idVal,
                            type: MaterialTypeEnum.VIDEO,
                            visible: true,
                            title: fields.title
                        }, type)
                        break
                    case MaterialTypeEnum.FOLDER:
                        handleLiveStreamingMaterials!({
                            id: idVal,
                            type: MaterialTypeEnum.FOLDER,
                            visible: true,
                            title: fields.title
                        }, type)
                        break
                }

                form.resetFields()
                close()
            }).catch((e) => {
                console.error(e)
            })
    }

    return (
        <Modal
            open={open}
            title={'添加直播素材'}
            centered={true}
            onOk={() => {
                handleSendtMaterial()

            }}
            onCancel={() => {
                form.resetFields()
                close()
            }}
            okText={'发送'}
            cancelText={'取消'}
        >
            <Form name="material" form={form}>
                {genMaterial()}
            </Form>
        </Modal>
    )
}

export default MateralModal
