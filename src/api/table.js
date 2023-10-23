import request from '@/utils/request'

export function getList(query) {
  return request({
    url: '/user/all',
    method: 'get',
    params: query
  })
}
