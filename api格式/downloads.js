/*

 取得 Download 資料清單

 * */

// 前端傳送
var send = {

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
                "date": "2017-09-13",                   // 日期
                "title": "balabalalala",                // 主標
                "file_size": "1.2mb",                   // 檔案大小
                "file_url": "http://xxx.xx/file/download/001.pdf"     // 檔案網址
            }
            // ...以下多筆相同格式資料
        ],

    "num_pages": 12, // 搜尋結果的頁數
    "page_index": 0, // 所回應的資料的分頁索引
    "page_size": 10 // request 的 page_size, 原樣傳回
};

