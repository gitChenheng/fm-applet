const app = getApp()

Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    requestPrefixed: app.globalData.requestPrefixed,
    info: [],
    today: new Date().toLocaleDateString(),
    todayStamp: new Date(new Date().toLocaleDateString()).getTime(),
    touch: false,
  },
  onLoad: function () {
  },
  onReady: function () {
    this.initInfo();
    // wx.navigateTo({
    //   url: '../my/my'
    // })
  },
  initInfo: function (cb) {
    var _this = this;
    app.getToken(token => {
      wx.showLoading({
        title: '加载中..',
        mask: true
      })
      wx.request({
        url: app.globalData.requestPrefixed + '/info',
        header: {
          'content-type': 'application/json',
          'content-token': token,
        },
        method: 'POST',
        success: function (res) {
          wx.hideLoading()
          _this.setData({ info: res.data.data });
          typeof cb == "function" && cb();
        },
        fail: function () {
          wx.hideLoading()
        }
      })
    })
  },
  onShow: function () {
    console.log('base')
  },
  //爆料
  knock: function () {
    wx.navigateTo({
      url: '../knock/knock'
    })
  },
  onLoad: function () {
  },
  onPullDownRefresh: function () {
    // wx.showNavigationBarLoading();//菊花
    this.initInfo(() => {
      // wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    });
  },
  clickEvent: function (e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  NavChange(e) {
    let cur = e.currentTarget.dataset.cur;
    if (cur === 'my') {
      console.log('my')
      wx.navigateTo({
        url: '../my/my'
      })
    } else if (cur === "basics") {
      wx.navigateTo({
        url: '../index/index'
      })
    }

    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
})
