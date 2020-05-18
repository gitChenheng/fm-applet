export const setStore=(key,data)=>{
  wx.setStorageSync(key, data)
}
export const getStore = (key) => {
  return wx.getStorageSync(key)
}