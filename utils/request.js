import config from '../config/config.js';
import {setStore,getStore,removeStore} from '../utils/storage';
const app = getApp();

const request=function(opt){
  return new Promise((resolve,reject)=>{
    wx.request({
      url: opt.fullUrl?opt.url:config.requestPrefixed+opt.url,
      header:{
        'content-type': 'application/json',
        'token': wx.getStorageSync('token'),
        ...opt.header,
      },
      method: opt.method||'POST',
      data: opt.data,
      success:function(r){
        resolve(r)
      },
      fail:function(e){
        reject(e)
      },
    })
  })
}

export const post=(opt)=>request(opt).then(r => {
  if (r.data.code == 4) {
    if (app.globalData.loginFlag){
      return r.data;
    }else{
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                let userInfoObj = JSON.parse(res.rawData);
                if (app.globalData.loginFlag) return;
                app.globalData.loginFlag = true;
                wx.login({
                  success: loginRes => {
                    if (loginRes.errMsg == 'login:ok') {
                      const shareId=getStore('shareId');
                      if(shareId){
                        userInfoObj.shareId=shareId
                      }
                      request({
                        url: '/api/login',
                        data: {
                          code: loginRes.code,
                          ...userInfoObj
                        }
                      }).then(res => {
                        let d = res.data;
                        if (d&&d.code == 1) {
                          setStore('token',d.data.token);
                          removeStore('shareId');
                          app.globalData.loginFlag = false;
                          if (getCurrentPages().length != 0) {
                            //刷新当前页面的数据
                            getCurrentPages()[getCurrentPages().length - 1].onLoad()
                          }
                        }
                      })
                    } else {
                      wx.showToast({
                        title: loginRes.errMsg,
                      })
                    }
                  }
                })
              }
            })
          } else {
            wx.openSetting({
              success: e => {
                console.log('openSetting', e)
              }
            })
          }
        }
      });
    }
  }else{
    return r.data
  }
}).catch(e => {
  console.log(e)
})

export default request;