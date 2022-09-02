'use strict';

function init (projectName, cmdOb) {
    console.log(process.env.CLI_TARGET_PATH);
    console.log('init', projectName, cmdOb.force);
}

module.exports = init;
