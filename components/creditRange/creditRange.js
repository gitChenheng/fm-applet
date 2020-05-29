import {post} from '../../utils/request';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rangeData:{
      type:Array
    },
    myPosi:{
      type:Number
    }
  },
  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    getRangeOfCredit:function(e){
      post({
        url: '/api/getRangesByCredit'
      }).then(r => {
        if (r&&r.code == 1) {
          this.setData({ rangeData: r.data.creditRange,myPosi:r.data.myPosi })
        } else {
          r&&r.msg&&wx.showToast({
            title: r.msg,
          })
        }
      })
    }
  }
})
