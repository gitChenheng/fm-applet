import { post } from '../../utils/request.js';
import config from '../../config/config.js';
import {setStore} from '../../utils/storage';
const pageSize=10;
let t;
Page({
  data: {
    requestPrefixed: config.requestPrefixed,
    PageCur: 'basics',
    info:[],
    today: new Date().toLocaleDateString(),
    todayStamp: new Date(new Date().toLocaleDateString()).getTime(),
    touch:false,
    typeId: null,
    typeData: [],
    platformId: null,
    platformData: [],
    condition:false,
    pageIndex: 1,
    pageSize,
    searchLoadingComplete:false,
    userInfo:{},
    shareInfo:{},
  },
  reject:function(e){
    console.log(e);
  },
  onLoad:function(){
    // wx.navigateTo({
    //   url: '/pages/my/my',
    // })
    let pages = getCurrentPages();
    let shareInfo=pages[pages.length - 1]['options'];
    if(shareInfo.shareId){
      setStore('shareId',shareInfo.shareId);
    }

    // this.findInfoConditionalEvent();
    post({
      url: '/api/admin/getAllListOfAward'
    }).then(r => {
      if (r&&r.code && r.code == 1) {
        let d = r.data;
        this.setData({
          typeData: d.typeData,
          platformData: d.platformData.filter(it => it.platformImgUrl),
          methodData: d.methodData,
        })
      } else {
        r&&wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
    //身份
    post({
      url: '/api/getUserInfo'
    }).then(r => {
      wx.hideLoading();
      if (r&&r.code == 1) {
        let userInfo = r.data;
        this.setData({ userInfo });
      }
    })
  },
  onShow: function () {
    this.findInfoConditionalEvent(true);
  },
  onReady:function(){},
  initInfo:function(){
    wx.showLoading({ mask: true })
    post({
      url: '/api/findInfo',
      data:{
        pageIndex: this.data.pageIndex,
        pageSize: this.data.pageSize,
      }
    }).then(r => {
      wx.hideLoading();
      if (r&&r.code && r.code== 1) {
        let d = r&&r.data;
        if(!d.length){
          this.setData({ searchLoadingComplete:true});
          return;
        }
        this.setData({ info: [...this.data.info,...d] });
      } else {
        r&&wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
  },
  conditionEvent:function(){
    this.setData({ condition: !this.data.condition})
  },
  reset:function(){
    this.setData({
      typeIdx: null,
      platformIdx: null,
    }, () => { this.findInfoConditional() });
  },
  findInfoConditional:function(e){
    let dataset = e.currentTarget.dataset;
    const commonState = { pageIndex: 1, pageSize, info: [], searchLoadingComplete: false}
    if (dataset.type == '1') {//奖品类型
      this.setData({typeId: dataset.id, ...commonState},()=>{
        this.findInfoConditionalEvent();
      })
    } else if (dataset.type == '2') {//所在平台
      this.setData({ platformId: dataset.id, ...commonState},()=>{
        this.findInfoConditionalEvent();
      })
    } else if (dataset.type == '0') {
      let v = e.detail.value;
      if (t)
        clearTimeout(t);
      t=setTimeout(()=>{
        this.setData({ search: v, ...commonState }, () => {
          this.findInfoConditionalEvent()
        })
      },1000)
    }
  },
  findInfoConditionalEvent:function(init){
    wx.showLoading({ mask: true })
    post({
      url: '/api/findInfoConditional',
      data: {
        typeId: this.data.typeId,
        platformId: this.data.platformId,
        search: this.data.search,
        pageIndex: init?1:this.data.pageIndex,
        pageSize: this.data.pageSize,
      }
    }).then(r => {
      wx.hideLoading();
      if (r&&r.code == 1) {
        let d = r.data;
        if (!d.length) {
          this.setData({ searchLoadingComplete: true });
          return;
        }
        init?
        this.setData({ info: d }):
        this.setData({ info: [...this.data.info, ...d] });
      } else {
        r && wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
  },
  bindTypeChange: function (e) {
    this.setData({ typeIdx: e.detail.value }, () => { this.findInfoConditional()});
  },
  bindPlatformChange: function (e) {
    this.setData({ platformIdx: e.detail.value }, () => { this.findInfoConditional() });
  },
  maskTapEv:function(e){
    this.setData({condition:false})
  },
  bindgetuserinfo(e) {
    console.log('info',e)
  },
  //爆料
  knock:function(){
    wx.navigateTo({
      url: '../knock/knock'
    })
  },
  onReachBottom: function () {
    if (this.data.searchLoadingComplete) {
      return;
    }
    this.setData({
      pageIndex: ++this.data.pageIndex,
    }, () => {
      this.findInfoConditionalEvent()
    })
  },
  onPullDownRefresh:function(){
    return;
    // wx.showNavigationBarLoading();//菊花
    this.initInfo(()=>{
      // wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    });
  },
  clickEvent:function(e){
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  NavChange(e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: data.cur,
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
