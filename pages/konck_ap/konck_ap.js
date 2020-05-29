import { post } from '../../utils/request.js';
const app = getApp();

Page({
  data: {
    info:[],
    levels:[
      { label: '1星', id: 1 },
      { label: '2星', id: 2 },
      { label: '3星', id: 3 },
    ],
  },
  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {
    this.init();
  },
  init:function(){
    wx.showLoading({ mask: true });
    post({
      url: '/api/findInfo',
      data: {
        type:'needToApproveInfo',
      }
    }).then(r => {
      wx.hideLoading();
      if (r.code == 1) {
        let d = r.data;
        d.map(it => it.levelIdx=null)
        this.setData({ info: d });
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
  },
  pass:function(e){
    const idx = e.currentTarget.dataset.infoidx;
    if (!this.data.info[idx].levelIdx){
      wx.showToast({
        title: '请选择星级',
        icon:'none'
      })
      return;
    }
    var pr = e.currentTarget.dataset;
    post({
      url: '/api/admin/approve',
      data: { id: pr.infoid, type: 1, levelId: this.data.levels[this.data.info[idx].levelIdx].id }
    }).then(r => {
      if (r.code == 1) {
        wx.showToast({
          title: '审批通过',
        })
        this.init();
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
  },
  xxx:function(e){
    const idx = e.currentTarget.dataset.infoidx;
    this.data.info[idx].rejectReason = e.detail.value;
    this.setData({ info: this.data.info})
  },
  reject: function (e) {
    const idx = e.currentTarget.dataset.infoidx;
    var pr = e.currentTarget.dataset;
    post({
      url: '/api/admin/approve',
      data: { id: pr.infoid, type: 0, reason: this.data.info[idx].rejectReason}
    }).then(r => {
      if (r.code == 1) {
        wx.showToast({
          title: '驳回成功',
        })
        this.init();
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
  },
  bindLevelChange:function(e){
    const idx = e.currentTarget.dataset.infoidx;
    this.data.info[idx].levelIdx = e.detail.value;
    this.setData({ info: this.data.info })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
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

  }
})