/*

取得首頁 Banner 資料

* */

// 前端傳送
var send = {

};


// 後端回應
var response = {
    "error": "",            // 若有錯誤, 回應錯誤訊息, 沒的話為空值
    "data_list":            // 資料陣列, 最新資料排在最前面
        [
            {
                "image": "http://xxx.xx/photo/banner/001.jpg",          // pc 版圖片網址
                "image_m": "http://xxx.xx/photo/banner/001_m.jpg",      // mobile 版圖片網址
                "link": "http://example.com/",                // banner 連結網址
                "background": "#006699",
                "target": "_blank"
            }
            // ...以下多筆相同格式資料
        ]
};