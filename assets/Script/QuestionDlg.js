// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var test = require("Tests");

cc.Class({
    extends: cc.Component,

    properties: {
        user: {
            default: null,
            type: cc.Sprite
        },

        user_name: {
            default: null,
            type: cc.Label
        },

        btn_answer: {
            default: null,
            type: cc.Button,
        },

        btn_giveup: {
            default: null,
            type: cc.Button
        },

        type: {
            default: null,
            type: cc.Label,
        },

        content: {
            default: null,
            type: cc.Label,
        },

        et_answer: {
            default: null,
            type: cc.EditBox
        },

        toggleContainer: {
            default: null,
            type: cc.ToggleContainer
        },

        toggles: {
            default: [],
            type: [cc.Toggle]
        },

        toggleTxts: {
            default: [],
            type: [cc.Label]
        }

    },

    onAnswerClick() {
        this.node.active = false;
        var input;
        if (this.question.type == test.SELECT){
            input = this.toggleAnswer;
        }else{
            input = this.et_answer.string;
        }

        // 异步校验
        var that = this;
        test.isCorrect(this.question.id, input, function callack(correct){
            if (correct){
                if (test.isEnd()){
                    that.game.gameSuccess();
                    test.reset();
                    return;
                }
                that.game.questionFinish();
            }else{
                that.game.gameOver();
                test.reset();
            }
        });

    },

    onGiveupClick() {
        this.node.active = false;
        this.game.gameOver();
        // this.game.gameSuccess();
        test.reset();
    },

    onEditChange(text, editbox, customEventData) {
        var editText = this.et_answer.string
        console.log(editText);
    },

    showLog(msg){
        console.log('QuestionDlg=>'+msg);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var that = this;
        test.init(function callback(success){
            if (success){
                that.question = test.getNextQuestion();
                that.showLog('获取数据成功');
                that.showLog('当前问题:'+JSON.stringify(that.question));
                that.showDlg();
            }else{
                that.showLog('获取数据失败');
            }
        });
        
        // this.et_answer.node.focus();
    },

    showDlg(){
        this.content.string = this.question.question;
        this.btn_answer.node.on('click', this.onAnswerClick, this);
        this.btn_giveup.node.on('click', this.onGiveupClick, this);

        // 显示类型
        if (this.question.type == test.SELECT) {
            this.showLog('选择题');
            this.type.string = "选择题";
            this.toggleContainer.node.active = true;
            this.toggleAnswer = this.question.selections[0];
            // 对单选节点监听
            for (var i = 0; i < 4; i++) {
                this.toggles[i].node.getComponentInChildren(cc.Label).string = this.question.selections[i];
                // this.toggles[i].name = this.question.selections[i];
                this.toggles[i].node.on('toggle', this.onToggleCheck, this);
            }
        } else {
            this.showLog('问答题');
            this.type.string = "问答题"
            this.et_answer.node.active = true;
            this.et_answer.node.on('text-changed', this.onEditChange, this);
        }
    },

    onToggleCheck(toggle) {
        this.toggleAnswer = toggle.node.getComponentInChildren(cc.Label).string
        this.showLog('onToggleCheck=>' + toggle)
    },

    start() {

    },

    // update (dt) {},
});
