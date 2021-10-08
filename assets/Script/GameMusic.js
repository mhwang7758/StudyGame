// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        audioSource: {
            default: null,
            type: cc.AudioSource
        },

        gameAudio: null,
        forbidden: false,
        currentAudio: null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.on('click', this.musicControl, this);
    },

    initSource(callback){
        var that = this;
        var url = 'https://www.52code.tech/images/SongGuess/audio/game_audio.mp3';
        cc.assetManager.loadRemote(url,
        { audioLoadMode: cc.AudioClip.LoadMode.DOM_AUDIO }, function(err, audio){
            if (err){
                console.log('预加载音频出错'+error)
            }else{
                console.log('预加载音频完成')
                that.gameAudio = audio; 
            }
            callback(err==null)
         });
    },

    start() {

    },

    musicControl() {
        if (this.gameAudio == null){
            console.log('GameMusic=>'+背景音乐未加载完成)
            return;
        }
        if (this.forbidden) {
            this.forbidden = false;
            var self = this;
            cc.resources.load("music_on", cc.SpriteFrame, function (err, spriteFrame) {
                self.node.getComponent("cc.Sprite").spriteFrame = spriteFrame;
            });
            // this.audioSource.play();  本地音效替换为网络音效
            this.currentAudio = cc.audioEngine.play(this.gameAudio, true, 1);
        } else {
            var self = this;
            cc.resources.load("music_off", cc.SpriteFrame, function (err, spriteFrame) {
                self.node.getComponent("cc.Sprite").spriteFrame = spriteFrame;
            });
            this.forbidden = true;
            // this.audioSource.stop();
            cc.audioEngine.stop(this.currentAudio);
        }
    },

    play() {
        if (this.forbidden || this.gameAudio == null) return;

        // this.audioSource.play(); 替换为网络音乐
        this.currentAudio = cc.audioEngine.play(this.gameAudio, true, 1);
    },

    pause() {
        if (this.forbidden) return;
        // this.audioSource.pause();
        cc.audioEngine.pause(this.currentAudio);
    },

    stop() {
        if (this.forbidden) return;
        // this.audioSource.stop();
        cc.audioEngine.stop(this.currentAudio);
    }

    // update (dt) {},
});
