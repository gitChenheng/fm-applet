import config from './config/config.js';
const updateManager = wx.getUpdateManager();
App({
  onLaunch: function () {
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
    
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        // let custom = wx.getMenuButtonBoundingClientRect();
        // this.globalData.Custom = custom;
        // this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    });
    
  },
  globalData: {
    requestPrefixed: config.requestPrefixed,
    token_expire_time:config.token_expire_time,
    loginFlag:false,
  },
})


  // overShare:function(){
  //   let _this = this
  //     //间接实现全局设置分享内容
  //     wx.onAppRoute(function (res) {
  //       //获取加载的页面
  //       let pages = getCurrentPages(),view = pages[pages.length - 1],data;
  //       if (view) {
  //         data = view.data;
  //         if (!data.isOverShare) {
  //           data.isOverShare = true;
  // //           console.log('全局分享参数：',_this.getShareUrlParams())
  //           view.onShareAppMessage = function () {
  //             //重写分享配置
  //             return {
  //               title: '分享标题',
  //               path: "/pages/index/index"
  //             };
  //           }
  //         }
  //       }
  //     })
  // },

// wx.onAppRoute(function(res){
    //   console.log('router',res);
    //   let pages = getCurrentPages(),view = pages[pages.length - 1];
    //   console.log('view',view)
    //   console.log('view',view['options'])
    // })

// !function(){
//   var PageTmp = Page;
//   Page =function (pageConfig) {
//     // 设置全局默认分享
//     pageConfig = Object.assign({
//       onShareAppMessage:function () {
//         console.log("wx.getStorageSync('shareId')",wx.getStorageSync('shareId'))
//         return {
//           title: '转发',
//           path: `/pages/index/index?shareId=${wx.getStorageSync('shareId')}`,
//           // imageUrl:'默认分享图片',
//         };
//       }
//     },pageConfig);
//     PageTmp(pageConfig);
//   };
// }();