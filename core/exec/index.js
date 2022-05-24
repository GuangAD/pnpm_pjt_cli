import { Package } from '@wukn/package'
import logGe from '@wukn/log'
import { resolve } from 'path'
import { pathToFileURL } from 'url'
import { exec } from '@wukn/utils'
const logexec = logGe('exec')
// 根据command 下载缓存相应的包并执行包中的代码 commands/xxxxx
const settings = {
  init: '@imooc-cli/init',
}
const CACHE_DIR = 'dependencies'

async function main() {
  const command = arguments[arguments.length - 1]
  logexec.info('exec is running!!!, the command is :', command.name())
  const packageName = settings[command.name()]
  const packageVersion = 'latest'
  // -----
  const homePath = process.env.WK_HOME_PATH
  let targetPath = process.env.WK_TARGET_PATH
  let storePath
  let pkg
  if (!targetPath) {
    // targetPath ---> 当前命令需要执行的包的路径
    // 有则执行本地开发的功能包
    logexec.info(homePath)
    targetPath = resolve(homePath, CACHE_DIR)
    storePath = resolve(targetPath, 'node_modules')
    logexec.info(1)

    pkg = new Package({
      targetPath,
      storePath,
      packageName,
      packageVersion,
    })
    if (await pkg.exits()) {
      // 更新
      await pkg.update()
    } else {
      // 安装
      await pkg.install()
    }
  } else {
    pkg = new Package({
      targetPath,
      storePath,
      packageName,
      packageVersion,
    })
  }
  // 获取包的入口文件
  const rootFile = pkg.getEntryFilePath()
  logexec.info(rootFile)
  if (rootFile) {
    // import(pathToFileURL(rootFile)).then(({ default: init }) => {
    //   init.call(null, Array.from(arguments))
    // })
    // childProcess.fork(rootFile)
    const args = Array.from(arguments)
    const cmd = args[args.length - 1]
    const o = Object.create(null)
    Object.keys(cmd).forEach((key) => {
      if (!key.startsWith('_') && key !== 'parent') {
        o[key] = cmd[key]
      }
    })
    args[args.length - 1] = o
    // logexec.info(o)
    const code = `
    import('${pathToFileURL(rootFile)}').then(({ default: init }) => {
      init.call(null, ${JSON.stringify(args)})
    })
    `
    // logexec.info(code)
    const child = exec('node', ['-e', code], {
      cwd: process.cwd(),
      stdio: 'inherit',
    })
    child.on('error', (e) => {
      logexec.error(e)
      process.exit(1)
    })
    child.on('exit', () => {
      logexec.info('命令执行成功')
    })
  }
}
export { main as exec }
