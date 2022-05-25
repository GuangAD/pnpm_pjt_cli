import Command from '@wukn/command'
import logGe from '@wukn/log'
import fs from 'fs'
import fse from 'fs-extra'
import { Package } from '@wukn/package'
import semver from 'semver'
import inquirer from 'inquirer'
import request from '@wukn/request'
import path, { resolve } from 'path'
import { loading } from '@wukn/utils'
import ejs from 'ejs'
import glob from 'glob'
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
      // 2.下载模板
      await this.downLoadTemplate()
      // 3.安装模板
      await this.installTemplate()
    } catch (e) {
      logInit.error(e.message)
    }
  }

  async installTemplate() {
    logInit.info(this.projectInfo)
    if (this.projectInfo.projectTemplate) {
      if (!this.projectInfo.projectTemplate.type) {
        this.projectInfo.projectTemplate.type = 'normal'
      }
      if (this.projectInfo.projectTemplate.type === 'normal') {
        await this._installNormalTemplate()
      } else if (this.projectInfo.projectTemplate.type === 'custom') {
        await this._installCustomTemplate()
      } else {
        throw new Error('无法识别的项目模板')
      }
    } else {
      throw new Error('项目模板信息不存在')
    }
  }

  async _ejsRander(ignore) {
    return new Promise((resolve, reject) => {
      const dir = process.cwd()
      glob(
        '**',
        {
          cwd: dir,
          ignore,
          nodir: true,
        },
        (error, file) => {
          if (error) {
            reject(error)
          } else {
            Promise.all(
              file.map((file) => {
                const filepath = path.resolve(dir, file)
                console.log(filepath)
                ejs.renderFile(filepath, {}, {}, (error, result) => {
                  // 拿到结果后，重写
                  if (!error) {
                    fse.writeFileSync(filepath, result)
                  }
                })
                return null
              })
            )
              .then(() => {
                resolve()
              })
              .catch((err) => {
                reject(err)
              })
          }
        }
      )
    })
  }

  async _installNormalTemplate() {
    logInit.info(this.templatePkg.chcheFilePath)
    const templatePath = resolve(this.templatePkg.chcheFilePath, 'template')
    const targetPath = process.cwd()
    fse.ensureDirSync(templatePath)
    fse.ensureDirSync(targetPath)
    // 拷贝
    fse.copySync(templatePath, targetPath)
    const ignores = ['node_modules/**']
    this._ejsRander(ignores)
    //  安装命令
    if (this.projectInfo.projectTemplate.installCommand) {
      console.log('run ', this.projectInfo.projectTemplate.installCommand)
    } else {
      console.log('run npm install')
    }
    //  启动命令
    if (this.projectInfo.projectTemplate.startCommand) {
      console.log('run', this.projectInfo.projectTemplate.startCommand)
    }
    // {
    //   type: 'project',
    //   projectName: 'y',
    //   projectVersion: '1.0.0',
    //   projectTemplate: {
    //     name: 'Vue3 标准项目模板',
    //     npmName: '@imooc-cli/vue3-standard-template',
    //     version: '1.0.0',
    //     type: 'normal',
    //     startCommand: 'npm run serve',
    //     ignore: [ '**/public/**' ],
    //     tag: [ 'project' ],
    //     buildPath: 'dist'
    //   }
    // }
  }

  async _installCustomTemplate() {}

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
      if (await pkg.exits()) {
        let stop = loading()
        await pkg.update()
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
      this.templatePkg = pkg
    }
    // 1.1 通过eggjs搭建后端服务
    // 1.2 通过npm存储存储项目模板
    // 1.3 将项目模板信息存储到数据库中
    // 1.4 通过eggjs获取数据库数据并通过api返回
  }

  async prepare() {
    // 1. 通过项目模板API获取项目模板信息
    await this._getProjectTemplate()
    // 1. 判断执行命令的目录是否为空
    const cwd = process.cwd()
    if (!this._isDirEmpty(cwd)) {
      // 2. 是否启动强制更新
      const { isClean } = await inquirer.prompt({
        type: 'comfirm',
        name: 'isClean',
        default: false,
        message: '当前文件夹不为空，是否继续创建项目???',
      })
      if (isClean) {
        // 1.2 情况当前目录
        fse.emptyDirSync(cwd)
      } else {
        process.exit(1)
      }
    }
    // 3. 选择创建项目或组件
    // 4. 获取项目基本信息
    this.projectInfo = await this._createProjectInfo()
  }

  _isDirEmpty(cwd) {
    const fl = fs.readdirSync(cwd)
    return fl.length === 0
  }

  async _createProjectInfo() {
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
          choices: this._generateTemplateChoice(),
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

  async _getProjectTemplate() {
    const templateInfo = await request('/project/template')
    this.templateInfo = templateInfo
  }

  _generateTemplateChoice() {
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
