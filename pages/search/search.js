/*
1输入框绑定事件 值改变事件 input事件
  1获取到输入框的值
  2简单合法性判断
  3检验通过 把输入框的值返回后台
  4返回的数据打印到页面上
2防抖（防止页面抖动）  定时器  节流
  0防抖 一般用于输入框中 防止重复输入 重复发送请求
  1节流 一般是用在页面上拉和下拉
  1定义一个全局定时器id

*/
import {request} from "../../request/index.js";
Page({
  data: {
    goods:[],
    //取消 按钮是否显示
    isFocus:false,
    //输入框的值
    inpValue:""
  },
  TimeId:-1,
  //输入框值改变就会触发的事件
  handleInput(e){
    //1获取输入框的值
    const {value}=e.detail;
    //2检查合法性
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
      console.log("删除了");
      //trim去掉两边的空格
      //满足条件表示这个value不合法
      return;
    }
    //3准发送请求获取数据
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);  //清除定时器，然后立马开启一个定时器，一秒钟之后执行
    this.TimeId=setTimeout(()=>{
      this.qsearch(value);
    },1000);
    

  },
  //发送请求获取搜索建议的数据
  async qsearch(query){
    const res=await request({url:"/goods/search",data:{query}});
    console.log(res);
    this.setData({
      goods:res.data.message.goods
    })
  },

  //点击取消按钮之后
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    })
  }
})