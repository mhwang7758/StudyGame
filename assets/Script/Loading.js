// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        container:{
            default: null,
            type: cc.Node
        },
        loadingNode:{
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    show(){
        this.node.active = true;
        // var action = cc.moveTo(2, 100, 100);
        // this.container.runAction(action)

        // cc.tween(this.loadingNode)
        // .by(3, {rotation:90})
        // .repeatForever()
        // .start()
    },

    hide(){
        this.node.active = false;
        this.node.destroy();
    },

    update (dt) {
        this.loadingNode.angle = (this.loadingNode.angle + 1) % 360
    },
});
