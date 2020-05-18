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
    today: new Date().toLocaleDateString(),


    date: '2018-10-01',
         time: '12:00',
         dateTimeArray: null,
         dateTime: null,
        dateTimeArray1: null,
        dateTime1: null,
         startYear: 2000,
         endYear: 2050
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


    // // 获取完整的年月日 时分秒，以及默认显示的数组
    // var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // // 精确到分的处理，将数组的秒去掉
    // var lastArray = obj1.dateTimeArray.pop();
    // var lastTime = obj1.dateTime.pop();
    // this.setData({
    //   dateTime: obj.dateTime,
    //   dateTimeArray: obj.dateTimeArray,
    //   dateTimeArray1: obj1.dateTimeArray,
    //   dateTime1: obj1.dateTime
    // });
  },
  // changeDateTime(e) {
  //   this.setData({ dateTime: e.detail.value });
  // },
  // changeDateTimeColumn1(e) {
  //   var arr = this.data.dateTime1, dateArr = this.data.dateTimeArray1;
  //   arr[e.detail.column] = e.detail.value;
  //   dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
  //   this.setData({
  //     dateTimeArray1: dateArr,
  //     dateTime1: arr
  //   });
  // },


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
    console.log(obj)
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
      wx.showToast({
        title: '请填写价值',
        icon: 'none'
      });
      return;
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