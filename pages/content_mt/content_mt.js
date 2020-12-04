import { post } from '../../utils/request.js';
const app = getApp();
import config from '../../config/config.js';

Page({
  data: {
    requestPrefixed: config.requestPrefixed,
    platformData:[],
    typeData:[],
    type:'',
    platform:'',
    achData:[],
    achname:'',
    achpoint:'',
    achpoint:'',
    rewardtypes:[
      { label: '第1名奖励', id: 1 },
      { label: '第2名奖励', id: 2 },
      { label: '第3名奖励', id: 3 },
      { label: '普通奖品', id: -1 },
    ],
    rewardtypesIdx:null,
    rewardData:[],
  },
  bindrewardtypeChange:function(e){
    const rewardtypesIdx=e.detail.value;
    this.setData({rewardtypesIdx})
    // this.data.rewardtypes[idx].typeIdx = e.detail.value;
    // this.setData({ info: this.data.info })
  },
  typeinput:function(e){
    this.setData({ type: e.detail.value})
  },
  achnameinput:function(e){
    this.setData({ achname: e.detail.value})
  },
  achpointinput:function(e){
    this.setData({ achpoint: e.detail.value})
  },
  achdetailinput:function(e){
    this.setData({ achdetail: e.detail.value})
  },
  addach:function () {
    post({
      url: '/api/admin/addAch',
      data: { name: this.data.achname,point:this.data.achpoint,conditions:this.data.achdetail }
    }).then(r => {
      if (r.code == 1) {
        this.setData({ achname:'',achpoint:'',achdetail:'' })
        this.init();
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
  },
  reachieve:function (e) {
    wx.showModal({
      title: '',
      content: '确认删除？',
      success: res => {
        if (res.confirm) {
          var pr = e.currentTarget.dataset;
          post({
            url: '/api/admin/delAch',
            data: { id: e.currentTarget.dataset.value }
          }).then(r => {
            if (r.code == 1) {
              this.init();
            } else {
              wx.showToast({
                title: r.msg,
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  addtype: function () {
    if(!this.data.type){
      wx.showToast({
        title: '类别不能为空',
        icon: 'none'
      })
      return;
    }
    post({
      url: '/admin/addType',
      data: { name: this.data.type }
    }).then(r => {
      if (r.code == 1) {
        this.setData({ type:'' })
        this.init();
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
  },
  retype: function (e) {
    wx.showModal({
      title: '',
      content: '确认删除？',
      success: res => {
        if (res.confirm) {
          var pr = e.currentTarget.dataset;
          post({
            url: '/api/admin/delType',
            data: { id: e.currentTarget.dataset.value }
          }).then(r => {
            if (r.code == 1) {
              this.init();
            } else {
              wx.showToast({
                title: r.msg,
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  delreward:function (e) {
    wx.showModal({
      title: '',
      content: '确认删除？',
      success: res => {
        if (res.confirm) {
          var pr = e.currentTarget.dataset;
          post({
            url: '/api/admin/delReward',
            data: { id: e.currentTarget.dataset.value }
          }).then(r => {
            if (r.code == 1) {
              this.init();
            } else {
              wx.showToast({
                title: r.msg,
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },


  platforminput: function (e) {
    this.setData({ platform: e.detail.value })
  },
  addplatform: function () {
    if(!this.data.platform){
      wx.showToast({
        title: '平台不能为空',
        icon: 'none'
      })
      return;
    }
    post({
      url: '/admin/addPlatform',
      data: { name: this.data.platform }
    }).then(r => {
      if (r.code == 1) {
        this.setData({ platform: '' })
        this.init();
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
  },  
  replatform: function (e) {
    wx.showModal({
      title: '',
      content: '确认删除？',
      success:res=>{
        if (res.confirm) {
          var pr = e.currentTarget.dataset
          post({
            url: '/api/admin/delPlatform',
            data: { id: pr.value }
          }).then(r => {
            if (r.code == 1) {
              this.init();
            } else {
              wx.showToast({
                title: r.msg,
                icon: 'none'
              })
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },
  com: function (prs,stw,flag){
    var __this = this;
    app.getToken(token => {
      wx.request({
        url: app.globalData.requestPrefixed + '/setAwardOptions',
        header: {
          'content-type': 'application/json',
          'content-token': token,
        },
        method: 'POST',
        data: prs,
        success: function (res) {
          if (res.data.status === 200) {
            __this.setData({ [stw]: '' })
            wx.showToast({
              title: flag===1?'添加成功':'删除成功',
            })
            __this.init();
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        },
        fail: function (e) {
          console.log(e)
        }
      })
    })
  },
  onLoad: function (options) {
    this.init();
  },
  onReady: function () {},
  onShow: function () {},
  init:function(){
    post({
      url:'/api/getAllListOfAward'
    }).then(r=>{
      if(r.code==1){
        let d=r.data;
        this.setData({
          typeData: d.types,
          platformData: d.platforms,
          methodData: d.methods,
          achData:d.achieves,
          rewardData:d.rewards
        })
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
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
        console.log('event.currentTarget.dataset.value', event.currentTarget.dataset.value)
        wx.uploadFile({
          url: config.requestPrefixed + '/admin/uploadPlatformImg',
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": "multipart/form-data",
            'token': wx.getStorageSync('token'),
          },
          formData: {
            'platformId': event.currentTarget.dataset.value,
          },
          success: function (res) {
            let data = JSON.parse(res.data);
            if (data.code === 1) {
              wx.hideToast();
              wx.showToast({
                title: '上传成功',
              })
              _this.init();
            }else{
              wx.showToast({
                title: data.msg,
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
  errImg:function(e){
    console.log(e)
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  rewardSubmit:function (e) {
    const obj = e.detail.value;
    obj.rewardtype=this.data.rewardtypes[this.data.rewardtypesIdx].id;
    obj.name=obj.rewardname;
    obj.type=obj.rewardtype;
    obj.needCredit=Number(obj.needCredit);
    obj.details=obj.rewarddetail;
    post({
      url:'/api/admin/addReward',
      data: obj
    }).then(r=>{
      if(r.code==1){
        let d=r.data;
        wx.showToast({
          title: r.msg,
        })
        this.init();
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        })
      }
    })
  },
  onShelf:function (e) {
    const final=e.detail.value;
    const id=e.currentTarget.dataset.id;
    wx.showToast({
      title: '',
      icon:'none'
    })
    post({
      url:'/api/admin/updateReward',
      data: {
        onShelf:final,
        id,
      }
    }).then(r=>{
      if(r.code==1){
        let d=r.data;
        wx.showToast({
          title: r.msg,
        })
        this.init();
      } else {
        wx.showToast({
          title: r.msg,
          icon: 'none'
        });
        return;
      }
    })
  }
})