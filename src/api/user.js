import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getList(query) {
  return request({
    url: '/user/all',
    method: 'get',
    params: query
  })
}

export function createUser(data) {
  return request({
    url: '/user/create',
    method: 'put',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function getUserRoles(data) {
  return request({
    url: '/user/getUserRoles',
    method: 'post',
    data
  })
}

export function saveUserRoles(data) {
  return request({
    url: '/user/saveUserRoles',
    method: 'post',
    data
  })
}
