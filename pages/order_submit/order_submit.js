// pages/order_submit/order_submit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onLoad: function (options) {
    this.setData({
      address: JSON.parse(options.address),
      cart: JSON.parse(options.cart),
      totalNum: Number(options.totalNum),
      totalPrice: Number(options.totalPrice)
    })
  }
})