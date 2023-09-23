
/**
 * requestFileSystem保存文件，成功返回code:1，失败返回code:2
 * @param data
 */
export function saveFile(data: { file: Blob; fileName: string }) {
    return new Promise<{ code: number }>((resolve) => {
        const { file, fileName } = data;
        const requestFileSystem = (window.requestFileSystem || window.webkitRequestFileSystem) as (
            type: number,
            size: number,
            successCallback: (fs: FileSystem) => void,
            errorCallback?: (error: Error) => void
        ) => void
        if (!requestFileSystem) {
            console.error('不支持requestFileSystem');
            resolve({ code: 2 });
            return;
        }
        function onError(err: Error) {
            console.error('saveFile错误', data.fileName);
            console.log(err);
            resolve({ code: 2 });
        }
        function onFs(fs: FileSystem) {
            // 创建文件
            fs.root.getFile(
                fileName,
                { create: true },
                (fileEntry) => {
                    // 创建文件写入流
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = () => {
                            // 完成后关闭文件
                            fileWriter.abort();
                            resolve({ code: 1 });
                        };
                        // 写入文件内容
                        fileWriter.write(file);
                    });
                },
                onError
            );
        }
        // Opening a file system with temporary storage
        requestFileSystem(
            // @ts-ignore
            window.PERSISTENT,
            0,
            onFs,
            onError
        );
    });
}

/**
 * requestFileSystem读取文件，成功返回code:1，失败返回code:2
 * @param data
 */
export const readFile = (fileName: string) => {
    return new Promise<{ code: number; file?: File }>((resolve) => {
        const requestFileSystem = (window.requestFileSystem || window.webkitRequestFileSystem) as (
            type: number,
            size: number,
            successCallback: (fs: FileSystem) => void,
            errorCallback?: (error: Error) => void
        ) => void
        if (!requestFileSystem) {
            console.error('不支持requestFileSystem')
            resolve({ code: 2 })
            return
        }
        const onError = (err: Error) => {
            console.error('readFile错误', fileName)
            console.log(err)
            resolve({ code: 2 })
        }
        const onFs = (fs: FileSystem) => {
            fs.root.getFile(
                fileName,
                {},
                (fileEntry: FileSystem) => {
                    fileEntry.file(
                        (file: File) => {
                            resolve({ code: 1, file })
                        },
                        onError
                    )
                },
                onError
            )
        }
        // Opening a file system with temporary storage
        requestFileSystem(
            window.PERSISTENT,
            0,
            onFs,
            onError
        )
    })
}