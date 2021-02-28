/*
  1发送请求获取数据
  2点击轮播图预览大图功能
    给轮播图绑定点击事件
    调用小程序的api  previewImage
  3点击加入购物车
    绑定点击事件
    获取缓存中的购物车数据 数组格式
    先判断当前商品是否已经存在于购物车
    如果已经存在，修改商品数据，执行购物车数量++，重新把购物车数组 填充回缓存中
    如果不存在，直接给购物车数组添加一个新元素，带上一个购买数量属性 重新把购物车数组 填充回缓存中
    弹出提示
  4商品收藏
    1页面onShow的时候 加载缓存中的商品收藏数据
    2判断当前商品是不是被收藏
      1是 改变页面图标
      2不是
    3点击商品收藏按钮
      1判断该商品是否存在于缓存数组中
      2已经存在  把该商品删除
      3不存在  把商品添加到收藏数组中  存入缓存数组中
*/
// pages/goods_detail/goods_detail.js
//引入用来发送请求的方法
import{request}from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //优化数据
    goodsObj:{},
    //商品是否被收藏过，默认未被选中
    isCollect:false,

  },
  //全局商品对象
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages =  getCurrentPages();
    let currentPages=pages[pages.length-1];
    let options=currentPages.options;
    const {goods_id}=options; 
    this.getGoodsDetail(goods_id);
    //console.log(goods_id);
  },
  //获取商品详情数据
  getGoodsDetail(goods_id){
    request({
      url:"/goods/detail",
      data:{goods_id}
    })
    .then(res=>{
      this.GoodsInfo=res;
    //1获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    //2判断当前商品是否被收藏
    let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.data.message.goods_id);
      //console.log(res);

      this.setData({
        goodsObj:{
          goods_name:res.data.message.goods_name,
          goods_price:res.data.message.goods_price,
          //iphone部分手机不识别webp图片格式
          //最好找到后台工程师，请他修改
          //临时自己修改的方法：确保后台存在1.webp 和1.jpg 图片
          goods_introduce:res.data.message.goods_introduce.replace(/\.webp/g,'.jpg'),
          pics:res.data.message.pics
        },
        isCollect
      })
    })
  },



  //点击轮播图放大预览
  handlePriviewImage(e){
    //console.log("预览");
    //1先构造要预览的图片数组
    //const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);//构造新数组，返回字符串
    const urls=this.GoodsInfo.data.message.pics.map(v=>v.pics_mid);
    console.log(urls);
    console.log("test");
    //2接收传递过来的图片url
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls,
    });
  },
  //点击加入购物车
  handleCartAdd(e){
    console.log("购物车");
    //获取缓存中的购物车数组cart
    let cart=wx.getStorageSync("cart")||[];//第一次获取是空字符串，需要转换格式
    //判断商品对象是否存在于购物车数组中 cart[index]是cart的元素,cart[index].num是某个元素的num属性
    let index=cart.findIndex(v=>v.data.message.goods_id===this.GoodsInfo.data.message.goods_id);
    if(index===-1){
      //不存在，第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }
    else{
      //已经存在，num++
      cart[index].num++;
    }
    //购物车重新添加回缓存
    wx.setStorageSync("cart",cart);
    //弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      image: '',
      duration: 1500,
      mask: true,//防止用户手抖 疯狂点击按钮
     
    });
  },
  //点击 商品收藏图标
  handleCollect(){
    let isCollect=false;
    //1 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    //2判断该商品是否被收藏过
    let index =collect.findIndex(v=>v.goods_id===this.GoodsInfo.data.message.goods_id);
    //3当index!=-1表示已经被收藏过
    if(index!==-1){
      //能找到，已经收藏过了，在数组中删除该商品
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    }
    else{
      //没有收藏过
      collect.push(this.GoodsInfo.data.message);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    //4把数组存入缓存中
    wx.setStorageSync("collect", collect);
    //5修改data中的属性 isCollect
    this.setData({
      isCollect,
    })
  }
  
})