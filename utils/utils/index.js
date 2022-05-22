import { sep } from 'path'
import { Spinner } from 'cli-spinner'
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
export { isObject, formatPath, loading, sleep }
