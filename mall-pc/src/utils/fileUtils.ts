/**
 * requestFileSystem读取文件，成功返回code:1，失败返回code:2
 * @param data
 */
export function readFile(fileName: string) {
    return new Promise<{ code: number; file?: File }>((resolve) => {
      const requestFileSystem =
        // @ts-ignore
        window.requestFileSystem || window.webkitRequestFileSystem;
      if (!requestFileSystem) {
        console.error('不支持requestFileSystem');
        resolve({ code: 2 });
        return;
      }
      function onError(err) {
        console.error('readFile错误', fileName);
        console.log(err);
        resolve({ code: 2 });
      }
      function onFs(fs) {
        fs.root.getFile(
          fileName,
          {},
          (fileEntry) => {
            fileEntry.file(function (file) {
              resolve({ code: 1, file });
            }, onError);
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