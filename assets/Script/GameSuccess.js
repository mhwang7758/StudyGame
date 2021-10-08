// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        restart : {
            default: null,
            type: cc.Button
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.restart.node.on('click', this.onRestart, this);
        cc.tween(this.node)
        .to(1, {position: cc.v2(0, -120)},{easing:'cubicOut'})
        .to(1, {scale:1.5, position: cc.v2(-100, 120)}, {easing: 'cubicOut'})
        .to(1, {scale:1, position: cc.v2(0, 0)}, {easing: 'cubicOut'})     
        .call(()=>{})
        .start()
    },

    onRestart(){
        console.log('GameSuccess onRestart');
        this.game.clearQuestionNodes();
        this.game.onStartGame();
        this.node.destroy();
    },

    start () {

    },

    // update (dt) {},
});
