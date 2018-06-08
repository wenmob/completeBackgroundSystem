import Cookies from 'js-cookie'

const TokenKey = 'User-Token'
const MerchantSet = 'Merchant-Set'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function getMS () {
  return Cookies.get(MerchantSet)
}

export function setMS (ms) {
  return Cookies.set(MerchantSet, ms)
}

export function removeMS () {
  return Cookies.remove(MerchantSet)
}
