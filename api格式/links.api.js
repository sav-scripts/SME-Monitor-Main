/*

 取得 Links 資料清單

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
                "thumb": "http://xxx.xx/xx.jpg",        // 縮圖 (200 x 56)

                "title": "balabalalala",            // 主標

                "link": "http://maybe.utube/"   // 外連網址
            }
            // ...以下多筆相同格式資料
        ]
};