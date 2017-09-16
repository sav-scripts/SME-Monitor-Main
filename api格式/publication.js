/*

 取得 Publications 資料清單

 * */

// 前端傳送
var send = {

    "search_type": "All",     // 搜尋類別, 三種分類, [Monitor, Collections, Journals]
                              // 若指定為 All 的話, 則不篩選類別
    "page_index": 0,
    "page_size": 10 // 搜尋的結果如果有多筆的話, 依據 page_size 分頁, 然後傳回 page_index 指定的的分頁的內容
};


// 後端回應
var response = {
    "error": "",     // 若有錯誤, 回應錯誤訊息, 沒的話為空值
    "data_list":     // 資料陣列, 最新資料排在最前面
        [
            {
                "id": "001",                            // 唯一 id, 之後批次下載時提交給後端用
                "type": "Monitor",
                "date": "2017",                         // 日期
                "title": "balabalalala",                // 主標
                "description": "balabalalala",          // 描述

                "thumb_desktop": "http://xxx.xx/xx.jpg",        // 桌機板縮圖, 標準 (270 x 200)
                "thumb_small_desktop": "http://xxx.xx/xx.jpg",  // 桌機板縮圖, 小 (110 x 81)
                "thumb_mobile": "http://xxx.xx/xx.m.jpg",       // 手機板縮圖 (448 x 332)

                "file_size": "1.2mb",                   // 檔案大小
                "file_url": "http://xxx.xx/file/publication/001.pdf",     // 檔案網址
                "target": "_blank"
            }
            // ...以下多筆相同格式資料
        ],

    "num_pages": 12, // 搜尋結果的頁數
    "page_index": 0, // 所回應的資料的分頁索引
    "page_size": 10, // request 的 page_size, 原樣傳回
    "search_type:": "All" // request 的 search_type, 原樣傳回
};