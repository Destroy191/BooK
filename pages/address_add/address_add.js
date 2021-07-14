// pages/addressAdd/index.js
const app = getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    region: ['北京市', '北京市', '朝阳区'],
    customItem: '全部',
    name:'',
    mobile:'',
    detailed:'',
    addressIs:true,
    number:0,
    id:0,
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
      if(this.check()){
        wx.cloud.init()
        wx.cloud.database().collection('address').add({
          data: {
            name: this.data.name,
            mobile: this.data.mobile,
            detailed: this.data.detailed,
            city: this.data.region,
            default:false,
            id:this.data.number
          },
          success:(res)=>{
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    }else{
      //修改当前数据库的信息
      if(this.check()){
        let that = this
        wx.cloud.init()
        var db = wx.cloud.database()
        var  _ = db.command
        db.collection("address").where({
          _openid:that.data.openid,
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
              },
              success:(res)=>{
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          }
        })
      }
    }
  },
  onLoad: function (options) {
    this.setData({
      number: Number(options.number)+1,
      openid: app.globalData.openid
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
  },
  check :function() {
    //此函数用于检测输入的地址信息是否合法，目前可检测手机号的合法性
    let that = this;
    let phone = that.data.mobile;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if(phone.length == 0){
      wx.showToast({
         title: '输入的手机号为空',
         icon: 'none',
          duration: 1500
      });
      return false;
    }else if (phone.length != 11) {
        wx.showToast({
          title: '手机号长度有误！',
          icon: 'none',
          duration: 1500
       });
    return false;
    } else if (!myreg.test(phone)) {
       wx.showToast({
           title: '手机号有误！',
            icon: 'none',
            duration: 1500
        });
        return false;
    }
    if (!(/^[\u4E00-\u9FA5A-Za-z]+$/.test(that.data.name))) {
      wx.showToast({
      title: '姓名有误',
      icon: 'none',
      duration: 1500
      });
      return false;
    }
    return true;
  }
})