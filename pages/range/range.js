import { post } from '../../utils/request.js';
const app = getApp();

Page({
  data: {
    rangeData:[],
  },
  onLoad: function (options) {

  },
  onReady: function () {
    
  },
  onShow: function () {
    post({
      url: '/api/getRangesByCredit'
    }).then(r => {
      if (r.code == 1) {
        this.setData({ rangeData: r.data })
      } else {
        wx.showToast({
          title: r.msg,
        })
      }
    })
  },
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})