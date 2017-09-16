/*

 取得 Initiatives 資料清單 (不包含內文)


 * */

// 前端傳送
var send = {

};


// 後端回應
var response = {
    "error": "",     // 若有錯誤, 回應錯誤訊息, 沒的話為空值
    "data_list":     // 資料陣列, 最新資料排在最前面
        [
            {
                "id": 1, // 唯一 id
                "link": "http://xxx.xxx/", // 外聯網址, 有提供的話會將使用者導向該連結, 沒的話則在本站顯示後端 html 編輯器產生的內文
                "content_url_desktop": "news.001.htmlhttp://xxx.xx/initiative/001/content?type=desktop",   // 詳細內文 html 網址 - 桌機
                "content_url_mobile": "http://xxx.xx/initiative/001/content?type=mobile",   // 詳細內文 html 網址 - 行動裝置
                "title": "2012",                 // 主標/年份
                "target": "_blank"
            }
            // ...以下多筆相同格式資料
        ]
};