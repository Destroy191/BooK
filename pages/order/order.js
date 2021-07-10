const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 1,
    list: []
  },
  tabFun(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
    this.getList()
  },
  getList(){
    //在数据库中获取相关的订单信息
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tabIndex: options.type||1
    })
    this.getList()
  }
})