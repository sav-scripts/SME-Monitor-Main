/*

 取得 News Release 資料清單 (不包含內文)

 * */

// 前端傳送
var send = {

};


// 後端回應
var response = {
    "error": "",            // 若有錯誤, 回應錯誤訊息, 沒的話為空值
    "data_list":     // 資料陣列, 最新資料排在最前面
        [
            {
                "id": "001", // 唯一 id
                "link": "http://xxx.xxx/", // 外聯網址, 有提供的話會將使用者導向該連結, 沒的話則在本站顯示後端 html 編輯器產生的內文
                "content_url_desktop": "http://xxx.xx/news_release/001/content?type=desktop",   // 詳細內文 html 網址 - 桌機
                "content_url_mobile": "http://xxx.xx/news_release/001/content?type=mobile",   // 詳細內文 html 網址 - 行動裝置
                "date": "2017-09-13",                     // 日期
                "title": "balabalalala",                  // 主標
                "sub_title": "lababababa",                // 次標
                "thumb_desktop": "http://xxx.xx/xx.jpg",  // 桌機板縮圖 (270 x 200)
                "thumb_mobile": "http://xxx.xx/xx.m.jpg"  // 手機板縮圖 (448 x 331)
            }
            // ...以下多筆相同格式資料
        ]
};