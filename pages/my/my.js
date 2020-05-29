import { post } from '../../utils/request.js';
import {setStore,removeStore, getStore} from '../../utils/storage';
const app = getApp();

Page({
  data: {
    authSettingUserInfo:true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    achieveData:[],
    achPoint:0
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
        if(userInfo.achieve){
          post({
            url: '/api/findAch'
          }).then(r => {
            wx.hideLoading();
            if (r&&r.code == 1) {
              const achArr=r.data;
              const has_achArr=userInfo.achieve.split(',');
              let lastArr=[],achPoint=0;
              has_achArr.forEach(it => {
                for (let i = 0; i < achArr.length; i++) {
                  const element = achArr[i];
                  if(String(achArr[i].id)===it){
                    lastArr.push(achArr[i]);
                    achPoint+=achArr[i].point;
                    break;
                  }
                }
              });
              this.setData({achieveData:lastArr,achPoint});
            } else {
              r&&r.msg&&wx.showToast({
                title: r.msg,
                icon:'none'
              })
            }
          })
        }
      } else {
        r&&r.msg&&wx.showToast({
          title: r.msg,
          icon:'none'
        })
      }
    })
  },
  quesEv:function(e){
    this.showModal(e)
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
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