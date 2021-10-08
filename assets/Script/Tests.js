var test = {
    questions: [
        // { type: 0, id: 1, text: 'How are you?' },
        // { type: 0, id: 2, text: 'How old are you?' },
        // { type: 0, id: 3, text: 'How old are you?' },
        // {
        //     type: 1, id: 4, text: '你吃饭了没?',
        //     selections: ['A:没吃', 'B:吃了', 'C:吃个屁', 'D:没有的吃']
        // }
    ],
    answers: [
        { id: 1, text: 'I am fine' },
        { id: 2, text: '18' },
        { id: 3, text: '做鬼' },
        { id: 4, text: '没吃' }
    ],
    curQuestion: null,
    index: 0,
    SELECT: "1",
    QA: 0,
    isInit: false,

    showLog(msg){
        console.log('Tests=>'+msg);
    },

    parseQuestionFromServer: function (data){
        for (var i = 0; i < data.length; i++){
            var question = data[i];
            var newQuestion = {};
            newQuestion.type = question.type;
            newQuestion.id = question.qNum;
            newQuestion.question = question.question;
            if (question.type === "1"){
                // newQuestion.selections = JSON.parse(question.selections);
                newQuestion.selections = question.selections.split("&,");
            }
            this.showLog("获取问题=>"+JSON.stringify(newQuestion));
            this.questions.push(newQuestion);
        }
    },

    init: function(callback){
        if (this.isInit) {
            this.showLog("已经初始化过了");
            callback(true);
            return;
        }
        let xhr = new XMLHttpRequest();
        var that = this;
        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)){
                var response = JSON.parse(xhr.responseText);
                console.log(xhr.responseText);
                if (response.ret == 1){
                    that.parseQuestionFromServer(response.datas.questions);
                }else{
                    that.showLog("ret error");
                }
                that.isInit = true;
                callback(true);
            }else{
                that.isInit = false;
                callback(false);
            }
        }
        var url = "https://www.52code.tech/questions/delete/0"
        xhr.open("GET", url, true);
        xhr.send();
    },

    isCorrect: function (qId, input, callback) {
        // 获取问题数组下标
        // for (var i = 0; i < this.answers.length; i++) {
        //     var answer = this.answers[i];
        //     if (answer.id === qId) {
        //         var correct = answer.text === input;
        //         console.log('correct?=>' + correct + ' right answer=>' + answer.text)
        //         return answer.text === input;
        //     }
        // }
        // return false;
        
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
                    var answers = response.datas.answers;
                    if (answers.length < 1){
                        that.showLog("找不到该问题答案");
                        callback(false);
                        return;
                    }

                    var correct = false;
                    for (var i = 0; i < answers.length; i++){
                        if (answers[i].answer == input){
                            correct = true;
                            break;
                        }
                        that.showLog("你的回答=>"+input + " 候选答案=>"+answers[i].answer);
                    }
                    callback(correct);
                }else{
                    that.showLog("ret error");
                    callback(false);
                }
            }else{
                that.showLog("获取数据失败");
            }
        }
        var url = "https://www.52code.tech/answers/"+qId;
        xhr.open("GET", url, true);
        xhr.send();
    },

    reset: function(){
        this.index = 0;
    },

    isEnd: function(){
        this.showLog("index->"+this.index+" length->"+this.questions.length)
        return this.index >= this.questions.length;
    },

    getNextQuestion: function () {
        this.curQuestion = this.questions[this.index % this.questions.length];
        this.index = this.index + 1;
        return this.curQuestion;
    }
}

module.exports = test;