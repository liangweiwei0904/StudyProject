/*
  1 获取用户收获地址
    1绑定点击事件
    2调用小程序内置API 获取用户收获地址

    2获取用户对小程序所授予的 获取地址的权限状态 scope
      1假设用户 点击获取收货地址的提示框 选择了确定
        scope 的值为true   authSetting  scope.address
      2假设用户从来没有调用过收货地址的API
        scope 的值为undefined 直接调用获取收获地址
      3假设用户 点击获取收货地址的提示框 选择了取消
        scope 的值为false
        引导用户自己打开授权设置页面（wx.openSetting）当用户重新给予获取地址权限的时候 
        获取收货地址
      4把获取到的收获地址存储到本地存储中
  2 页面加载完毕
    0 onLoad onShow 
    1获取本地存储中的地址数据
    2把这个数据设置给data中的一个变量

    以上，微信官方文档已更新，无需用户授权，scope.address默认都为true，
    无论用户选择确定还是取消，都为true

  3 onShow
    0回到商品详情页面 第一次添加商品的时候 手动添加checked，num属性
    1获取缓存中的购物车数组
    2把购物车数据填充到data中
  4 全选的实现 数据的展示
    1 onShow 获取缓存中的购物车数组
    2 根据购物车中的商品数据进行计算 所有商品都被选中 checked=true 全选被选中
  5 总价格和总数量
    1都需要商品被选中 才会机算
    2获取购物车数组
    3遍历
    4判断商品是否被选中
    5总价格 += 商品单价 * 商品数量
    6总数量 += 商品数量
    6把计算后的价格和数量 设置回data中
  6 商品的选中
    1绑定change事件
    2获取被修改的商品对象
    3把商品对象的选中状态取反
    4重新填充回data中和缓存中
    5重新计算全选 总价格 总数量
  7 全选和反选
    1全选的复选框绑定事件 change
    2获取data中的全选变量allChecked
    3直接取反allChecked=!allChecked
    4遍历购物车数组 让里面的商品选中状态跟随 allChecked 的改变而改变
    5把购物车数组和allChecked重新设置回data和缓存中
  8 商品数量的编辑
    1 "+" "-" 绑定同一个点击事件 区分的关键 自定义属性
      1 "+" "+1"
      2 "-" "-1"
    2 传递被点击的商品id goods_id
    3 获取data中的购物车数组 来获取需要被修改的商品对象
    4 当购物车商品数量=1，同时用户点击"-" 弹窗提示(showModal)是否要删除
      确定：删除
      取消：什么都不做
    4 直接修改商品对象的数量 num
    5 把购物车数组cart 重新设置回 缓存中 this.setcart
  9 点击结算
    1判断有没有收货地址信息
    2判断用户有没有选购商品
    3经过以上验证 跳转到支付页面

*/
import{ chooseAddress, getSetting, showModal,showToast } from "../../utils/asyncWx.js";
Page({
  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //1获取缓存中的收货地址信息，购物车数据
    const address=wx.getStorageSync("address");
    const cart=wx.getStorageSync("cart")||[];
    //1计算全选
    //every 数组方法 会遍历 会接收一个回调函数 如果每一个回调函数都返回true，则every方法的返回值为true
    //只要有一个回调函数返回了false，代码不继续执行，直接返回false
    //空数组调用every方法的返回值是true
    //优化：const allChecked=cart.length?cart.every(v=>v.checked):false;    //v使每一个循环项，当cart的长度不为零即有数据为true，否则直接返回false
    this.setData({address});
    this.setCart(cart);
  },
  
//     //1点击收货地址
//   // async handleChooseAddress(e){
//     async handleChooseAddress(e){
//       try {
//       //console.log("干一行 行一行 一行行 行行行");
//       //2获取收获地址
//       wx.chooseAddress({
//         success: (result)=>{
//           console.log(result);
//           console.log("选择张三的地址再点击确定之后即chooseAddress获取地址成功");
//         }
//       });
//   } catch (error) {
//   }
// },
  //1点击收货地址
  // async handleChooseAddress(e){
    handleChooseAddress(e){
    //console.log("干一行 行一行 一行行 行行行");
    //2获取收获地址
    wx.chooseAddress({
      success: (address)=>{
        console.log(address);
        //地址信息存入到缓存中
        address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
        wx.setStorageSync("address", address);
        console.log("选择张三的地址再点击确定之后即chooseAddress获取地址成功");
      }
    });
  },

    // //老师的优化代码
    // //1获取权限状态
    // const res1=await getSetting();
    // const scropAddress=res1.authSetting["scope.address"];
    // //2判断权限状态
    // if(scropAddress===false){
    //   //诱导用户打开授权页面
    //   await openSetting();
    // }
    //   //调用获取收货地址的API
    //   const res2=await chooseAddress();
    //   console.log(res2);
    // }


    // wx.getSetting({
    //   success: (result)=>{
    //     console.log(result);
    //     console.log("getSetting获取授权的状态");
    //   },
    // });


    // //授权设置页面，允许获取  通讯录  的信息
    // //设置界面只会出现小程序已经向用户请求过的权限
    // wx.openSetting({
    //   success: (result)=>{
    //     //调用 获取收货地址代码
    //     // wx.chooseAddress({
    //     //   success: (result)=>{
    //     //     console.log(result);
    //     //     console.log("openSetting");
    //     //   },
    //     //   fail: ()=>{},
    //     //   complete: ()=>{}
    //     // });
    //   },
    // });
  

    //商品的选中
    handleItemChange(e){
      //1获取被修改的商品id
      const goods_id=e.currentTarget.dataset.id;
      //2获取购物车数组
      let {cart}=this.data;
      //3找到被修改的商品对象
      let index=cart.findIndex(v=>v.data.message.goods_id===goods_id);
      //4选中状态取反
      cart[index].checked=!cart[index].checked;
      this.setCart(cart);
      
    },
    // 设置购物车状态同时 重新机算底部工具栏的数据 全选 总价格 数量
    setCart(cart){
      


      let allChecked=true;
      //1总价格和总数量
      let totalPrice=0;
      let totalNum=0;
      cart.forEach(v=>{
        if(v.checked){
          totalPrice+=v.num*v.data.message.goods_price;
          totalNum+=v.num;
        }
        else{
          allChecked=false;
        }
      })
      //判断数组是否为空
      allChecked=cart.length!=0?allChecked:false;
      //2给data赋值
      this.setData({
        cart,
        allChecked,
        totalPrice,
        totalNum
      }),
      //5 6 把购物车数据重新设置到data中和缓存中

      wx.setStorageSync("cart",cart);

    },

    //商品的全选功能
    handleItemAllCheck(){
      //1获取data中的数据
      let{cart,allChecked}=this.data;
      //2修改值
      allChecked=!allChecked;
      //3循环修改cart数组中的商品选中状态
      cart.forEach(v=>v.checked=allChecked);
      //4把修改后的值 填充回data中或者缓存中
      this.setCart(cart);
    },

    //商品数量的编辑功能
    async handleItemNumEdit(e){
      
      //1获取事件传递过来的参数
      const {operation,id}=e.currentTarget.dataset;
      //2获取购物车数组
      let {cart}=this.data;
      //3找到需要修改的商品索引
      const index=cart.findIndex(v=>v.data.message.goods_id===id);
      //4判断是否执行删除
      if(cart[index].num===1&&operation===-1){
        //4.1 弹窗提示：
        const res=await showModal({content:"您是否要删除？"});
        if(res.confirm){
          cart.splice(index,1);//把购物车数组中的第index项删除
          this.setCart(cart);  //注意this是哪里的。
        }
      }else{
      //4修改数量
      cart[index].num+=operation;
      //5设置回缓存和data中
      this.setCart(cart);
      } 
    },

    //点击结算
    async handlePay(){
      //1判断收货地址
      const {address,totalNum}=this.data;
      console.log(address,totalNum);
      if(!address.userName){
        await showToast({title:"您还没有选择收货地址"});
        return;
      }
      //2判断用户有没有选购商品
      if(totalNum===0){
        await showToast({title:"您还没有选购商品"});
        return;
      }
      //3跳转到支付页面
      wx.navigateTo({
        url: '/pages/pay/pay',
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
})