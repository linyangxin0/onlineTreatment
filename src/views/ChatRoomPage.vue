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
        <div class="camera-right-top-top">
          <span class="camera-right-top-title">当前房间成员</span>
          <el-button type="danger" size="mini" icon="el-icon-back"
                     @click="exitRoomClick"
                     class="camera-right-top-top-btn">离开房间
          </el-button>
        </div>
        <div v-for="item in users" class="user-line">
          <span class="user-id">{{ item.userName }}</span>
          <div class="connect-btn">
            <el-button type="success" icon="el-icon-phone" size="mini"
                       @click="StartCall(item.socketId,true)"
                       v-if="item.socketId !== socketId">通话
            </el-button>
            <span v-if="item.socketId === socketId" class="connect-btn-text">当前账号</span>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="camera-right-bottom">
        <div class="chat-content">
          <div class="chat-content-message" v-for="item in chatMessage">
            <div class="chat-content-message-left">
              <div class="chat-content-message-left-top">
                <span class="chat-content-message-left-sender">{{ item.sender }}</span>
                <span class="chat-content-message-left-time">{{ item.time }}</span>
              </div>
              <div class="chat-content-message-left-bottom">
                <span class="chat-content-message-left-content"
                      :class="{myOwnMessage:item.sender===socketId}">{{ item.content }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="input-content">
          <el-input placeholder="请输入..." v-model="inputContent">
            <el-button type="info" slot="append" icon="el-icon-s-promotion" @click="sendMessage">发送</el-button>
          </el-input>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

import {dateFormat} from "@/utils/timeFormate";

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
      roomId: '',
      chatMessage: [],
      userName: ''
    }
  },
  created() {
    //检查登陆状态
    if (!localStorage.getItem('userName') || !localStorage.getItem('account')) {
      this.$router.replace('/404')
    }

    //监听刷新
    window.addEventListener('beforeunload', e => this.refresh(e))

    this.$socket.emit('init');
    this.socketId = this.$socket.id;
    this.roomId = this.$route.params.roomId;
    this.userName = localStorage.getItem('userName');

    this.$socket.emit('getRoomUsers', {
      roomId: this.roomId,
      userName: this.userName
    })
  },
  mounted() {
    this.InitCamera();
    this.pc.push(this.$socket.id);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', e => this.refresh(e))
  },
  sockets: {
    connect() {
      this.$socket.emit('init');
    },
    sendRoomInfo(data) {
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
    },
    getNewMessage(res) {
      this.chatMessage.push(res)
    },
    roomUnableEnter() {
      this.$message({
        message: '抱歉，房间不存在或不可进入！',
        type: 'warning'
      });
      this.$router.replace('/home')
    }
  },
  methods: {
    refresh() {
      this.$socket.emit('exitRoom', this.roomId)
    },
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
    },
    sendMessage() {
      if (this.inputContent.trim()) {
        let time = dateFormat('HH:MM', new Date());
        this.$socket.emit('sendMessage', {
          content: this.inputContent,
          roomId: this.roomId,
          time: time
        });
        this.inputContent = ''
      }
    },
    exitRoomClick() {
      this.$socket.emit('exitRoom', this.roomId)
      this.$router.replace('/home');
    }
  },
}
</script>

<style scoped>

::-webkit-scrollbar {
  width: 10px;
  height: 1px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #606266;
  background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%,
      transparent
  );
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #ededed;
  border-radius: 10px;
}

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
  overflow-y: hidden;
  overflow-x: hidden;
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
  overflow-y: scroll;

  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}

.camera-right-top-top {
  position: relative;
}

.camera-right-top-title {
  display: inline-block;
  font: 18px large;
  margin-bottom: 10px;
}

.camera-right-top-top-btn {
  position: absolute;
  right: 20px;
}


.user-line {
  display: flex;
  padding: 0 20px;

  height: 35px;
  border-bottom: 1px solid #DCDCDC;
}

.user-id {
  flex: 5;
  font: 16px Base;
  line-height: 35px;
}

.connect-btn {
  line-height: 35px;

  flex: 2;
}

.connect-btn-text {
  color: #606266;
  font: 16px Base;
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
  overflow-y: scroll;
}

.input-content {
  position: absolute;
  left: 5px;
  right: 5px;
  bottom: 5px;
}

.chat-content-message {
  position: relative;
}

.chat-content-message-left-top {
  margin-left: 10px;
}

.chat-content-message-left-sender {
  display: inline-block;
  font: 14px Base;
}

.chat-content-message-left-time {
  margin-left: 15px;
}

.chat-content-message-left-bottom {
  width: 400px;
}

.chat-content-message-left-content {
  display: inline-block;
  background-color: #EBEEF5;
  padding: 8px;
  margin: 5px 10px;
  border-radius: 10px;
}

.myOwnMessage {
  background-color: #67C23A;
  color: aliceblue;
}

.makeSmall {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 200px;
  z-index: 9;
}
</style>
