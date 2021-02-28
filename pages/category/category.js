//引入用来发送请求的方法
import{request}from "../../request/index.js";
// pages/category/category.js
Page({

  
/**
   * 页面的初始数据
   */
  data: {
    //左侧菜单数据
    LeftMeauList:[],
    //右侧商品数据
    RightContent:[],
    //被点击的左侧菜单
    currentIndex:0,
    //右侧滚动条距离顶部的距离
    scrollTop:0
    
  },
  //接口的返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    /*web中的本地存储和小程序的本地存储的区别：
      1写代码的方式
        web:localStorage.setItem("key","value")  localStorage.getItem("key")
        小程序：wx.setStorageSync("key","value")  wx.getStorageSync("key")
      2存储的时候是否类型转换
        web中无论存入的是什么数据，都会调用toString(),把数据变成字符串存入
        小程序中不存在类型转换的操作 存什么类型的数据进去，就会获取什么类型的数据
    */
    // 先判断本地存储中有没有旧的数据
    /*  {time:Data.now(),data:[...]}   */
     
    //没有旧数据 直接发送新请求
    //有旧数据，且旧数据并没有过期，则使用本地存储中的旧数据
    //this.getCates();
    //1获取本地存储中的数据 （小程序中存在本地存储技术）
    const Cates=wx.getStorageSync("cates");
    //2判断
    if(!Cates){
      //不存在，发送请求数据
      this.getCates();
    }
    else{
      //有旧的数据 暂时定义一个过期时间为10s   5min
      if(Date.now()-Cates.time>1000*5){
        //重新发送请求
        this.getCates();
      }
      else{
        //可以使用旧数据
        //console.log("可以使用旧数据");
        this.Cates=Cates.data;
        //构造左侧的大菜单数据
        let LeftMeauList=this.Cates.map(v=>v.cat_name);
        //构造右侧商品数据
        let RightContent=this.Cates[0].children;
        this.setData({
          LeftMeauList,
          RightContent
        })
      }
    }

  },
  //获取分类数据
  getCates(){
    request({
      url:"/categories"
    })
    .then(res=>{
      this.Cates=res.data.message;
      //把接口的数据存到本地存储中
      wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});


      //console.log(res);
      //构造左侧的大菜单数据
      let LeftMeauList=this.Cates.map(v=>v.cat_name);
      //构造右侧商品数据
      let RightContent=this.Cates[0].children;
      this.setData({
        LeftMeauList,
        RightContent
      })
    })
  },
  //左侧菜单的点击事件
  handleItemTap(e){
    // 获取被点击标题身上的索引
    //给data中的currentIndex赋值
    //根据不同的索引渲染右侧的商品内容
    //console.log(e);
    const {index}=e.currentTarget.dataset;
    let RightContent=this.Cates[index].children;
    this.setData({
      currentIndex:index,
      RightContent,
      //重新设置右侧内容的scroll-view标签距离顶部的距离
      scrollTop:0
    })
  }
})