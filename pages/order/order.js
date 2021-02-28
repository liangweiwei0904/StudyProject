// pages/order/order.js
/*
1页面打开的时候 onShow
  0 onShow不同于onLoad 无法在形参上接收options参数
  0.5 判断缓存中有没有token
    1没有 直接跳转到授权页面
    2有 直接往下进行
  1获取url上的参数type
  2根据type值来决定页面标题数组哪个被激活选中
  2根据type值 发送请求获取不同的订单数据
  3渲染页面
2点击不同标题 重新发送请求获取和渲染数据

*/

import {request} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:{},
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      }
    ],
  },
  onShow(options){
    //1获取当前小程序的页面栈---数组   长度最大是10各页面
    const token=wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }
    let pages =  getCurrentPages();
    //2数组中索引最大的页面就是当前页面
    let currentPages=pages[pages.length-1];
    console.log(currentPages.options);
    console.log(pages);
    //console.log(options);  无法直接获取到
    //3获取url上的type参数
    const {type}=currentPages.options;
    //4激活选中页面标题
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  },

  //获取订单列表的方法
  async getOrders(type){
    const res=await request({url:"/my/orders/all",data:{type}});
    //console.log(res);
    this.setData({
      orders:res.data.message.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())})),
    })

  },
  //根据标题的索引来激活选中标题数组
  changeTitleByIndex(index){
    let {tabs}=this.data;
    tabs.forEach((v,i) =>i===index?v.isActive=true:v.isActive=false );
    //3赋值到data中
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e){
    //1获取被点击的标题索引
    const {index}=e.detail;
    this.changeTitleByIndex(index);
    //2重新发送请求 type=1 index=0
    this.getOrders(index+1);

  },
  
})