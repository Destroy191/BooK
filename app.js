App({

  globalData: {
    userInfo: null,
    openid:null
  },

  onLaunch: function () {
    let that = this
    wx.login({
      success: res => {
        wx.request({
          url: 'http://api.weixin.qq.com/sns/jscode2session',
          data:{
            appid: 'wx7f9a3a72d989e475',
            secret: 'cefa4d158225fb168e21a72b6c16a690',
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          method:"GET",
          success:function(res){
            that.globalData.openid = res.data.openid
            console.log(that.globalData.openid)
          }
        })
        wx.getUserInfo({
          success: function (res) {
            var simpleUser = res.userInfo;
            that.globalData.userInfo = simpleUser;
          }
        });
      }
    })
  }
})

