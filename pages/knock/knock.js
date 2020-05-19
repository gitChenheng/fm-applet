import { post } from '../../utils/request.js';
import config from '../../config/config.js';
import dateTimePicker from '../../lib/dateTimePicker.js';
const app = getApp();
Page({
  data: {
    typeIdx:null,
    typeData:[],
    platformIdx:null,
    platformData:[],
    startTime:'',
    endTime:'',
    // today: new Date().toLocaleDateString(),
    today: '',
  },
  bindTypeChange:function(e){
    this.setData({ typeIdx: e.detail.value})
  },
  bindPlatformChange: function (e) {
    this.setData({ platformIdx: e.detail.value})
  },
  bindStartTimeChange:function(e){
    this.setData({ startTime:e.detail.value})
  },
  bindEndTimeChange: function (e) {
    this.setData({ endTime: e.detail.value })
  },
  onLoad: function (options) {
  },
  onReady: function () {},
  onShow: function () {
    post({
      url: '/api/admin/getAllListOfAward'
    }).then(r => {
      if (r.code == 1) {
        let d = r.data;
        this.setData({
          typeData: d.typeData,
          platformData: d.platformData.filter(it => it.platformImgUrl),
          methodData: d.methodData,
        })
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {},
  formSubmit:function(e){
    var obj = e.detail.value;
    if (!obj.name) {
      wx.showToast({
        title: '请填写奖品名',
        icon: 'none'
      });
      return;
    };
    if (!obj.initiator) {
      wx.showToast({
        title: '请填写金主名',
        icon: 'none'
      });
      return;
    };
    if (!obj.typeId) {
      wx.showToast({
        title: '请选择类别',
        icon: 'none'
      });
      return;
    };
    if (!obj.platformId) {
      wx.showToast({
        title: '请选择平台',
        icon: 'none'
      });
      return;
    };
    if (!obj.price) {
      obj.price=0
      // wx.showToast({
      //   title: '请填写价值',
      //   icon: 'none'
      // });
      // return;
    };
    if (!obj.startTime) {
      wx.showToast({
        title: '请选择开始时间',
        icon: 'none'
      });
      return;
    };
    if (!obj.endTime) {
      wx.showToast({
        title: '请选择结束时间',
        icon: 'none'
      });
      return;
    };
    obj.typeId = this.data.typeData[obj.typeId].id;
    obj.platformId = this.data.platformData[obj.platformId].id;
    obj.startTime+=' 00:00:00';
    obj.endTime += ' 00:00:00';
    post({
      url: '/api/addInfo',
      data:obj
    }).then(r => {
      if (r.code == 1) {
        wx.showModal({
          title: '提示',
          content: '爆料成功',
          success: function () {
            wx.navigateBack({
              success: function () {
                wx.startPullDownRefresh({})
              }
            })
          },
          showCancel: false
        })
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
  }
})