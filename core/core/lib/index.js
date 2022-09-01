'use strict';

module.exports = core;
// require 支持的类型 .js/.json/.node
// .js -> module.exports/exports
// .json -> JSON.parse
// .node -> C++ process.dlopen
// 其他所有文件 会以.js文件处理
const pkg = require('../package.json');
const log = require('@yzming-cli-dev/log');

function core() {
    checkPkgVersion();
}

function checkPkgVersion() {
    console.log(pkg.version);
    log()
}