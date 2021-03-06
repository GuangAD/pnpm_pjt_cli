import { sep } from 'path'
import { Spinner } from 'cli-spinner'
import childProcess from 'child_process'

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]'
}
function formatPath(path) {
  if (sep === '/') {
    return path
  } else {
    return path.replace(/\\/g, '/')
  }
}

function loading(msg = 'loading...', spinnerString = '|/-\\') {
  const spinner = new Spinner(msg + '%s')
  spinner.start()
  const stop = () => {
    spinner.stop(true)
  }
  return stop
}

function sleep(duration = 3000) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

function exec(command, args, options = {}) {
  // const isWin32 = process.platform === 'win32'
  // const cmd = isWin32 ? 'cmd' : command
  // const cmgArgs = isWin32 ? ['/c'].concat(command, args) : args
  return childProcess.spawn(command, args, options)
}
export { isObject, formatPath, loading, sleep, exec }
