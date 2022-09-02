'use strict';

const pkgDir = require('pkg-dir').sync;
const path = require('path');

const { isObject } = require('@yzming-cli-dev/utils');


class Package {
    constructor(options) {
        if (!options) {
            throw new Error('Package类的options参数不能为空！');
        }

        if (!isObject(options)) {
            throw new Error('Package类的options参数必须为对象！');
        }

        // package的目标路径
        this.targetPath = options.targetPath;
        // package的缓存路径
        this.storePath = options.storePath;
        // package的name
        this.packageName = options.packageName;
        // package的version
        this.packageVersion = options.packageVersion;
    }

    // 判断当前package是否存在
    exists() {

    }
    // 安装package
    install() { }
    // 更新package
    update() { }

    // 获取入口文件的路径
    getRootFilePath() {
        // 1. 获取package.json所在的目录
        const dir = pkgDir(this.targetPath);
        console.log(dir)
        if (dir) {
            // 2. 读取package.json
            const pkgFile = require(path.resolve(dir, 'package.json'));
            // 3. 寻找main/lib
            if (pkgFile && pkgFile.main) {
                // 4. 路径兼容（macOS/windows）
                return path.resolve(dir, pkgFile.main);
            }

        }
        return null;
    }
}



module.exports = Package;
