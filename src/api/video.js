import request from "@/utils/request";

export function getEquips(){
  return request({
    url: '/equip/all',
    method: 'get'
  })
}
