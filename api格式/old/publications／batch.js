/*

 取得 Publications 單元 批次下載 連結

 * */

// 前端傳送
var send = {
    file_list:  // 使用者選取所要下載的檔案 id 清單 (由 download.api 取得)
        [
            "001",
            "002",
            "005",
            "006"
        ]

};


// 後端回應
var response = {
    "error": "",     // 若有錯誤, 回應錯誤訊息, 沒的話為空值
    "download_url": "http://xxx.xxx/xxx.zip" // 下載網址
};