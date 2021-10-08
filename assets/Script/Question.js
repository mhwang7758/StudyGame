// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        radius: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.setSiblingIndex(5);
    },

    finish(){
        var self = this;
        cc.resources.load("question_finish", cc.SpriteFrame, function (err, spriteFrame){
            self.node.getComponent("cc.Sprite").spriteFrame = spriteFrame;
            self.game.gotoNextQuestion();
        });
    },

    clear(){
        console.log('question clear')
        this.node.destroy();
    }
    // update (dt) {},
});
