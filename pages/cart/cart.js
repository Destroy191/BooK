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
    allChecked: true,
    totalPrice: 0,
    totalNum: 0
  },
  onLoad: function (){
    this.setData({
      openid:app.globalData.openid
    })
  },
  onShow: function () {
    //接收来自address_sel页面的地址数据
    this.getAddress();
    // 获取数据库中cart的数据,并计算底部条
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
        // 确定allChecked
        let allChecked = true;
        console.log(1);
        // 确定total
        let totalPrice = 0; 
        let totalNum = 0;
        console.log(2);
        for(let i = 0; i < that.data.cart.length; i++){
          console.log(3);
          if(that.data.cart[i].checked){
            totalPrice+=that.data.cart[i].number*that.data.cart[i].book_price;
            totalNum+=that.data.cart[i].number;
          }
          else{
            allChecked = false;
          }
        }
        console.log(totalPrice);
        console.log(4);
        that.setData({
          allChecked,
          totalPrice,
          totalNum
        })
      },
      fail(res){
        console.log("请求失败", res)
      }
    })
  },
  // 获取地址功能
  async getAddress(){
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
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
  },
  // 选中商品功能
  handleItemChange(e){
    const id = e.currentTarget.dataset.id;
    console.log(id);
    let {cart} = this.data;
    let index = cart.findIndex(v=>v._id===id);
    cart[index].checked = !cart[index].checked;
    this.setData({
      cart
    })
    // 确定allChecked
    const allChecked = this.data.cart.every(v=>v.checked);
    console.log(1);
    // 确定total
    let totalPrice = 0; 
    let totalNum = 0;
    console.log(2);
    for(let i = 0; i < this.data.cart.length; i++){
      if(this.data.cart[i].checked){
        console.log(3);
        totalPrice+=this.data.cart[i].number*this.data.cart[i].book_price;
        totalNum+=this.data.cart[i].number;
      }
    }
    console.log(4);
    this.setData({
      allChecked,
      totalPrice,
      totalNum
    })
    let that = this
    wx.cloud.init()
    var db = wx.cloud.database()
    var  _ = db.command
    db.collection("cart").where({
      _id: id
    }).get({
      success:(res)=>{
        console.log("数据请求成功",res)
        db.collection("cart").doc(res.data[0]._id).update({
          data:{
            checked: that.data.cart[index].checked
          }
        })
      }
    })
  },
  // 全选 反选 功能
  handleItemAllChecked(e){
    let {cart, allChecked} = this.data;
    allChecked = !allChecked;
    cart.forEach(v=>v.checked = allChecked);
    this.setData({
      cart
    })
    // 确定allChecked
    allChecked = this.data.cart.every(v=>v.checked);
    console.log(1);
    // 确定total
    let totalPrice = 0; 
    let totalNum = 0;
    console.log(2);
    for(let i = 0; i < this.data.cart.length; i++){
      if(this.data.cart[i].checked){
        console.log(3);
        totalPrice+=this.data.cart[i].number*this.data.cart[i].book_price;
        totalNum+=this.data.cart[i].number;
      }
    }
    console.log(4);
    this.setData({
      allChecked,
      totalPrice,
      totalNum
    })
    let that = this
    wx.cloud.init()
    var db = wx.cloud.database()
    var  _ = db.command
    db.collection("cart").where({
      _openid:that.data.openid
    }).update({
      data:{
        checked: allChecked
      }
    })
  },
  // 改变商品个数
  async handleItemNumEdit(e){
    const {operation, id} = e.currentTarget.dataset;
    console.log(operation,id);
    let {cart} = this.data;
    const index = cart.findIndex(v=>v._id===id);
    cart[index].number += Number(operation);
    if(cart[index].number === 0){
      wx.showModal({
        title: '提示',
        content: '是否删除该商品',
        success :(res)=>{
          if (res.confirm) {
            cart.splice(index,1);
            this.setData({
              cart
            })
            // 确定allChecked
            const allChecked = this.data.cart.every(v=>v.checked);
            console.log(1);
            // 确定total
            let totalPrice = 0; 
            let totalNum = 0;
            console.log(2);
            for(let i = 0; i < this.data.cart.length; i++){
              if(this.data.cart[i].checked){
                console.log(3);
                totalPrice+=this.data.cart[i].number*this.data.cart[i].book_price;
                totalNum+=this.data.cart[i].number;
              }
            }
            console.log(4);
            this.setData({
              allChecked,
              totalPrice,
              totalNum
            })
            let that = this
            wx.cloud.init()
            var db = wx.cloud.database()
            var  _ = db.command
            db.collection("cart").where({
              _id: id
            }).get({
              success:(res)=>{
                console.log("数据删除成功",res)
                db.collection("cart").doc(res.data[0]._id).remove({
                  success: function(res) {
                    that.onShow()
                  }
                })
              }
            })
          } else if (res.cancel) {
            cart[index].number = 1;
            this.setData({
              cart
            })
            // 确定allChecked
            const allChecked = this.data.cart.every(v=>v.checked);
            console.log(1);
            // 确定total
            let totalPrice = 0; 
            let totalNum = 0;
            console.log(2);
            for(let i = 0; i < this.data.cart.length; i++){
              if(this.data.cart[i].checked){
                console.log(3);
                totalPrice+=this.data.cart[i].number*this.data.cart[i].book_price;
                totalNum+=this.data.cart[i].number;
              }
            }
            console.log(4);
            this.setData({
              allChecked,
              totalPrice,
              totalNum
            })
            let that = this
            wx.cloud.init()
            var db = wx.cloud.database()
            var  _ = db.command
            db.collection("cart").where({
              _id: id
            }).get({
              success:(res)=>{
                console.log("数据修改成功",res)
                db.collection("cart").doc(res.data[0]._id).update({
                  data:{
                    number: that.data.cart[index].number
                  }
                })
              }
            })
          }
        }
      })
    }
    else{
      this.setData({
        cart
      })
      // 确定allChecked
      const allChecked = this.data.cart.every(v=>v.checked);
      console.log(1);
      // 确定total
      let totalPrice = 0; 
      let totalNum = 0;
      console.log(2);
      for(let i = 0; i < this.data.cart.length; i++){
        if(this.data.cart[i].checked){
          console.log(3);
          totalPrice+=this.data.cart[i].number*this.data.cart[i].book_price;
          totalNum+=this.data.cart[i].number;
        }
      }
      console.log(4);
      this.setData({
        allChecked,
        totalPrice,
        totalNum
      })
      let that = this
      wx.cloud.init()
      var db = wx.cloud.database()
      var  _ = db.command
      db.collection("cart").where({
        _id: id
      }).get({
        success:(res)=>{
          console.log("数据修改成功",res)
          db.collection("cart").doc(res.data[0]._id).update({
            data:{
              number: that.data.cart[index].number
            }
          })
        }
      })
    }
  },
  // 结算功能
  async handlePay(e){
    const {address, totalNum} = this.data;
    if(!address.name){
      wx.showToast({
        title: '请选择地址',
        icon: 'none'
      })
      return;
    }
    if(totalNum === 0){
      wx.showToast({
        title: '请选购商品',
        icon: 'none'
      })
      return;
    }
    var n_address = JSON.stringify(this.data.address);
    var cart = JSON.stringify(this.data.cart);
    var n_totalNum = String(this.data.totalNum);
    var totalPrice = String(this.data.totalPrice);
    wx.navigateTo({
      url: '/pages/order_submit/order_submit?address=' + n_address + '&cart=' + cart + '&totalNum=' + n_totalNum + '&totalPrice=' + totalPrice
    })
  },
  //获取地址按钮事件
  handleChooseAddress(){
    wx.navigateTo({
      url: '/pages/address_sel/address_sel',
    })
  }
})