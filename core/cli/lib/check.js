// import importLocal from 'import-local'
import logGe from '@wukn/log'
import module from 'module'
import constant from './const.js'
import path from 'path'
import semver from 'semver'
import rootCheck from 'root-check'
import userHome from 'user-home'
import { pathExistsSync } from 'path-exists'
import dotenv from 'dotenv'
import { getNpmLatestSemverVersion } from '@wukn/npm-info'

const logcli = logGe('cli')

const require = module.createRequire(import.meta.url)

const pkg = require('../package.json')
/**
 * 检查 package 版本
 */
function checkPkgVersion() {
  // TODO
}
/**
 * 检查 node 版本
 */
function checkNodeVersion() {
  const currentVersion = process.version
  const lowestVersion = constant.LOWEST_NODE_VERSION
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(`当前版本过低，需要安装${lowestVersion}及以上的版本`)
  }
}
/**
 * 检查并降级用户权限
 */
function checkRoot() {
  rootCheck()
  // window is undefind
  // log(process.geteuid());
}
/**
 * 检查用户主目录
 */
function checkUserHome() {
  if (!pathExistsSync(userHome)) {
    throw new Error('用户主目录不存在！！')
  }
}
/**
 * 检查
 */
function checkEnv() {
  // 它能将环境变量中的变量从 .env 文件加载到 process.env 中
  // 所有关于脚手架的配置都可以在这个文件中找到
  const dotenvPath = path.join(userHome, '.env')
  // WK_HOME
  if (pathExistsSync(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    })
  }
  createDefaultConfig()
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  }
  if (process.env.WK_HOME) {
    cliConfig.wk_home = path.join(userHome, process.env.WK_HOME)
  } else {
    cliConfig.wk_home = path.join(userHome, constant.DEFAULT_CLI_HOME)
  }
  process.env.WK_HOME_PATH = cliConfig.wk_home
}
async function checkGlobalUpdate() {
  // TODO ------
  // const currentVersion = pkg.version
  // const NPM_NAME = 'lodash'
  // const lastVersion = await getNpmLatestSemverVersion(NPM_NAME, currentVersion)
  // if (lastVersion && semver.gt(lastVersion, currentVersion)) {
  //   logcli.warn(
  //     `请手动更新 ${NPM_NAME}，当前版本：${pkg.version}，最新版本：${lastVersion}, 更新命令： npm install -g ${NPM_NAME}`
  //   )
  // }
}

export default async function ckeck() {
  checkPkgVersion()
  checkNodeVersion()
  checkRoot()
  checkUserHome()
  checkEnv()
  await checkGlobalUpdate()
}

export { logcli }
