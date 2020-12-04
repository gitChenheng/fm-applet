import { post } from '../../utils/request.js';
import config from '../../config/config.js';

Page({
  data: {
    requestPrefixed: config.requestPrefixed,
    obj:{
      participate:false,
    },
    infoId:null,
    inputValue:'',
    commentList:[],
  },
  onPatiTag:function(e){
    const tag=e.detail.value;
    const infoid=this.data.infoId;
    post({
      url: '/api/actParticipate',
      data: {infoid,tag}
    }).then(r => {
      wx.hideLoading();
      if (r.code == 1) {
        let d = r.data;
        wx.showToast()
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({infoId:options.id})
    wx.showLoading()
    post({
      url: '/api/getInfoDetail',
      data: { id: options.id }
    }).then(r => {
      wx.hideLoading();
      if (r.code == 1) {
        let d = r.data;
        this.setData({ obj: d });
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
    // this.initComment();
  },
  initComment:function(){
    post({
      url: '/api/findComment',
      data: { infoId: this.data.infoId },
    }).then(r => {
      if (r.code == 1) {
        let d = r.data;
        this.setData({ commentList: d })
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
  },
  inputChange:function(e){
    this.setData({ inputValue:e.detail.value})
  },
  comment:function(){
    if (!this.data.inputValue){
      wx.showToast({
        title: '请输入评论内容',
        icon:'none'
      })
      return;
    }
    post({
      url: '/api/addComment',
      data: { 
        infoId: this.data.infoId,
        content: this.data.inputValue
      },
    }).then(r => {
      if (r.code == 1) {
        this.setData({ inputValue: '' });
        this.initComment();
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
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
  copyInitiator:function(){
    var _this = this;
    wx.setClipboardData({
      //去找上面的数据
      data: _this.data.obj.initiator,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  copy:function(){
    var _this = this;
    console.log(this.data.obj.link)
    wx.setClipboardData({
      //去找上面的数据
      data: _this.data.obj.link,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  // nato:function() {
  //   const url=this.data.obj.link
  //   wx.navigateTo({
  //     url: `/pages/webview/webview?url=${url}`,
  //   })
  // },
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

  }
})