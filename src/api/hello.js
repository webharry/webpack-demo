import myAjax from "./index";

export const getInfo = () => myAjax("https://www.easy-mock.com/mock/5a504c662435163d11866df4/getdetail","get")

export const getData = (params) => myAjax("/api/getInfo","GET",params)