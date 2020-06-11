import { post } from '../../utils/request.js';
let t;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabArr:[
      {name:'积分榜单'},{name:'积分转盘'},{name:'成就专区'},
      {name:'兑换专区'},
    ],
    TabCur: 0,
    scrollLeft:0,
    gameBlock:[
      {name:'积分',credit:3},{name:'积分',credit:4},{name:'积分',credit:5},{name:'积分',credit:6},
      {name:'积分',credit:-1},{name:'积分',credit:-2},{name:'积分',credit:-3},{name:'积分',credit:-4},
    ],
    gameIdx:0,
    duration:10,
    gameFlag:false,
    achArr:[],
    userInfo:{},
    startDate:'',
    endDate:'',
    rangeReward:{},
  },
  gameStart:function(e){
    if(this.data.userInfo.credit<10){
      wx.showToast({
        title: '积分小于10，无法参与',
        icon:'none',
      });
      return;
    }
    if(this.data.gameFlag){
      return;
    }
    this.creditChange(-2)
    if(t)clearInterval(t);
    const duration=Math.floor(50*Math.random());
    this.setData({gameFlag:true,duration},()=>{
      this.interval(this.data.duration)
    })
  },
  creditChange:function(e,cb){
    post({
      url: '/api/updateCredit',
      data:{credit:e}
    }).then(r => {
      wx.hideLoading();
      if (r&&r.code == 1) {
        let userInfo = r.data;
        this.setData({ userInfo },()=>{
          cb&&cb();
        });
      } else {
        r&&r.msg&&wx.showToast({
          title: r.msg,
          icon:'none'
        })
      }
    });
  },
  interval:function(dur){
    const len=this.data.gameBlock.length;
    t=setTimeout(()=>{
      if(this.data.gameIdx>=len-1){
        this.setData({gameIdx:0});
        this.interval(this.data.duration)
      }else{
        const dur=this.data.duration*1.1;
        if(dur>500){
          console.log(this.data.gameIdx);
          const arr=this.data.gameBlock;
          this.creditChange(arr[this.data.gameIdx].credit,()=>{
            this.setData({gameFlag:false});
          })
          const creditRes=this.data.gameBlock[this.data.gameIdx].credit;
          wx.showModal({
            title: '游戏结果',
            content: creditRes>0?`恭喜积分+${creditRes}`:creditRes<0?`很遗憾，积分${creditRes}`:`积分不变`,
            success(res) {
              if (res.confirm) {

              }else{

              }
            }
          })
          clearTimeout(t)
        }else{
          this.setData({gameIdx:++this.data.gameIdx,duration:dur});
          this.interval(this.data.duration)
        }
      }
    },dur)
  },
  tabSelect(e) {
    const dataset=e.currentTarget.dataset;
    this.setData({
      TabCur: dataset.id,
      scrollLeft: (dataset.id-1)*60
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const d=new Date();
    const y=d.getFullYear();
    const m=d.getMonth();
    let nm=m+2,ny=y;
    if(m==11){
      ny=y+1;
      nm=1;
    }
    this.setData({
      startDate:`${y}-${m+1}-1`,
      endDate:`${ny}-${nm}-1`,
    })
    post({
      url: '/api/getUserInfo'
    }).then(r => {
      wx.hideLoading();
      if (r&&r.code == 1) {
        let userInfo = r.data;
        this.setData({ userInfo });
      }
    })
    post({
      url: '/api/findAch'
    }).then(r => {
      wx.hideLoading();
      if (r&&r.code == 1) {
        const achArr=r.data;
        this.setData({achArr});
      } else {
        r&&r.msg&&wx.showToast({
          title: r.msg,
          icon:'none'
        })
      }
    });
    post({
      url: '/api/findReward'
    }).then(r => {
      wx.hideLoading();
      if (r&&r.code == 1) {
        const d=r.data,rangeReward={};
        for(const it of d){
          if(it.type===1||it.type===2||it.type===3){
            rangeReward[it.type]=it;
          }
        }
        this.setData({rangeReward});
      } else {
        r&&r.msg&&wx.showToast({
          title: r.msg,
          icon:'none'
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.creditRange=this.selectComponent('#creditRange');
    this.creditRange.getRangeOfCredit();
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

  }
})