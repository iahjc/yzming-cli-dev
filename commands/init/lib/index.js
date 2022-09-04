'use strict';

const Command = require('@yzming-cli-dev/command');
const fs = require('fs')
const semver = require('semver');
const inquirer = require('inquirer');
const fse = require('fs-extra');

const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';
const getProjectTemplate = require('./getProjectTemplate');


class InitCommand extends Command {
    init() {
        this.projectName = this._argv[0] || '';
        this.force = !!this._cmd.force;
    }

    async prepare() {
        // 0 判断项目模版是否存在
        const template = await getProjectTemplate();
        if (!template || template.length === 0) {
            throw new Error('项目模版不存在！');
        }

        this.template = template;
        const localPath = process.cwd();
        // 1. 判断当前目录是否为空
        if (!this.isDirEmpty(localPath)) {
            let ifContinue = false;
            if (!this.force) {
                ifContinue = (await inquirer.prompt({
                    type: 'confirm',
                    name: 'ifContinue',
                    default: false,
                    message: '当前文件夹不为空，是否继续创建项目？'
                })).ifContinue;

                if (!ifContinue) {
                    return;
                }
            }

            if (ifContinue || this.force) {
                // 给用户做二次确认
                const { confirmDelete } = await inquirer.prompt({
                    type: 'confirm',
                    name: 'confirmDelete',
                    default: false,
                    message: '是否确认清空当前目录下的文件？'
                });
                if (confirmDelete) {
                    // 清空当前目录
                    fse.emptyDirSync(localPath);
                }
            }
        }

        return this.getProjectInfo();
        // 2. 是否启动强制更新
        // 3. 选择创建项目或者组件
        // 4. 获取项目的基本信息
    }

    downloadTemplate() {
        // 1. 通过项目模版API获取项目模版信息
        // 2. 通过egg.js搭建一套后端心痛
        // 3. 通过npm存储项目模版（vue-cli/vue-element-admin）
        // 4. 将项目模版信息存储到mongodb数据库中
        // 5. 通过egg.js获取mongodb中的数据并且通过API返回
    }

    async getProjectInfo() {
        const projectInfo = {};
        // 1. 选择创建项目或组件
        const { type } = await inquirer.prompt({
            type: 'list',
            name: 'type',
            message: '请选择初始化类型',
            default: TYPE_PROJECT,
            choices: [{
                name: '项目',
                value: TYPE_PROJECT
            }, {
                name: '组件',
                value: TYPE_COMPONENT
            }]
        });
        if (type === TYPE_PROJECT) {
            // 2. 获取项目的基本信息 
            // TODO 项目名称验证不起作用
            const o = await inquirer.prompt([{
                type: 'input',
                name: 'projectName',
                message: '请输入项目名称',
                default: '',
                validate: function (v) {
                    // 1. 输入的首字符和尾字符必须为英文字符
                    // 2. 尾字符必须为英文或数字，不能为字符
                    // 3. 字符仅允许“-_”
                    const done = this.async();
                    setTimeout(function () {
                        if (!(/^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/).test(v)) {
                            done('请输入合法的项目名称');
                            return;
                        }
                        done(null, true);
                    }, 0);
                    return typeof v === 'string';
                },
                filter: function (v) {
                    return v;
                }
            }, {
                type: 'input',
                name: 'projectVersion',
                message: '请输入项目版本号',
                default: '1.0.0',
                validate: function (v) {
                    return !!semver.valid(v);
                },
                filter: function (v) {
                    if (!!semver.valid(v)) {
                        return semver.valid(v);
                    } else {
                        return v;
                    }
                }
            },
            {
                type: 'list',
                name: 'projectTemplate',
                message: '请选择项目模版',
                choices: this.createTemplateChoice()
            }
            ]);
            projectInfo = { type: type, projectName: o.projectName, projectVersion: o.projectVersion };
        } else if (type === TYPE_COMPONENT) {

        }
        // return 项目的基本信息（object）
        return projectInfo;
    }

    isDirEmpty(localPath) {
        let fileList = fs.readdirSync(localPath);
        fileList = fileList.filter(file => {
            return !file.startsWith('.') && ['node_modules'].indexOf(file) < 0;
        });
        return !fileList || fileList.length <= 0;
    }

    async exec() {
        try {
            // 1. 准备阶段
            const projectInfo = await this.prepare();
            this.projectInfo = projectInfo;
            // 2. 下载模版
            this.downloadTemplate();
            // 3. 安装模版
        } catch (e) {
            console.error(e.message);
        }
    }

    createTemplateChoice() {
        return this.template.map(item => ({
            value: item.npmName,
            name: item.name
        }));
    }
}

function init(args) {
    return new InitCommand(args);
}

module.exports = init;
