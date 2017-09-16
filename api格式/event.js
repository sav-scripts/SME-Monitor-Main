/*

 取得 Events 資料清單

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
                "thumb_desktop": "http://xxx.xx/xx.jpg",  // 桌機板縮圖 (270 x 200)
                "thumb_mobile": "http://xxx.xx/xx.m.jpg",  // 手機板縮圖 (448 x 332)
                "date": "2017-09-13",               // 日期
                "title": "balabalalala",            // 主標
                "sub_title": "lababababa",          // 次標
                "link": "http://some.event.site/",
                "target": "_blank"
            }
            // ...以下多筆相同格式資料
        ]
};