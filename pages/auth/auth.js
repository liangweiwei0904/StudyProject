import{request}from "../../request/index.js";
import{login} from "../../utils/asyncWx.js";
// pages/auth/auth.js
Page({
  //获取用户信息
 async handleGetUserInfo(e){
    console.log(e);
    try {
      //1获取用户信息
    const {encryptedData,rawData,iv,signature}=e.detail;
    //2获取小程序登录成功后的code值
    const {code}=await login();
    console.log(code);
    const loginParams={encryptedData,rawData,iv,signature,code};
    //3发送请求获取用户的token值
    const res=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
    //const token=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
    //console.log(token);
    //4把token存入缓存中 同时跳转回上一个页面
    wx.setStorageSync("token", 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo');
    //wx.setStorageSync("token", token);
    wx.navigateBack({
      delta: 1  //1表示返回1层
    });
    } catch (error) {
      console.log(error);
    }
  }
})

//蹄膀一袋，三个西红柿
//一个素菜：土豆辣椒
//土豆