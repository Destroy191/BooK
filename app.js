App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
   
    // 登录
    wx.login({
      data: {  openid: ''}, // 获取用户openid
      getOpenid: function() {  
        let that = this;  //获取openid不需要授权
        wx.login({   
          success: function(res) {    //请求自己后台获取用户openid
            wx.request({     
              url: 'https://30paotui.com/user/wechat',     
              data: {
                appid: '你的小程序appid',  
                secret: '你的小程序secret',      
                code: res.code
              },
              success: function(response) {
                var openid = response.data.openid;      
                console.log('请求获取openid:' + openid); 
                //可以把openid存到本地，方便以后调用
               // wx.setStorageSync('openid', openid);
                that.setData({
                  openid: openid
                })
              }
            })
          }
        })
       },
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              console.log(this.globalData.openid)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openid:null
  }
})