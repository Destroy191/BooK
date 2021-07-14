// pages/book_detail/book_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "1",
  },

  getList(){
    //在数据库中获取相关的订单信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
    })
    this.getList()
  },

  onShow: function () {
    let that = this
    wx.cloud.init()
    const db = wx.cloud.database({env: 'cloud1-0guxl71la2985ced'})
		const _ = db.command
    db.collection("book").where({
     _id: this.data.id
    }).get({
      success(res) {
        console.log("请求成功", res)
        that.setData({
          list: res.data
        })
      },
      fail(res){
        console.log("请求失败", res)
      }
    })
  },

  addBook: function () {

  },

  buyBook: function () {
    
  }
})