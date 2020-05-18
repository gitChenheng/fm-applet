import config from './config/config.js';

App({
  onLaunch: function () {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        // let custom = wx.getMenuButtonBoundingClientRect();
        // this.globalData.Custom = custom;
        // this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  globalData: {
    requestPrefixed: config.requestPrefixed,
    token_expire_time:config.token_expire_time,
    loginFlag:false,
  },
})