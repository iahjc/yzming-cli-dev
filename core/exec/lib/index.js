'use strict';
const Package = require('@yzming-cli-dev/package')

const SETTINGS = {
    init: '@yzming-cli-dev/init'
};


function exec() {
    const targetPath = process.env.CLI_TARGET_PATH;
    console.log('targetPath', targetPath);
    const homePath = process.env.CLI_HOME_PATH;
    console.log('homePath', homePath);

    const cmdObj = arguments[arguments.length -1];
    const cmdName = cmdObj.name();
    const packageName = SETTINGS[cmdName];
    const packageVersion = 'latest';

    const pkg = new Package({
        targetPath,
        packageName,
        packageVersion
    });
    pkg.getRootFilePath();
    console.log(process.env.CLI_HOME_PATH)
}

module.exports = exec;
