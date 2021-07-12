// pages/cart/cart.js
/*
  1 获取用户的收货地址
    1 绑定点击事件
    2 调用地址选择页面
*/
Page({
  data: {
    isSelectAddress: false,
    region: ['北京市', '北京市', '朝阳区'],
    name:'',
    mobile:'',
    detailed:'',
    address:[]
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
        isSelectAddress: true,
        region: this.data.address.region,
        detailed: this.data.address.detailed,
        name: this.data.address.name,
        mobile: this.data.address.mobile
      })
    }
    else{
      this.setData({
        isSelectAddress: false
      })
    }
  },
  handleChooseAddress(){
    console.log("点了");
    wx.navigateTo({
      url: '/pages/address_sel/address_sel',
    })
  }
})