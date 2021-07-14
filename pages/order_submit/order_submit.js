// pages/order_submit/order_submit.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid:null,
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
    state: ""
  },
  onLoad: function (options) {
    this.setData({
      openid:app.globalData.openid
    })
    let that = this
    wx.cloud.init()
    wx.cloud.database().collection("address").where({
      _openid: that.data.openid,
      default: true
    }).get({
      success(res) {
        console.log("请求地址成功", res)
        that.setData({
          address: {region: res.data[0].city, detailed: res.data[0].detailed, mobile: res.data[0].mobile, name: res.data[0].name, address_id: res.data[0].id}
        })
        console.log("请求地址成功", that.data.address);
      },
      fail(res){
        console.log("请求地址失败", res)
      }
    })
    this.setData({
      cart: JSON.parse(options.cart),
      totalNum: Number(options.totalNum),
      totalPrice: Number(options.totalPrice)
    })
  },
  handlePay(e){
    wx.showModal({
      title: '支付订单',
      content: '是否支付该订单',
      success :(res)=>{
        if (res.confirm) {
          this.data.state = "2";
          this.haneldeOrder();
        } else if (res.cancel) {
          this.data.state = "1";
          this.haneldeOrder();
        }
      }
    })
  },
  haneldeOrder(){
    let that = this
    wx.cloud.init()
    wx.cloud.database().collection('order').add({
      data: {
        address: that.data.address.region,
        author: that.data.address.name,
        detailed: that.data.address.detailed,
        goods: that.data.totalNum,
        image: that.data.cart[0].book_picture,
        mobile: that.data.address.mobile,
        state: that.data.state,
        time: wx.cloud.database().serverDate(),
        totalPrice: that.data.totalPrice
      }
    })
    wx.navigateBack({
      delta: 1,
    })
  }
})