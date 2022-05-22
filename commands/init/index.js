import Command from '@wukn/command'
import logGe from '@wukn/log'
import fs from 'fs'
import fse from 'fs-extra'
import { Package } from '@wukn/package'
import semver from 'semver'
import inquirer from 'inquirer'
import request from '@wukn/request'
import { resolve } from 'path'
import { loading } from '@wukn/utils'
const logInit = logGe('command:init')
class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0]
    this.options = this._argv[1] // this._cmd.opts()
    logInit.info(this.projectName, this.options)
  }

  async exec() {
    try {
      // 1.准备阶段
      await this.prepare()
      this.downLoadTemplate()
      // 2.下载模板
      // 3.安装模板
    } catch (e) {
      logInit.error(e.message)
    }
  }

  async downLoadTemplate() {
    // Package
    const { projectTemplate } = this.projectInfo
    const targetPath = resolve(process.env.WK_HOME_PATH, 'template')
    const options = {
      targetPath,
      storePath: resolve(targetPath, 'node_modules'),
      packageName: projectTemplate.npmName,
      packageVersion: projectTemplate.version,
    }
    const pkg = new Package(options)
    try {
      logInit.info(pkg)
      if (await pkg.exits()) {
        let stop = loading()
        pkg.update()
        stop()
        stop = null
      } else {
        let stop = loading()
        await pkg.install()
        stop()
        stop = null
      }
    } catch (e) {
    } finally {
      //
    }
    // await this.getProjectTemplate()
    // 1.1 通过eggjs搭建后端服务
    // 1.2 通过npm存储存储项目模板
    // 1.3 将项目模板信息存储到数据库中
    // 1.4 通过eggjs获取数据库数据并通过api返回
  }

  async prepare() {
    // 1. 通过项目模板API获取项目模板信息
    await this.getProjectTemplate()
    // 1. 判断执行命令的目录是否为空
    const cwd = process.cwd()
    if (!this.isDirEmpty(cwd)) {
      // 2. 是否启动强制更新
      const { isClean } = await inquirer.prompt({
        type: 'comfirm',
        name: 'isClean',
        default: false,
        message: '当前文件夹不为空，是否继续创建项目???',
      })
      if (isClean) {
        // 1.2 情况当前目录
        // TODO
        // fse.emptyDirSync(cwd)
      } else {
        process.exit(1)
      }
    }
    // 3. 选择创建项目或组件
    // 4. 获取项目基本信息
    this.projectInfo = await this.createProjectInfo()
  }

  isDirEmpty(cwd) {
    const fl = fs.readdirSync(cwd)
    return fl.length === 0
  }

  async createProjectInfo() {
    // 1. 选择创建项目或组件
    let ret = {}
    const { type } = await inquirer.prompt({
      type: 'list',
      name: 'type',
      message: '请选择初始化类型',
      default: 'project',
      choices: [
        {
          name: '项目',
          value: 'project',
        },
        {
          name: '组件',
          value: 'compoment',
        },
      ],
    })
    if (type === 'project') {
      // 项目信息
      const obj = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: '请输入项目名称',
          default: '',
          validate: (v) => {
            // 1.首字符必须为英文
            // 2.尾字符必须为英文或数字
            // 3.字符仅允许'-_'
            // 见测试
            return /^[a-zA-Z]+(_[a-zA-Z0-9]+|[a-zA-Z0-9]*)*$/.test(v)
          },
        },
        {
          type: 'input',
          name: 'projectVersion',
          message: '请输入项目版本号',
          default: '1.0.0',
          validate: function (v) {
            const done = this.async()
            setTimeout(() => {
              if (!semver.valid(v)) {
                done('请输入合法的版本号')
                return
              }
              done(null, true)
            }, 0)
          },
          filter: (v) => {
            if (semver.valid(v)) {
              return semver.valid(v)
            } else {
              return v
            }
          },
        },
        {
          type: 'list',
          name: 'projectTemplate',
          message: '请选择项目模板',
          choices: this.generateTemplateChoice(),
        },
      ])
      ret = {
        type,
        ...obj,
      }
    } else if (type === 'compoment') {
      // 组件信息
    }
    // 2. 获取项目基本信息
    return ret
  }

  async getProjectTemplate() {
    const templateInfo = await request('/project/template')
    this.templateInfo = templateInfo
  }

  generateTemplateChoice() {
    return this.templateInfo.map((element) => ({
      value: element,
      name: element.name,
    }))
  }
}

function init(argv) {
  return new InitCommand(argv)
}
export default init
