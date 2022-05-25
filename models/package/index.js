import logGe from '@wukn/log'
import { isObject, formatPath } from '@wukn/utils'
import { packageDirectorySync } from 'pkg-dir'
import module from 'module'
import npminstall from 'npminstall'
import { join, resolve } from 'path'
import { pathExistsSync } from 'path-exists'
import { getLatestVersion } from '@wukn/npm-info'
import { mkdirpSync } from 'fs-extra'
const logpkg = logGe('pkg')
const require = module.createRequire(import.meta.url)

class Package {
  constructor(options) {
    this.checkArgs(options)
    // 目标路径
    this.targetPath = options.targetPath
    // 缓存路径
    this.storePath = options.storePath
    // 包名
    this.packageName = options.packageName
    // 版本
    this.packageVersion = options.packageVersion
    // 缓存当前版本路径文件夹前缀
    this.chcheFilePathPrefix = this.packageName.replace('/', '_')
  }

  checkArgs(args) {
    if (!args) {
      throw new Error('Packages: 参数不能为空')
    }
    if (!isObject(args)) {
      throw new Error('Packages: 请传入Object类型的参数')
    }
  }

  async prepare() {
    if (this.storePath && !pathExistsSync(this.storePath)) {
      mkdirpSync(this.storePath)
    }
    if (this.packageVersion === 'latest') {
      this.packageVersion = await getLatestVersion(this.packageName)
    }
  }

  get chcheFilePath() {
    return resolve(
      this.storePath,
      `_${this.chcheFilePathPrefix}@${this.packageVersion}@${this.packageName}`
    )
  }

  getCheFilePathByVersion(version) {
    return resolve(
      this.storePath,
      `_${this.chcheFilePathPrefix}@${version}@${this.packageName}`
    )
  }

  // 当前package是否存在
  async exits() {
    if (this.storePath) {
      await this.prepare()
      return pathExistsSync(this.chcheFilePath)
    } else {
      return pathExistsSync(this.targetPath)
    }
  }

  // 安装
  async install() {
    logpkg.info('install')
    await this.prepare()
    return npminstall({
      root: this.targetPath,
      storeDir: this.storePath,
      pkgs: [{ name: this.packageName, version: this.packageVersion }],
    })
  }

  // 更新
  async update() {
    logpkg.info('update')
    await this.prepare()
    // 1. 获取最新版本
    const latestVersion = await getLatestVersion(this.packageName)
    // 2. 根据版本生成缓存目录文件夹名
    const latestFilePath = this.getCheFilePathByVersion(latestVersion)
    // 3. 判断文件是否存在
    logpkg.info('文件夹是否存在：', pathExistsSync(latestFilePath))
    if (!pathExistsSync(latestFilePath)) {
      await npminstall({
        root: this.targetPath,
        storeDir: this.storePath,
        pkgs: [{ name: this.packageName, version: latestVersion }],
      })
    }
    this.packageVersion = latestVersion
  }

  // 获取入口文件
  getEntryFilePath() {
    if (this.storePath) {
      return this._getEntryFilePath(this.chcheFilePath)
    } else {
      return this._getEntryFilePath(this.targetPath)
    }
  }

  _getEntryFilePath(targetPath) {
    // pkg-dir 读取模块的主目录
    const pkgPath = packageDirectorySync({
      cwd: targetPath,
    })
    if (pkgPath) {
      const pkgJson = require(join(pkgPath, 'package.json'))
      if (pkgJson && pkgJson.main) {
        const ret = formatPath(resolve(pkgPath, pkgJson.main))
        return ret
      }
    }
    return null
  }
}

export { Package }
