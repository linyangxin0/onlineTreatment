<template>
  <div class="camera">
    <div class="camera-left">
      <video ref="localVideoElm"
             class="videoPlayer localVideoPlayer"
             :class="{makeSmall: playerChange }"
             autoplay
             @click="exchangeSize(playerChange)"
             poster="../assets/img/loading.gif"></video>
      <video ref="remoteVideoElm"
             class="videoPlayer remoteVideoPlayer"
             autoplay
             @click="exchangeSize(!playerChange)"
             :class="{makeSmall: !playerChange }"
             poster="../assets/img/loading.gif"></video>
    </div>
    <div class="camera-right">
      <div class="camera-right-top">
        <div>
          <span class="camera-right-top-title">当前房间成员</span>
        </div>
        <div v-for="item in users" class="user-line">
          <span class="user-id">{{ item }}</span>
          <div class="connect-btn">
            <el-button type="success" icon="el-icon-phone" size="mini" @click="StartCall(item,true)"
                       v-if="item !== socketId">通话
            </el-button>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="camera-right-bottom">
        <div class="chat-content">

        </div>
        <div class="input-content">
          <el-input placeholder="请输入..." v-model="inputContent">
            <el-button type="info" slot="append" icon="el-icon-s-promotion">发送</el-button>
          </el-input>
        </div>
      </div>
    </div>

  </div>
</template>

<script>


export default {
  name: "Camera",
  data() {
    return {
      socketId: '',
      localStream: null,
      pc: [],
      iceServer: {
        iceServers: [{
          urls: ["stun:ss-turn1.xirsys.com"]
        }, {
          username: "CEqIDkX5f51sbm7-pXxJVXePoMk_WB7w2J5eu0Bd00YpiONHlLHrwSb7hRMDDrqGAAAAAF_OT9V0dWR1d2Vi",
          credential: "446118be-38a4-11eb-9ece-0242ac140004",
          urls: ["turn:ss-turn1.xirsys.com:80?transport=udp",
            "turn:ss-turn1.xirsys.com:3478?transport=udp"
          ]
        }]
      },
      users: [],
      playerChange: true,
      inputContent: '',
      roomId: ''
    }
  },
  created() {
    this.$socket.emit('init');
    this.socketId = this.$socket.id
    this.roomId = this.$route.params.roomId
    this.$socket.emit('getRoomUsers', {
      roomId: this.roomId
    })
  },
  mounted() {
    this.InitCamera();
    this.pc.push(this.$socket.id);
  },
  sockets: {
    connect() {
      this.$socket.emit('init');
    },
    sendRoomInfo(data){
      console.log(data.peoples)
      this.users = data.peoples;
    },
    //监听发送的sdp事件
    sdp(data) {
      //如果时offer类型的sdp
      if (data.description.type === 'offer') {
        //那么被呼叫者需要开启RTC的一套流程，同时不需要createOffer，所以第二个参数为false
        this.StartCall(data.sender, false);
        //把发送者(offer)的描述，存储在接收者的remoteDesc中。
        let desc = new RTCSessionDescription(data.description);
        //按1-13流程走的
        this.pc[data.sender].setRemoteDescription(desc).then(() => {

          this.pc[data.sender].createAnswer().then((answer) => {
            return this.pc[data.sender].setLocalDescription(answer);
          }).then(() => {
            this.$socket.emit('sdp', {
              type: 'video-answer',
              description: this.pc[data.sender].localDescription,
              to: data.sender,
              sender: this.$socket.id
            });
          }).catch(); //catch error function empty
        })
      } else if (data.description.type === 'answer') {
        //如果使应答类消息（那么接收到这个事件的是呼叫者）
        let desc = new RTCSessionDescription(data.description);
        this.pc[data.sender].setRemoteDescription(desc);
      }
    },
    //如果是ice candidates的协商信息
    iceCandidates(data) {
      //{ candidate: candidate, to: partnerName, sender: socketID }
      //如果ice candidate非空（当candidate为空时，那么本次协商流程到此结束了）
      if (data.candidate) {
        let candidate = new RTCIceCandidate(data.candidate);
        //讲对方发来的协商信息保存
        this.pc[data.sender].addIceCandidate(candidate).catch(); //catch err function empty
      }
    }
  },
  methods: {
    //初始化摄像头
    InitCamera() {
      if (this.canGetUserMediaUse()) {
        this.getUserMedia({
          video: true,
          audio: false
        }, (stream) => {
          this.localStream = stream;
          this.$refs.localVideoElm.srcObject = stream;
        }, (err) => {
          console.log('访问用户媒体失败: ', err.name, err.message);
        });
      } else {
        alert('您的浏览器不兼容');
      }
    },
    canGetUserMediaUse() {
      return !!(navigator.mediaDevices.getUserMedia || navigator.webkitGetUserMedia || navigator
          .mozGetUserMedia || navigator.msGetUserMedia);
    },
    getUserMedia(constrains, success, error) {
      if (navigator.mediaDevices.getUserMedia) {
        //最新标准API
        this.promise = navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
      } else if (navigator.webkitGetUserMedia) {
        //webkit内核浏览器
        this.promise = navigator.webkitGetUserMedia(constrains).then(success).catch(error);
      } else if (navigator.mozGetUserMedia) {
        //Firefox浏览器
        this.promise = navagator.mozGetUserMedia(constrains).then(success).catch(error);
      } else if (navigator.getUserMedia) {
        //旧版API
        this.promise = navigator.getUserMedia(constrains).then(success).catch(error);
      }
    },
    StartCall(parterName, createOffer) {
      this.pc[parterName] = new RTCPeerConnection(this.iceServer);
      //如果已经有本地流，那么直接获取Tracks并调用addTrack添加到RTC对象中。
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          this.pc[parterName].addTrack(track, this.localStream); //should trigger negotiationneeded event
        });
      } else {
        //否则需要重新启动摄像头并获取
        if (this.canGetUserMediaUse()) {
          this.getUserMedia({
            video: true,
            audio: false
          }, function (stream) {
            this.localStream = stream;
            this.$refs.localVideoElm.srcObject = stream;
            // $(localVideoElm).width(800);
          }, function (error) {
            console.log("访问用户媒体设备失败：", error.name, error.message);
          })
        } else {
          alert('您的浏览器不兼容');
        }
      }
      //如果是呼叫方,那么需要createOffer请求
      if (createOffer) {
        //每当WebRTC基础结构需要你重新启动会话协商过程时，都会调用此函数。它的工作是创建和发送一个请求，给被叫方，要求它与我们联系。
        this.pc[parterName].onnegotiationneeded = () => {
          //https://developer.mozilla.org/zh-CN/docs/Web/API/RTCPeerConnection/createOffer
          this.pc[parterName].createOffer().then((offer) => {
            return this.pc[parterName].setLocalDescription(offer);
          }).then(() => {
            //把发起者的描述信息通过Signal Server发送到接收者
            this.$socket.emit('sdp', {
              type: 'video-offer',
              description: this.pc[parterName].localDescription,
              to: parterName,
              sender: this.$socket.id
            });
          })
        };
      }
      //当需要你通过信令服务器将一个ICE候选发送给另一个对等端时，本地ICE层将会调用你的 icecandidate 事件处理程序。有关更多信息，请参阅Sending ICE candidates 以查看此示例的代码。
      this.pc[parterName].onicecandidate = ({candidate}) => {
        this.$socket.emit('iceCandidates', {
          candidate: candidate,
          to: parterName,
          sender: this.$socket.id
        });
      };
      //当向连接中添加磁道时，track 事件的此处理程序由本地WebRTC层调用。例如，可以将传入媒体连接到元素以显示它。详见 Receiving new streams 。
      this.pc[parterName].ontrack = (ev) => {
        let str = ev.streams[0];
        // if (document.getElementById(`${parterName}-video`)) {
        //   document.getElementById(`${parterName}-video`).srcObject = str;
        // } else {
        // let newVideo = document.createElement('video');
        // newVideo.id = `${parterName}-video`;
        // newVideo.autoplay = true;
        // newVideo.controls = true;
        // //newVideo.className = 'remote-video';
        // newVideo.srcObject = str;
        //
        // document.getElementById('videos').appendChild(newVideo);

        // this.localStream = stream;
        this.$refs.remoteVideoElm.srcObject = str;
        // }
      }
    },
    exchangeSize(data) {
      if (data) {
        this.playerChange = !this.playerChange;
      }
    }
  },
}
</script>

<style scoped>
.videoPlayer {
  width: 100%;
}

.camera {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  margin: 10px;
}

.camera-left {
  flex: 2;
  margin-right: 20px;

  position: relative;
}

.camera-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 98vh;
}

.camera-right-top {
  flex: 1;

  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}

.camera-right-top-title {
  display: inline-block;
  font: 18px large;
  margin-bottom: 10px;
}

.user-line {
  display: flex;

  height: 35px;
  border-bottom: 1px solid #DCDCDC;
}

.user-id {
  flex: 5;
  font: 14px Base;
  line-height: 35px;
}

.connect-btn {
  flex: 2;
}

.camera-right-bottom {
  flex: 4;

  padding: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  position: relative;
}

.chat-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  border: 1px solid #DCDCDC;
  border-radius: 5px;
  margin: 5px;
}

.input-content {
  position: absolute;
  left: 5px;
  right: 5px;
  bottom: 5px;
}

.makeSmall {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 200px;
  z-index: 9;
}
</style>
