const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: 1,
    list: [],
    id:'0'
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
        id:options._id,
        tabIndex:options.type
    })
    this.getList()
  },

  submitFun_buy: function (data) {
    //修改当前数据库的信息
    console.log("传值",data)
    wx.showModal({
      title: '支付订单',
      content: '是否支付该订单',
      success :(res)=>{
        if (res.confirm) {
          let that = this
          wx.cloud.init()
          var db = wx.cloud.database()
          var  _ = db.command
          db.collection("order").where({
            _id:data.currentTarget.dataset.item._id
          }).get({
            success:(res)=>{
              console.log("数据请求成功",res)
              db.collection("order").doc(res.data[0]._id).update({
                data:{
                  state:"2"
                },
                success:(res)=>{
                  that.onShow()
                }
              })
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },

  submitFun_rec: function (data) {
    //修改当前数据库的信息
    console.log("传值",data)
    wx.showModal({
      title: '确认收货',
      content: '是否完成该订单',
      success :(res)=>{
        if (res.confirm) {
          let that = this
          wx.cloud.init()
          var db = wx.cloud.database()
          var  _ = db.command
          db.collection("order").where({
            _id:data.currentTarget.dataset.item._id
          }).get({
            success:(res)=>{
              console.log("数据请求成功",res)
              db.collection("order").doc(res.data[0]._id).update({
                data:{
                  state:"3"
                },
                success:(res)=>{
                  that.onShow()
                }
              })
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },

  dele: function (data) {
    //修改当前数据库的信息
    console.log("传值",data)
    wx.showModal({
      title: '删除订单',
      content: '是否删除该订单',
      success :(res)=>{
        if (res.confirm) {
          let that = this
          wx.cloud.init()
          var db = wx.cloud.database()
          var  _ = db.command
          db.collection("order").where({
            _id:data.currentTarget.dataset.item._id
          }).get({
            success:(res)=>{
              console.log("数据请求成功",res)
              db.collection("order").doc(res.data[0]._id).remove({
                success: function(res) {
                  console.log(res.data)
                  that.onShow()
                }
              })
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },

  onShow: function () {
    //在数据库获取用户的地址信息和默认地址信息
      let that = this
      wx.cloud.init()
      wx.cloud.database().collection("order").where({
        _openid:that.data.openid
      }).get({
        success(res) {
          console.log("请求成功", res)
          that.setData({
            list: res.data
          })
          console.log("赋值",that.data.list)
          for (var index in that.data.list){
            if(that.data.list[index].default == true){
              that.setData({
                id : that.data.list[index].id
              })
            }
          }
        },
        fail(res){
          console.log("请求失败", res)
        }
      })
    }
})