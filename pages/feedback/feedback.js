
Page({
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品、商家投诉",
        isActive:false
      }
    ],
  },
  handleTabsItemChange(e){
    //1获取被点击的标题索引
    const {index}=e.detail;
    let {tabs}=this.data;
    tabs.forEach((v,i) =>i===index?v.isActive=true:v.isActive=false );
    //3赋值到data中
    this.setData({
      tabs
    })

  },
  
})