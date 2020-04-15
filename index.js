const request = require("request");
const fs = require("fs");
const path = require("path");

/**
 * 判读路径是否存在,如不存在创建文件夹
 * @param pathStr 参数要用path.join()拼接,项目下的相对路径
 * @return projectPath 返回绝对路径,可要可不要
 */
function mkdirPath(pathStr, isDelNotEmpty) {
    let dirs = pathStr.split('/')
    let selfDir = __dirname // 下载到当前文件夹
    dirs.forEach(dir => {
        selfDir = path.join(selfDir, dir)
        if (fs.existsSync(selfDir)) {
            let tempstats = fs.statSync(selfDir);
            if (!(tempstats.isDirectory())) {
                if (isDelNotEmpty) {
                    fs.unlinkSync(selfDir);
                    fs.mkdirSync(selfDir);
                }
            }
        }
        else {
            fs.mkdirSync(selfDir);
        }
    })
    return selfDir;
}

function download(uri, callback) {
    if (uri) {
        // console.log(uri)
        let fileArr = uri.split('/')
        let dirs = fileArr.slice(2, fileArr.length - 1).join('/')
        // 创建文件夹
        mkdirPath(dirs, false)
        let filename = fileArr[fileArr.length - 1]
        if (filename.indexOf('?') > -1) {
            filename = filename.split('?')[0]
        }
        let stream = fs.createWriteStream(path.resolve(dirs, filename));
        request(uri).pipe(stream).on('close', callback);
    }
}


let index = 0
// 需要下载的文件列表
const fileList = [
    'https://c-ssl.duitang.com/uploads/item/201910/24/20191024104001_FSxG8.thumb.100_100_c.jpeg',
    'https://c-ssl.duitang.com/uploads/item/201701/09/20170109201556_xSLrJ.thumb.100_100_c.jpeg',
    'https://c-ssl.duitang.com/uploads/item/202002/06/20200206173506_CQMhm.thumb.100_100_c.jpeg'
]

function callback() {
    if (fileList[index + 1]) {
        index++;
        download(fileList[index], callback)
    }
}
// 下载
download(fileList[index], callback);
