// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        resplay : {
            default: null,
            type: cc.Button
        },
        mRestartCallback: null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.resplay.node.on('click', this.onRestart, this);

        cc.tween(this.node)
        .to(1, {position: cc.v2(0, -120)},{easing:'cubicOut'})
        .to(1, {scale:1.5, position: cc.v2(-100, 120)}, {easing: 'cubicOut'})
        .to(1, {scale:1, position: cc.v2(0, 0)}, {easing: 'cubicOut'})     
        .call(()=>{})
        .start()
    },

    show(restartCallback){
        this.resplay.node.on(cc.Node.EventType.TOUCH_START, this.onRestart, this);
        this.mRestartCallback = restartCallback;
    },

    destroyNode(){
        this.mRestartCallback = null;
        this.node.destroy();
    },

    onRestart(){

        this.game.clearQuestionNodes();
        this.game.onStartGame();
        this.node.destroy();
    }

    // start () {

    // },

    // update (dt) {},
});
