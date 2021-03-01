/*
  1用户上滑页面 滚动条触底，开始加载下一页
    1先找到微信开发文档的滚动条触底事件
    2判断还有没有下一页数据
      一、获取到总页数   总条数total、总页数=Math.ceil(total/pagesize)=23/10=3
      二、获取到当前页码 pagenum
      三、判断当前页码是否大于等于总页数（即没有下一页数据）

      1没有下一页数据：提示框
      2有下一页数据，加载下一页数据
        当前页面++
        重新发送请求获取数据
          数据请求回来之后，要对data中的数组进行拼接而不是全部替换！！！
  2下拉刷新事件
    1触发下拉刷新事件(并添加逻辑) 需要在页面的json文件中开启配置
    2重置数据数组
    3重置页码 设置为1
    4重新发送请求
    5数据已经请求回来，需要手动关闭等待效果

*/
//引入用来发送请求的方法
import{request}from "../../request/index.js";
// pages/goods_list/goods_list.js
Page({
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]

  },

  //接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  //总页数
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();

  },
  //获取商品列表数据
  getGoodsList(){
    request({
      url:"/goods/search",
      data:this.QueryParams
    })
    .then(res=>{
      console.log(res);
      //获取总条数
      const total=res.data.message.total;
      //计算总页数
      this.totalPages=Math.ceil(total/this.QueryParams.pagesize);
      console.log(this.totalPages);
      this.setData({
        //替换 goodsList:res.data.message.goods
        //拼接
        goodsList:[...this.data.goodsList,...res.data.message.goods]
      })
    })
    //数据请求成功，关闭下拉刷新的三个点的效果 如果没有调用下拉刷新窗口直接关闭对页面没有影响
    wx.stopPullDownRefresh();
  },



  //标题的点击事件  从子组件传递过来
  handleTabsItemChange(e){
    //1获取被点击的标题索引
    const {index}=e.detail;
    //2修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i) =>i===index?v.isActive=true:v.isActive=false );
    //3赋值到data中
    this.setData({
      tabs
    })

  },


  //滚动条触底事件
  onReachBottom(e){
    //console.log("页面触底");
    //1判断还有没有下一页数据
    if(this.QueryParams.pagenum>=this.totalPages){
      //没有下一页数据
      //console.log("没有下一页数据");
      wx.showToast({
        title: '没有下一页数据'
      });
    }
    else{
      //还有下一页数据
      console.log("有下一页数据");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },

  //下拉刷新事件
  onPullDownRefresh(){
    //console.log("刷新");
    //重置数组
    this.setData({
      goodsList:[]
    })
    //重置页码
    this.QueryParams.pagenum=1;
    //重新发送请求
    this.getGoodsList();
  }


})