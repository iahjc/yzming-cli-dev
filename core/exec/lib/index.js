'use strict';
const Package = require('@yzming-cli-dev/package')
const path = require('path')

const SETTINGS = {
    init: '@imooc-cli/init'
};

const CACHE_DIR = 'dependencies/';


async function exec() {
    let targetPath = process.env.CLI_TARGET_PATH;
    const homePath = process.env.CLI_HOME_PATH;
    console.log('targetPath：', targetPath);
    console.log('homePath：', homePath);

    let storeDir = '';
    const cmdObj = arguments[arguments.length -1];
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName];
    const packageVersion = 'latest';
    let pkg = '';

    if(!targetPath) {
        targetPath = path.resolve(homePath, CACHE_DIR); // 生成缓存目录
        storeDir = path.resolve(targetPath, 'node_modules');

        pkg = new Package({
            targetPath,
            storeDir,
            packageName,
            packageVersion
        });
    
        if(pkg.exists()) {
            // 更新package
        } else {
            // 安装package
           await pkg.install();
        }
    } else {
        pkg = new Package({
            targetPath,
            packageName,
            packageVersion
        });
    }
    console.log(1)
    const rootFile = pkg.getRootFilePath();
    if(rootFile) {
        require(rootFile).apply(null, arguments);
    }
}

module.exports = exec;
