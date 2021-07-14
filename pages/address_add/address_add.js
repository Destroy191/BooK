// pages/addressAdd/index.js
const app = getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    name:'',
    mobile:'',
    detailed:'',
    addressIs:true,
    number:0,
    id:0
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  bindKeyName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindKeyMobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  bindKeyDetailed: function (e) {
    this.setData({
      detailed: e.detail.value
    })
  },
  submitFun: function () {
    if (this.data.addressIs){
      //添加一条信息地址信息至数据库
      wx.cloud.init()
      wx.cloud.database().collection('address').add({
        data: {
          name: this.data.name,
          mobile: this.data.mobile,
          detailed: this.data.detailed,
          city: this.data.region,
          default:false,
          openid:18074315,
          id:this.data.number
        }
      })
      wx.navigateBack({
        delta: 1
      })
    }else{
      //修改当前数据库的信息
      let that = this
      wx.cloud.init()
      var db = wx.cloud.database()
      var  _ = db.command
      db.collection("address").where({
        id:that.data.id
      }).get({
        success:(res)=>{
          console.log("数据请求成功",res)
          db.collection("address").doc(res.data[0]._id).update({
            data:{
              name: this.data.name,
              mobile: this.data.mobile,
              detailed: this.data.detailed,
              city: this.data.region
            }
          })
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      number: Number(options.number)+1
    })
    if (options.id){
      this.setData({
          region: options.city.split(','),
          name: options.name,
          mobile: options.mobile,
          detailed: options.detailed,
          id: Number(options.id),
          addressIs:false
      })
      console.log(this.data.number)
      console.log(this.data.id)
    }
  }
})