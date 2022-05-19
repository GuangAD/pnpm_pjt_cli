import Command from '@wukn/command'
import logGe from '@wukn/log'
import fs from 'fs'
import fse from 'fs-extra'
import inquirer from 'inquirer'
const logInit = logGe('command:init')
class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0]
    this.options = this._argv[1] // this._cmd.opts()
    logInit.info(this.projectName, this.options)
  }

  exec() {
    try {
      // 1.准备阶段
      this.prepare()
      // 2.下载模板
      // 3.安装模板
    } catch (e) {
      logInit.error(e.message)
    }
  }

  async prepare() {
    // 1. 判断当前目录是否为空
    const cwd = process.cwd()
    if (!this.isDirEmpty(cwd)) {
      // 2. 是否启动强制更新
      const { isClean } = await inquirer.prompt({
        type: 'comfirm',
        name: 'isClean',
        default: false,
        message: '当前文件夹不为空，是否继续创建项目？',
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
    return await this.getProjectInfo()
  }

  isDirEmpty(cwd) {
    const fl = fs.readdirSync(cwd)
    return fl.length === 0
  }

  async getProjectInfo() {
    // 1. 选择创建项目或组件
    const ret = {}
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
    ret.type = type
    if (type === 'project') {
      // 项目信息
      const obj = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: '请输入项目名称',
          default: '',
          validate: (v) => v.length > 0,
        },
        {
          type: 'input',
          name: 'projectVersion',
          message: '请输入项目版本号',
          default: '',
          validate: (v) => v.length > 0,
        },
      ])
      console.log(obj)
    } else if (type === 'compoment') {
      // 组件信息
    }
    // 2. 获取项目基本信息
    return ret
  }
}

function init(argv) {
  return new InitCommand(argv)
}
export default init
