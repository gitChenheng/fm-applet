import { post } from '../../utils/request.js';
const app = getApp();
const pageSize = 5;
Page({
  data: {
    info: [],
    pageIndex: 1,
    pageSize,
    searchLoadingComplete: false,
  },
  onLoad: function (options) {},
  onReady: function () {},
  onReachBottom: function (e) {
    if (this.data.searchLoadingComplete) {
      return;
    }
    this.setData({
      pageIndex: ++this.data.pageIndex,
    }, () => {
      this.init()
    })
  },
  init: function () {
    wx.showLoading({ mask: true })
    post({
      url: '/api/findInfo',
      data: {
        type: 'myInfo',
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize,
      }
    }).then(r => {
      wx.hideLoading();
      if (r.code == 1) {
        let d = r.data;
        if (!d.length) {
          this.setData({ searchLoadingComplete: true });
          return;
        }
        this.setData({ info: [...this.data.info, ...d] });
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
  },
  onShow: function () {
    this.init()
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  }
})