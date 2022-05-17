import logGe from '@wukn/log'
const logComd = logGe('comd')
class Command {
  constructor(argv) {
    if (!argv) throw new Error('参数不能为空')
    this._argv = argv
    let chain = Promise.resolve()
    chain = chain.then(() => this.initArgs())
    chain = chain.then(() => this.init())
    chain = chain.then(() => this.exec())
    chain.catch((e) => {
      logComd.error(e)
    })
  }

  initArgs() {
    this._cmd = this._argv[this._argv.length - 1]
    this._argv = this._argv.slice(0, this._argv.length - 1)
  }

  init() {
    throw new Error('init 方法必须实现')
  }

  exec() {
    throw new Error('exec 方法必须实现')
  }
}

export default Command
