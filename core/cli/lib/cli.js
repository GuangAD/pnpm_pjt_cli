#!/usr/bin/env node
import { program } from 'commander'
import ckeck, { logcli } from './check.js'
import module from 'module'
import { exec } from '@wukn/exec'
const require = module.createRequire(import.meta.url)
const pkg = require('../package.json')
function registrationCommand() {
  program
    .name('wk')
    .usage('<command> [options]')
    .option('-p --targetPath <targetPath>', '测试路径', '')
    .version(pkg.version)

  program
    .command('init [projectName]')
    .option('-f, --force', '是否强制初始化项目', false)
    .action(exec)

  program.on('option:targetPath', () => {
    const { targetPath } = program.opts()
    logcli.info('targetPath')
    process.env.WK_TARGET_PATH = targetPath
    // 不正确
  })

  program.on('command:*', () => {
    // unknow command
  })

  program.parse(process.argv)
  if (program.args && program.args.length < 1) {
    program.outputHelp()
  }
}

async function main() {
  try {
    await ckeck()
    registrationCommand()
  } catch (e) {
    logcli.error(e.message || e)
  }
}
main()
