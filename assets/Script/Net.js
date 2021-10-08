var net = {
    showLog(msg){
        console.log('net=>'+msg);
    },

    loginFromServer: function (sencryptedData, siv, scode, callback) {
        let xhr = new XMLHttpRequest();
        var that = this;
        xhr.onreadystatechange = function(){
            that.showLog("xhr 状态=>"+xhr.readyState+" status=>"+xhr.status);
            if (xhr.readyState == 0 && xhr.status == 1){
                return;
            }
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)){
                var response = JSON.parse(xhr.responseText);
                that.showLog(xhr.responseText);
                if (response.ret == 1){
                    
                }else{
                    that.showLog("ret error");
                    callback(null);
                }
            }else{
                that.showLog("获取数据失败");
            }
        }
        var url = "https://www.52code.tech/users/oauth";
        xhr.open("POST", url, true);
        var data = {encryptedData:sencryptedData, iv:siv, code:scode}
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
        // xhr.setRequestHeader('Content-Type','application/json')
        // xhr.send(JSON.stringify(data));
        xhr.send(data);
    },
}

module.exports = net;