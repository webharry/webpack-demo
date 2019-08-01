import _axios from "axios";
const HOST = require("../../webpack/config/common").getHost()


const axios = _axios.create({
    baseURL: HOST,
    timeout:5000
})

const myAjax = function(url, methods, data, options){
    return new Promise(function(resolve, reject){
        axios({
            methods:methods,
            data: data,
            url:url
        }).then(res => {
            if(res.status == 200) {
                resolve(res)
            }
        }).catch(err => {
            console.log(err)
            reject(err)
        })
    })
}

export default myAjax;