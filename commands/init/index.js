import Command from '@wukn/command'
import logGe from '@wukn/log'
const logInit = logGe('command:init')
class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0]
    this.options = this._argv[1] // this._cmd.opts()
    logInit.info(this.projectName, this.options, this._cmd)
  }

  exec() {}
}

function init(argv) {
  return new InitCommand(argv)
}
export default init
