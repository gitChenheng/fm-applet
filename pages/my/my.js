import { post } from '../../utils/request.js';
import {setStore,removeStore, getStore} from '../../utils/storage';
const app = getApp();

Page({
  data: {
    authSettingUserInfo:true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
  },
  bindGetUserInfo:function(e){
    this.onLoad();
    this.onShow();
  },
  onLoad: function (options) {
    let pages = getCurrentPages();
    let shareInfo=pages[pages.length - 1]['options'];
    if(shareInfo.shareId){
      setStore('shareId',shareInfo.shareId);
    }else{
      removeStore('shareId');
    }

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
      if (r&&r.code == 1) {
        let userInfo = r.data;
        this.setData({ userInfo });
      } else {
        r&&r.msg&&wx.showToast({
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
  },
  onShareAppMessage: function(e) {
    if (e.from === 'menu') {}
    if (e.from === 'button') {}
    return {
      title: '转发',
      path: `/pages/index/index?shareId=${this.data.userInfo.id}`,
      success: function(res) {
        console.log('success',res);
      }
    }
  }
})