import { BehaviorSubject } from 'rxjs'
import Router from 'next/router'
import axios from 'axios'

const isServer = typeof window === 'undefined'
const userSubject = new BehaviorSubject(!isServer && JSON.parse(localStorage.getItem('user')))

export const userService = {
  user: userSubject.asObservable(),
  get userValue () { return userSubject.value },
  login,
  logout,
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

function update(id, data) {
  return axios.put(`/api/user/${id}`, data)
    .then(({ data: user }) => {
      userSubject.next(user)
      localStorage.setItem('user', JSON.stringify(user))
      return user
    })
}
