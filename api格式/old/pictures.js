/*

 取得 個別相簿中 圖片 資料清單

 * */

// 前端傳送
var send = {
    album_id: "001"   // 相簿 id
};


// 後端回應
var response = {
    "error": "",            // 若有錯誤, 回應錯誤訊息, 沒的話為空值
    "data_list":            // 資料陣列, 最新資料排在最前面
        [
            {
                "img": "http://xxx.xx/photo/picture/001.jpg",     // 圖片原圖網址

                "thumb_desktop": "http://xxx.xx/xx.jpg",       // 桌機板縮圖 (220 x 163)
                "thumb_mobile": "http://xxx.xx/xx.m.jpg",      // 手機板縮圖 (483 x 356)

                "filename": "photo 001"         // 檔案名稱
            }
            // ...以下多筆相同格式資料
        ],
    "download_url": "http://xxx.xx/file/picute/001.zip" // 下載所有圖片的網址
};