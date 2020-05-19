export const setStore=(key,data)=>{
  wx.setStorageSync(key, data)
}
export const getStore = (key) => {
  return wx.getStorageSync(key)
}
export const removeStore = (key) => {
  return wx.removeStorageSync(key)
}
export const clearAllStore = (key) => {
  return wx.clearStorageSync(key)
}