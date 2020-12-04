import { post } from '../../utils/request.js';
import config from '../../config/config.js';
import dateTimePicker from '../../lib/dateTimePicker.js';
const app = getApp();
Page({
  data: {
    requestPrefixed: config.requestPrefixed,
    typeIdx:null,
    typeData:[],
    platformIdx:null,
    platformData:[],
    startTime:'',
    endTime:'',
    // today: new Date().toLocaleDateString(),
    today: '',
    imgs:'',
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
      url: '/api/getAllListOfAward'
    }).then(r => {
      if (r.code == 1) {
        let d = r.data;
        this.setData({
          typeData: d.types,
          platformData: d.platforms.filter(it => it.platformImgUrl),
          methodData: d.methods,
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
  upload:function(event){
    var _this=this;
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        wx.uploadFile({
          url: config.requestPrefixed + '/api/uploadInfoImg',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'token': wx.getStorageSync('token'),
          },
          formData: {},
          success: function (res) {
            let data = JSON.parse(res.data);
            if (data.code === 1) {
              wx.hideToast();
              wx.showToast({
                title: '上传成功',
              })
              _this.setData({imgs:data.data});
            }else{
              wx.showToast({
                title: '上传失败',
                icon:'none'
              })
            }
            // var data = JSON.parse(res.data);
            //服务器返回格式: { "Catalog": "testFolder", "FileName": "1.jpg", "Url": "https://test.com/1.jpg" }

          },
        })
      },
      fail:function(e){
      }
    })
  },
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
    if (!obj.typeid) {
      wx.showToast({
        title: '请选择类别',
        icon: 'none'
      });
      return;
    };
    if (!obj.platformid) {
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
    obj.typeid = this.data.typeData[obj.typeid].id;
    obj.platformid = this.data.platformData[obj.platformid].id;
    obj.startAt = obj.startTime + ' 00:00:00';
    obj.endAt = obj.endTime + ' 00:00:00';
    obj.img=this.data.imgs;
    post({
      url: '/api/knockInfo',
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