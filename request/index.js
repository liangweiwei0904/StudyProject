//同时发送异步代码的次数
let ajaxTimes=0;
export const request=(params)=>{
    //判断url中是否带有  /my/  如果有 请求的是私有路径 带上header token
    let header={...params.header};//先拿旧的合并，既能带上权限验证的token，也能接收新的请求信息
    if(params.url.includes("/my/")){
        //拼接 header 带上token
        header["Authorization"]=wx.getStorageSync("token");
    }
    ajaxTimes++;
    //显示加载中效果
    wx.showLoading({
        title: '加载中',
        mask: true
    });
    const baseURL="https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise ((resolve,reject)=>{
        wx.request({
            ...params,
            header:header,
            url:baseURL+params.url,
            success:(result)=>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            },
            complete:()=>{
                ajaxTimes--;
                if(ajaxTimes===0){
                    //关闭正在等待的图标
                wx.hideLoading();
                } 
            }
        });
    })
}