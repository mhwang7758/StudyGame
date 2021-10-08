// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var net = require("Net");
const X_ADD_FACTOR = 50;
const Y_ADD_FACTOR = 50;
const X_ADD = 180;
const Y_ADD = 150;
const RIGHT = 0;
const LEFT = 1;
const BOTTOM = -250;
var curQuX = 0;
var curQuY = BOTTOM;
var direct = RIGHT;  // 0代表正向走，1代表反向走
var changeDirect = false;

var curQuestion;

var mBorderWidth;
var mBorderHeight;

var mBgrGameMusic;


cc.Class({
    extends: cc.Component,

    properties: {
        questionPre: {
            default: null,
            type: cc.Prefab
        },

        questionPres: {
            default:[],
            type: [cc.Prefab]
        },

        questionDlgPre: {
            default: null,
            type: cc.Prefab
        },

        player: {
            default: null,
            type: cc.Node
        },

        btn_start: {
            default: null,
            type: cc.Button
        },

        scoreDisplay: {
            default: null,
            type: cc.Label
        },

        gameOverDlgPre: {
            default: null,
            type: cc.Prefab
        },

        gameSuccessDlgPre:{
            default: null,
            type: cc.Prefab
        },

        bgrMusic: {
            default: null,
            type: cc.Node
        },

        loading:{
            default: null,
            type: cc.Node
        }


    },

    // LIFE-CYCLE CALLBACKS:

    showLog(msg){
        console.log('Game=>'+msg);
    },

/**
   * 根据用户code获取用户信息
   */
 getUserInfoByCode: function(info, iv, code) {
    if (code == null) {
      this.showLog('getUserInfoByCode=>', "code is null")
      return;
    }
    console.log("info=>", info)
    console.log("iv=>", iv)
    console.log("code=>", code)
    net.loginFromServer(info, iv, code, null);
  },

  wxLogin() {
    //微信登陆
    const wx = window['wx'];//避开ts语法检测
    const info = wx.getSystemInfoSync();//立即获取系统信息
    const w = info.screenWidth;//屏幕宽
    const h = info.screenHeight;//屏幕高
    //获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限。
    var that = this;
    wx.getSetting(
        {
            success(res) {
                console.log(res.authSetting);
                if (res.authSetting["scope.userInfo"]) {
                    console.log("用户已授权");
                    wx.getUserInfo({
                        success(res) {
                            //登陆操作
                            userInfo = res.userInfo;
                            // 获取code
                        }
                    });
                } else {
                    console.log("用户未授权");
                    //创建全屏透明登陆按钮
                    let button = wx.createUserInfoButton({
                        type: 'getUserInfo',
                        text: '',
                        style: {
                            left: 0,
                            top: 0,
                            width: w,
                            height: h,
                            backgroundColor: '#00000000',//最后两位为透明度
                            color: '#ffffff',
                            fontSize: 20,
                            textAlign: "center",
                            lineHeight: h,
                        }
                    });

                    button.onTap((authRes) => {
                        if (authRes.userInfo) {
                            console.log("用户授权:", authRes);
                            // 获取code
                            wx.login({
                              complete: (res) => {
                                console.log("登陆:", res);
                                  that.getUserInfoByCode(authRes.encryptedData, authRes.iv,res.code);
                              },
                            })
                            button.destroy();
                        } else {
                            console.log("用户拒绝授权:");
                        }
                    });
                }

            }

        }
    );
},

    wxAuth(){
        let exportJson = {};
        let sysInfo = window.wx.getSystemInfoSync();
        //获取微信界面大小
        let width = sysInfo.screenWidth;
        let height = sysInfo.screenHeight;
        var that = this;
        window.wx.login({
            success: (res) => {
                if (res.code) {
                    console.log("res.code:", res);
                    exportJson.code = res.code;//向服务端传递code用于获取微信小游戏的用户唯一标识
                    window.wx.getSetting({
                        success (res) {
                            console.log(res.authSetting);
                            if (res.authSetting["scope.userInfo"]) {
                                console.log("用户已授权");
                                window.wx.getUserInfo({
                                    success(res){
                                        console.log(res);
                                        exportJson.userInfo = res.userInfo;
                                        //此时可进行登录操作
                                    }
                                });
                            }else {
                                console.log("用户未授权");
                                let button = window.wx.createUserInfoButton({
                                    type: 'text',
                                    text: '',
                                    style: {
                                        left: 0,
                                        top: 0,
                                        width: width,
                                        height: height,
                                        backgroundColor: '#00000000',//最后两位为透明度
                                        color: '#ffffff',
                                        fontSize: 20,
                                        textAlign: "center",
                                        lineHeight: height,
                                    }
                                });
                                button.onTap((res) => {
                                    if (res.userInfo) {
                                        console.log("用户授权:", res);
                                        exportJson.userInfo = res.userInfo;
                                        //此时可进行登录操作
                                        that.getUserInfoByCode(res.encryptedData, res.iv, exportJson.code)
                                        button.destroy();
                                    }else {
                                        console.log("用户拒绝授权:", res);
                                    }
                                });
                            }
                        }
                    })
                }else{
                    console.log('登录失败！' + res.errMsg)
                }
            },

        });
    },

    onLoad () {
        this.btn_start.node.on('click', this.onStartGame, this);
        var that = this;

        // this.wxAuth();
        this.wxLogin();

        this.loading.getComponent("Loading").show();

        // 音乐开关
        this.bgrMusic.on(cc.Node.EventType.TOUCH_START, function (event){
            that.showLog('music button touch')
            that.onBgrMusic();
        });

        // 初始化背景音乐
        mBgrGameMusic = this.bgrMusic.getComponent("GameMusic");
        mBgrGameMusic.initSource(function(isSuccess){
            if (isSuccess){
                that.loading.getComponent("Loading").hide();
            }
        })

        mBorderWidth = cc.view.getVisibleSize().width / 2;
        mBorderHeight = cc.view.getVisibleSize().height / 2;
        this.showLog('screen border width=>'+mBorderWidth);
        this.showLog('screen border height=>'+mBorderHeight);
        this.score = 0;

        // 在player上保存game的引用
        this.player.getComponent("Player").game = this;
        // this.gameOverDlgPre.getComponent("GameOver").game = this;
    },

    clearQuestionNodes(){
        for (var i = 0; i < this.questionPres.length; i++){
            this.questionPres[i].getComponent('Question').clear();
            this.questionPres.splice(i,1);  // 从下标i开始删除1个
            i--;
        }

        this.player.setPosition(cc.v2(-17, -177));

        curQuX = 0;
        curQuY = BOTTOM;
        direct = RIGHT;
    },

    onStartGame (){
        this.btn_start.node.active = false
        this.score = 0;
        this.updateScore(this.score)
        var pos = this.createNewQuestion();
        // this.bgrMusic.getComponent("GameMusic").play();
        mBgrGameMusic.play();

        this.player.getComponent("Player").goto(pos);

    },

    // 返回创建的问题位置坐标
    createNewQuestion (){
        console.log('createNewQuestion')
        curQuestion = cc.instantiate(this.questionPre);
        this.node.addChild(curQuestion);
        // curQuestion.zIndex = 99;
        var questionPos = this.getNewQuestionPos();

        // 如果到顶点，则游戏通关
        if (questionPos == null){
            this.gameSuccess();
            return null;
        }

        curQuestion.setPosition(questionPos);
        // 在问题脚本上保存game的引用
        curQuestion.getComponent('Question').game = this;

        // 将问题引用加进列表
        this.questionPres.push(curQuestion);

        return questionPos;
    },

    createNewQuestionDlg (){
        this.showLog('createNewQuestionDlg')
        var newDlg = cc.instantiate(this.questionDlgPre);
        this.node.addChild(newDlg);

        newDlg.setPosition(cc.v2(0, -120));
        // 在问题脚本上保存game的引用
        newDlg.getComponent('QuestionDlg').game = this;
        return newDlg;
    },

    gameOver (){
        var newDlg = cc.instantiate(this.gameOverDlgPre);
        this.node.addChild(newDlg);
        newDlg.setPosition(cc.v2(0, 0));
        // 改为外部回调
        newDlg.getComponent('GameOver').game = this;
        
        // console.log('gameOver size '+newDlg.getChildByName("restart").width);
        // this.bgrMusic.getComponent("GameMusic").stop();
        mBgrGameMusic.stop();
    },

    gameSuccess (){
        var newDlg = cc.instantiate(this.gameSuccessDlgPre);
        this.node.addChild(newDlg);
        newDlg.setPosition(cc.v2(0, 0));
        newDlg.getComponent('GameSuccess').game = this;
        // this.bgrMusic.getComponent("GameMusic").stop();
        mBgrGameMusic.stop();
    },

    onBgrMusic (){
        // this.bgrMusic.getComponent("GameMusic").musicControl();
        mBgrGameMusic.musicControl();
    },

    getNewQuestionPos (){
        // 随机的位置
        // var randX = Math.random() * this.node.width;
        // var randY = Math.random() * this.node.height;

        // var randMinus = Math.random();
        // if (randMinus < 0.5){
        //     randX = 0 - randX;
        // }
        // this.nextQX = randX;
        // this.nextQY = randY;
        // console.log("new question x=>"+this.nextQX);

        // return cc.v2(randX, randY);

        var x = this.getNextX();
        var y = this.getNextY();
        if (y >= mBorderHeight){
            return null;
        }

        return cc.v2(x, y);
    },

    getOffsetX () {
        var random = Math.random();
        var offset = X_ADD_FACTOR * Math.random();
        return random > 0.5 ? offset : -offset;
    },

    getOffsetY () {
        var random = Math.random();
        var offset = Y_ADD_FACTOR * Math.random();
        return random > 0.5 ? offset : -offset;
    },

    getNextX () {
        var addX = X_ADD + this.getOffsetX();

        if (direct == RIGHT){
            // 判断方向，如果当前位置+偏移量超出边界，则当前位置不变，转移方向
            if (curQuX + addX > mBorderWidth){
                this.showLog("下次偏移量大于边界，则不作改变，边界值"+mBorderWidth);
                changeDirect = true;
                direct = LEFT;
            }else {
                curQuX = curQuX + addX;
                // 边界判断
                if (curQuX > mBorderWidth){
                    curQuX = mBorderWidth;
                }
            }
        }else {
            if (curQuX - addX < -mBorderWidth){
                changeDirect = true;
                direct = RIGHT;
            }else {
                curQuX = curQuX - addX;
                // 边界判断
                if (curQuX < -mBorderWidth){
                    curQuX = -mBorderWidth;
                }
            }
        }

        this.showLog("x=>"+curQuX);
        return curQuX;

    },

    getNextY () {
        if (changeDirect){
            curQuY = curQuY + Y_ADD;
            changeDirect = false;
        }else {
            curQuY = curQuY + this.getOffsetY();

            if (curQuY < BOTTOM) curQuY = BOTTOM; 
        }

        this.showLog("y=>"+curQuY);

        return curQuY;

    },

    updateScore(score) {
        this.scoreDisplay.string = "得分:"+score;
    },

    gotoNextQuestion() {
        // var x = this.questionPre.x;     // 貌似没有用
        // var y = this.questionPre.y;
        // var questionPos = cc.v2(x, y);
        var nextNodePos = this.createNewQuestion();
        if (nextNodePos == null) return;
        this.player.getComponent("Player").goto(nextNodePos);
    },

    questionFinish () {
        this.showLog('questionFinish')
        curQuestion.getComponent('Question').finish();
        this.score += 10;
        this.updateScore(this.score);
    },

    start () {
        // var x, y = this.questionPre.getPosition();
        // this.createNextNode();
        // this.player.getComponent("Player").goto(pos);
    },

    // update (dt) {},
});
