// pages/book_list/book_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      Index: "教育",
      name:"建筑力学",
      list:[],
  },
  
  getList(){
    //在数据库中获取相关的订单信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      Index: options.type,
      name: options.name,
    })
    this.getList()
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
    let that = this
    if(this.data.Index){
      wx.cloud.init()
      const db = wx.cloud.database({env: 'cloud1-0guxl71la2985ced'})
      const _ = db.command
      db.collection("book").where({
        type:db.RegExp({
          regexp: this.data.Index,
          options: 'i',
        })
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
  }else{
    wx.cloud.init()
      const db = wx.cloud.database({env: 'cloud1-0guxl71la2985ced'})
      const _ = db.command
      db.collection("book").where({
        name:db.RegExp({
          regexp: this.data.name,
          options: 'i',
        })
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
    }
  },
})