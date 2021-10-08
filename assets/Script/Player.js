// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        moveDuration:0,
    },

    goto (pos) {
        console.log('goto x:'+pos.x + 'y:'+pos.y);
        // var height = this.node.height;
        // pos.y = pos.y + height;
        cc.tween(this.node)
        .to(this.moveDuration,
             {position: pos},{easing:'sineOut'})
             .call(()=>{
                 this.game.createNewQuestionDlg();
             })
             .start()
        // var tween = cc.tween().sequence(move);
        // cc.tween(this.node).then(tween).start();
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
