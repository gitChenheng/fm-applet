import { post } from '../../utils/request.js';
const app = getApp();

Page({
  data: {
    authSettingUserInfo:true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    PageCur: 'my',
    userInfo: {},
  },
  bindGetUserInfo:function(e){
    this.onLoad();
    this.onShow();
  },
  onLoad: function (options) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          this.setData({ authSettingUserInfo:true})
        } else {
          this.setData({ authSettingUserInfo: false })
        }
      }
    });

    this.getUserInfo()
  },
  getUserInfo:function(){
    wx.showLoading()
    post({
      url: '/api/getUserInfo'
    }).then(r => {
      wx.hideLoading();
      if (r.code == 1) {
        let userInfo = r.data;
        this.setData({ userInfo });
      } else {
        wx.showToast({
          title: r.msg,
          icon:'none'
        })
      }
    })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  signUp:function(){
    var _this = this;
    post({
      url:'/api/addSign'
    }).then(r=>{
      if(r.code==1){
        this.getUserInfo()
        wx.showToast({
          title: r.msg,
          icon:'none'
        })
      }else{
        wx.showToast({
          title: '签到失败',
          icon:'none'
        })
      }
    })
  },
  range:function(){
    wx.navigateTo({
      url: '../range/range'
    })
  },
  knock_ap:function(){
    //爆料审核
    wx.navigateTo({
      url: '../konck_ap/konck_ap'
    })
  },
  content_mt:function(){
    wx.navigateTo({
      url: '../content_mt/content_mt'
    })
  },
  my_konck:function(){
    wx.navigateTo({
      url: '../my_konck/my_konck'
    })
  }
})