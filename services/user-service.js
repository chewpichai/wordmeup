import { BehaviorSubject } from 'rxjs'
import Router from 'next/router'
import axios from 'axios'

const isServer = typeof window === 'undefined'
const userSubject = new BehaviorSubject(!isServer && JSON.parse(localStorage.getItem('user')))

// [security patch] แนบ token ไปกับทุกคำขอ /api/ (server ตรวจ token แล้ว) · token หมดอายุ = ให้ login ใหม่
// คำขอที่ตั้ง config.lpKeep401 = true (บันทึกผล Let's Practice) จะไม่ถูกพาออกจากหน้าทันที เกมเก็บผลไว้และแจ้งเอง
if (!isServer) {
  axios.interceptors.request.use((config) => {
    const token = userSubject.value?.token
    if (token && String(config.url || '').startsWith('/api/')) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
  axios.interceptors.response.use((r) => r, (err) => {
    if (err?.response?.status === 401 && userSubject.value && !err.config?.lpKeep401) expire(err.response.data?.code)
    return Promise.reject(err)
  })
}

export const userService = {
  user: userSubject.asObservable(),
  get userValue () { return userSubject.value },
  login,
  logout,
  expire,
  update,
}

function login(data) {
  return axios.post('/api/authenticate', data)
    .then(({ data: user }) => {
      // publish user to subscribers and store in local storage to stay logged in between page refreshes
      userSubject.next(user)
      localStorage.setItem('user', JSON.stringify(user))
      return user
    })
}

function logout() {
  // remove user from local storage, publish null to user subscribers and redirect to login page
  localStorage.removeItem('user')
  userSubject.next(null)
  Router.push('/')
}

// [Let's Practice] หมดเวลาเข้าสู่ระบบ (401) → บอกเหตุผลเป็นภาษาไทยที่หน้า login แล้วกลับมาหน้าเดิมหลัง login
function expire(code) {
  if (isServer) return
  try { sessionStorage.setItem('wmu_auth_msg', code === 'period' ? 'period' : 'login') } catch (e) {}
  const back = Router.asPath && Router.asPath !== '/' && !Router.asPath.startsWith('/?') ? Router.asPath : ''
  localStorage.removeItem('user')
  userSubject.next(null)
  Router.push(back ? { pathname: '/', query: { returnUrl: back } } : '/')
}

function update(id, data) {
  return axios.put(`/api/user/${id}`, data)
    .then(({ data: updated }) => {
      // [security patch] เก็บ token เดิมไว้ (response ไม่มี token) และไม่เก็บรหัสผ่านในเบราว์เซอร์
      const { password, words, ...rest } = updated
      const user = { ...rest, token: userSubject.value?.token }
      userSubject.next(user)
      localStorage.setItem('user', JSON.stringify(user))
      return user
    })
}
