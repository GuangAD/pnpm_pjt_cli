import fetch from 'node-fetch'

const BASH_URL = 'http://book.youbaobao.xyz:7002'
export default function request(route, data) {
  return fetch(BASH_URL + route, {
    // headers: {
    //   'Content-Type': 'application/json',
    //   // 'Content-Type': 'application/x-www-form-urlencoded',
    // },
    // body: data,
  }).then(async (res) => {
    if (res.ok && res.headers.get('Content-Type')) return res.json()
    else return Promise.reject(await res.text())
  })
}
