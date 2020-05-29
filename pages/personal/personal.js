import {post} from '../../utils/request';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    options:{},
    person:{},
    achieveData:[],
    achPoint:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options});
    post({
      url: '/api/findUser',
      data:{personalId:options.id}
    }).then(r => {
      if (r&&r.code == 1) {
        const person=r.data;
        this.setData({person});
        if(person.achieve){
          post({
            url: '/api/findAch'
          }).then(r => {
            wx.hideLoading();
            if (r&&r.code == 1) {
              const achArr=r.data;
              const has_achArr=person.achieve.split(',');
              let lastArr=[],achPoint=0;
              has_achArr.forEach(it => {
                for (let i = 0; i < achArr.length; i++) {
                  if(String(achArr[i].id)===it){
                    lastArr.push(achArr[i]);
                    achPoint+=achArr[i].point;
                    break;
                  }
                }
              });
              this.setData({achieveData:lastArr,achPoint});
            } else {
              r&&r.msg&&wx.showToast({
                title: r.msg,
                icon:'none'
              })
            }
          })
        }
      } else {
        r&&r.msg&&wx.showToast({
          title: r.msg,
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