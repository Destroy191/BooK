// pages/book_detail/book_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "1",
    openid: "0",
    name: "0",
    picture: "0",
    price: 0,
    number: 0,
    hasAddress:false
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
      name: options.name,
      picture: options.picture,
      price: options.price
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
      success: res => {
        console.log(res.data)   
        this.setData({
          list: res.data,
        })
      },
      fail(res){
        console.log("请求失败", res)
      }
    })
    wx.cloud.init()
    wx.cloud.database().collection("address").where({
      _openid: that.data.openid,
      default: true
    }).get({
      success(res) {
        console.log("请求地址成功", res)
        if(res.data[0] != null){
          console.log("找到了地址");
          that.data.hasAddress = true;
        }
        else{
          console.log("没找到地址");
          that.data.hasAddress = false;
        }
      },
      fail(res){
        console.log("请求地址失败", res)
      }
    })
  },

  addBook: function (data) {
    let that = this
    wx.cloud.init()
    const db = wx.cloud.database({env: 'cloud1-0guxl71la2985ced'})
    const _ = db.command
    db.collection("cart").where(_.and([
    {
      book_id: that.data.id
    },
    {
      _openid:app.globalData.openid
    }])).get({
       success(res) {
         console.log("请求成功", res)
         if(res.data.length == 0){
          wx.cloud.init()
          wx.cloud.database().collection('cart').add({
            data: {
              book_id: that.data.id,
              book_name: that.data.name,
              book_picture: that.data.picture,
              book_price: that.data.price,
              checked: false,
              number: 1
            }
          })
         }else{
          console.log("进入else")
          that.setData({
            number:res.data[0].number + 1
          })
          console.log("通过setdata",res.data[0].number)
          wx.cloud.init()
          db.collection("cart").doc(res.data[0]._id).update({
            data:{
              number:that.data.number
            }
          })
         }
         wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 1000//持续的时间
        })
       },
       fail(res){
         console.log("请求失败", res)
       }
     })
  },

  buyBook: function (data){
    console.log(this.data.hasAddress);
    if(!this.data.hasAddress){
      wx.showToast({
        title: '请选择地址',
        icon: 'none'
      })
      return;
    }
    let cart = [{_id: "0", _openid: app.globalData.openid, book_id: this.data.id, book_name: this.data.name, book_picture: this.data.picture, book_price: this.data.price, checked: false, number: 1}];
    console.log(cart)
    var n_cart = JSON.stringify(cart);
    let totalNum = 1;
    let totalPrice = this.data.price;
    wx.navigateTo({
      url: '/pages/order_submit/order_submit?cart=' + n_cart + '&totalNum=' + totalNum + '&totalPrice=' + totalPrice,
      success: () => {
        console.log('传值成功')
      },
      error: () => {
        console.log('传值失败')
      }
    })
  },
})