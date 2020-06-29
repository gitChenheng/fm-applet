import { post } from '../../utils/request.js';
import provinceList from '../../data/address.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    provinceList,
    province:null,
    cityList:[],
    city:null,
    districtList:[],
    district:null,
  },
  formSubmit:function(e){
    var obj = e.detail.value,flag=true;
    console.log(obj)
    for(const k in obj){
      if(!obj[k]){
        flag=false;
        break;
      }
    }
    if(flag){
      const d=this.data;
      const address=`${d.province}${d.city}${d.district},${obj.addressDetail}`
      console.log(address);
      wx.showLoading()
      post({
        url: '/api/updateUserInfo',
        data:{address}
      }).then(r => {
        wx.hideLoading();
        if (r&&r.code == 1) {
          wx.showToast({
            title: '修改成功',
          });
          setTimeout(()=>{
            wx.navigateTo({
              url: '/pages/my/my',
            })
          },1000)
        } else {
          r&&r.msg&&wx.showToast({
            title: r.msg,
            icon:'none'
          })
        }
      })
    }
  },
  bindProvinceChange:function(e){
    const idx=e.detail.value;
    const v=this.data.provinceList[idx];
    console.log(v);
    this.setData({
      province:v.name,
      cityList:v.city,
    })
  },
  bindCityChange:function(e){
    const idx=e.detail.value;
    const v=this.data.cityList[idx];
    console.log(v);
    this.setData({
      city:v.name,
      districtList:v.area,
    })
  },
  bindDistrictChange:function(e){
    const idx=e.detail.value;
    const v=this.data.districtList[idx];
    console.log(v);
    this.setData({
      district:v,
    })
  },
  onLoad: function (options) {
    this.getUserInfo();
  },
  getAdrInfo:function(){
    wx.showLoading()
    post({
      url: '/api/getAddressList'
    }).then(r => {
      wx.hideLoading();
      if (r&&r.code == 1) {
        let userInfo = r.data;
        // this.setData({ userInfo });
      } else {
        r&&r.msg&&wx.showToast({
          title: r.msg,
          icon:'none'
        })
      }
    })
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