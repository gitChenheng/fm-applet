import { post } from '../../utils/request.js';
import config from '../../config/config.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    requestPrefixed: config.requestPrefixed,
    info:[],
    userInfo:{},
    searchLoadingComplete:false,
    achPoint:0
  },
  clickEvent:function(e){
    wx.navigateTo({
      url: '../detail/detail?id=' + e.currentTarget.dataset.id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //身份
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
              let achPoint=0;
              has_achArr.forEach(it => {
                for (let i = 0; i < achArr.length; i++) {
                  if(String(achArr[i].id)===it){
                    achPoint+=achArr[i].point;
                    break;
                  }
                }
              });
              this.setData({achPoint});
            } else {
              r&&r.msg&&wx.showToast({
                title: r.msg,
                icon:'none'
              })
            }
          })
        }



      }
    })
    this.initInfo()
  },
  initInfo:function(){
    wx.showLoading({ mask: true })
    post({
      url: '/api/findInfoConditional',
      data:{
        level:4,
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})