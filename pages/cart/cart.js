// pages/cart/cart.js
/*
  1 获取用户的收货地址
    1 绑定点击事件
    2 调用地址选择页面
*/
const app = getApp()
Page({
  data: {
    openid:null,
    isSelectAddress: false,
    address:[],
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onLoad: function (){
    this.setData({
      openid:app.globalData.openid
    })
  },
  onShow: function () {
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    //接收来自address_sel页面的地址数据
    this.setData({
      address: currPage.__data__.address,
    })
    if(this.data.address.name){
      this.setData({
        isSelectAddress: true
      })
    }
    else{
      this.setData({
        isSelectAddress: false
      })
    }
    // 获取数据库中cart的数据
    let that = this
    wx.cloud.init()
    wx.cloud.database().collection("cart").where({
       _openid:that.data.openid
    }).get({
      success(res) {
        console.log("请求成功", res)
        that.setData({
          cart: res.data
        })
      },
      fail(res){
        console.log("请求失败", res)
      }
    })
    // 确定allChecked
    const allChecked = this.data.cart.every(v=>v.checked);
    // 确定total
    let totalPrice = 0; 
    let totalNum = 0;
    for(let i = 0; i < this.data.cart.length; i++){
      if(this.data.cart[i].checked){
        totalPrice+=this.data.cart[i].number*this.data.cart[i].book_price;
        totalNum+=this.data.cart[i].number;
        console.log(totalNum);
        console.log(totalPrice);
      }
    }
    this.setData({
      allChecked,
      totalPrice,
      totalNum
    })
  },
  handleItemChange(e){
    const cart_id = e.currentTarget.dataset.id;
    console.log(cart_id);
    let {cart} = this.data;
    let index = cart.findIndex(v=>v._id===cart_id);
    cart[index].checked = !cart[index].checked;
    this.setData({
      cart
    })
    let that = this
    wx.cloud.init()
    var db = wx.cloud.database()
    var  _ = db.command
    db.collection("cart").where({
      _id: cart_id
    }).get({
      success:(res)=>{
        console.log("数据请求成功",res)
        db.collection("cart").doc(res.data[0]._id).update({
          data:{
            checked: this.data.cart[index].checked
          }
        })
      }
    })
    // 确定allChecked
    const allChecked = this.data.cart.every(v=>v.checked);
    // 确定total
    let totalPrice = 0; 
    let totalNum = 0;
    for(let i = 0; i < this.data.cart.length; i++){
      if(this.data.cart[i].checked){
        totalPrice+=this.data.cart[i].number*this.data.cart[i].book_price;
        totalNum+=this.data.cart[i].number;
        console.log(totalNum);
        console.log(totalPrice);
      }
    }
    this.setData({
      allChecked,
      totalPrice,
      totalNum
    })
  },
  handleChooseAddress(){
    console.log("点了");
    wx.navigateTo({
      url: '/pages/address_sel/address_sel',
    })
  }
})