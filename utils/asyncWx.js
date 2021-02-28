//promise形式的getSetting
export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            }
        });
    })
}

//promise形式的chooseAddress
export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            }
        });
    })
}

//promise形式的showModal

export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '提示',
            content: content,//提示内容后期可能会改变，因此设为变量
            success: (result) => {
            //   if(result.confirm){
            //     cart.splice(index,1);//把购物车数组中的第index项删除
            //     this.setCart(cart);  //注意this是哪里的。
            //   }
            resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
          });
    })
}


//promise形式的showToast

export const showToast=({title})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title: title,
            icon: 'none',
            success: (result) => {
            resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
          });
    })
}


//promise形式的login

export const login=()=>{
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout:10000,
            success: (result) => {
            resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
          });
    })
}




//promise形式的requestPayment
/*
* @param {object} pay 支付所必要的参数
*/

export const requestPayment=(pay)=>{
    return new Promise((resolve,reject)=>{
        wx.requestPayment({
            ...pay,
            success: (result)=>{
                resolve(result);
            },
            fail: (err)=>{
                reject(err);
            },
            complete: ()=>{}
        });
    })
}