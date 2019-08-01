// var say = require('./util');
import { say } from "./util"
require("./style/index.js");
// import Vue from 'vue'
import { getData } from "./api/hello"
import $ from "jquery";

$(".my-element").animate(/* ... */);

say();

let a = [12,34,56,67]
a.map(item => {
    console.log(item)
})

// var app = new Vue({
//     el: '#app',
//     data: {
//         message: 'Heloo Vue!'
//     }
// })
console.log(2222)
let params = {}
getData(params).then(res => {
    console.log(res)
})

let [b, c] = [1,2]
console.log("b:",b)
console.log("c:",c)

