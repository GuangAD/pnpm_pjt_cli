import { sep } from 'path'
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
export { isObject, formatPath }
