/*
1页面加载的时候
  1从缓存中获取购物车数据 渲染到页面中
    这些数据的checked属性为true
2微信支付
  1哪些人哪些账号可以实现微信支付
    1企业账号
    2企业账号小程序后台中 必须 给开发者添加上白名单
      1一个appid可以绑定多个开发者
      2这些开发者就可以共用这个appid和它的开发权限了
3支付按钮
  1先判断缓存中有没有token
  2没有 跳转到授权页面 艰辛获取token
  3有token 进行下一步
  4创建订单 获取订单编号
  5已经完成支付
  6手动删除缓存中 已经被选中了的商品
  7删除后的购物车数据 重新填充回缓存
  8跳转页面
*/
import{ chooseAddress, getSetting, showModal,showToast, requestPayment} from "../../utils/asyncWx.js";
import{request}from "../../request/index.js";

Page({
  data:{
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(options){
     
    //1获取缓存中的收货地址信息，购物车数据
    const address=wx.getStorageSync("address");
    let cart=wx.getStorageSync("cart")||[];
    //过滤后的购物车数组
    cart=cart.filter(v=>v.checked); 
    //1总价格和总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      totalPrice+=v.num*v.data.message.goods_price;
      totalNum+=v.num;
    })
    //2给data赋值
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    })
  },
  //点击支付
  async handleOrderPay(){
    try {
          //1判断缓存中有没有token
    const token=wx.getStorageSync("token");
    //2判断
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }
    console.log("已经存在token");
    //3创建订单
    //3.1准备 请求头参数
    //const header ={Authorization:token};
    //3.2准备 请求体参数
    const order_price=this.data.totalPrice;
    const consignee_addr=this.data.address.all;
    const cart=this.data.cart;
    let goods=[];  //先定义一个空数组
    cart.forEach(v=>goods.push({
      goods_id:v.data.message.goods_id,
      goods_number:v.num,
      goods_price:v.data.message.goods_price,
    }))
console.log(goods);
console.log("order_price"+order_price,"consignee_addr"+consignee_addr);
    const orderParams={order_price,consignee_addr,goods};
    //4准备发送请求 创建订单 获取订单编号
    const res1=await request({url:"/my/orders/create",method:"post",data:orderParams});
    const order_number=res1.data.message.order_number;
    //5发起预支付 接口
    const res2=await request({url:"/my/orders/req_unifiedorder",method:"post",data:{order_number}});
    const {pay}=res2.data.message;
    //6发起微信支付
    await requestPayment(pay);
    //7查询后台订单状态
    const res=await request({url:"/my/orders/chkOrder",method:"post",data:{order_number}});
    await showToast({title:"支付成功"});
    //8 手动删除缓存中 已经支付了的商品
    let newCart=wx.getStorageSync("cart");
    newCart=newCart.filter(v=>!v.checked);//留下来未被选中的
    wx.setStorageSync("cart", newCart);

    //8支付成功 跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/order',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    //3.3
    } catch (error) {
      console.log(error);
      await showToast({title:"支付失败"});
    }
  },


  



})   
