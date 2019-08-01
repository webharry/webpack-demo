import myAjax from "./index";

export const getData = (params) => myAjax("/api/getInfo","GET",params)