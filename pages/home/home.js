// home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      content:"1",
      list:[],
      list4:[],
      imgUrls:['https://i.niupic.com/images/2021/07/12/9nBl.jpg',
        'https://i.niupic.com/images/2021/07/12/9nBj.jpg',
        'https://i.niupic.com/images/2021/07/12/9nBE.jpg',
        'https://i.niupic.com/images/2021/07/12/9nAY.jpg'
      ],
      indicatorDots:true,
      autoplay:true,
      interval:5000,
      duration:1000
  },

  onLoad: function (options) {
    
  },

  onShow: function () {
    //在数据库获取用户的地址信息和默认地址信息
      let that = this
      wx.cloud.init()
      var db = wx.cloud.database()
      var _ = db.command
      db.collection("book").where({

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

      wx.cloud.init()
      db.collection("book").where(_.or([
        {
          _id: "1"
        },
        {
          _id: "2"
        },
        {
          _id: "3"
        },
        {
          _id: "4"
        }])).get({
        success(res) {
          console.log("请求成功", res)
          that.setData({
            list4: res.data
          })
        },
        fail(res){
          console.log("请求失败", res)
        }
      })
    },

  SearchInput:function (e) {
    this.setData({
      content:e.detail.value
    })
  },

  Searchfun:function(e){
    let that = this
    this.setData({
      content:this.data.content
    })
    wx.navigateTo({
      url: '/pages/book_list/book_list?name=' + this.data.content,
      success: () => {
        console.log('传值成功')
      },
      error: () => {
        console.log('传值失败')
      }
    })
    },
})