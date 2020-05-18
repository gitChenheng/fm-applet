import { post } from '../../utils/request.js';
import config from '../../config/config.js';
const app = getApp();
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
  onLoad:function(){
    let pages = getCurrentPages();
    let shareInfo=pages[pages.length - 1]['options'];
    this.setData({
      shareInfo
    })
    console.log('pr',shareInfo);
    // wx.getSystemInfo({
    //   success: r=> {
    //     const b = r.windowWidth / 750;
    //     this.setData({
    //       height: r.windowHeight - b*250+ "px"
    //     })
    //   }
    // })
    this.findInfoConditionalEvent();
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
      if (r.code == 1) {
        let userInfo = r.data;
        this.setData({ userInfo });
      }
    })
  },
  onShow: function () {},
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
  findInfoConditionalEvent:function(){
    wx.showLoading({ mask: true })
    post({
      url: '/api/findInfoConditional',
      data: {
        typeId: this.data.typeId,
        platformId: this.data.platformId,
        search: this.data.search,
        pageIndex: this.data.pageIndex,
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
    console.log(e.currentTarget.dataset)
    

    // this.setData({
    //   PageCur: e.currentTarget.dataset.cur
    // })
    wx.navigateTo({
      url: data.cur,
    })
  },
  onShareAppMessage: function(e) {
    // let users = wx.getStorageSync('user');
    console.log('e',e)
    if (e.from === 'menu') {

    }
    if (e.from === 'button') {}
    return {
      title: '转发',
      path: `/pages/index/index?shareCode=shareCode&id=${this.data.userInfo.id}`,
      success: function(res) {
        console.log('success',res);
      }
    }
  }
})
