<template>
  <div class="home">
    <div class="home-left">
      <div class="home-left-top">
        <div><span class="home-left-top-title">个人信息：</span></div>
        <div><span class="home-left-top-info">用户名：{{ userName }}</span></div>
        <div><span class="home-left-top-info">账 户：{{ account }}</span></div>
        <div class="home-left-top-logout-btn">
          <el-button size="small" @click="changePassword" type="info">修改密码</el-button>
          <el-button size="small" @click="logout" type="danger">退出登录</el-button>
        </div>
      </div>

      <div class="home-left-bottom">
        <div class="home-left-bottom-top">
          <span>当前在线人数：</span>
        </div>
        <div class="home-left-bottom-center">
          <span>
            {{ onlineNum }}
          </span>
        </div>
        <div class="home-left-bottom-bottom">
          <el-input placeholder="请输入房间名" v-model="roomName">
            <el-button slot="append" icon="el-icon-s-home" @click="createRoom">创建房间</el-button>
          </el-input>
        </div>
      </div>
    </div>

    <div class="home-center">
      <div class="home-center-title">
        <span>当前在线</span>
      </div>
      <div class="home-center-content">
        <div v-for="item in userList" class="home-center-content-list">
          {{ item }}
        </div>
      </div>
    </div>

    <div class="home-right">
      <div class="home-right-title">
        <span>
          房间列表
        </span>
      </div>
      <div class="home-right-bottom">
        <div v-for="item in rooms" class="home-right-content">
          <div class="home-right-content-room-name">
            <span>{{ item.roomName }}</span>
          </div>
          <div class="home-right-content-enter-btn">
            <el-button @click="enterRoom(item)" size="mini">进入房间</el-button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
  data() {
    return {
      roomName: '',
      rooms: [],
      onlineNum: 0,
      userName: '',
      account: '',
      userList: []
    }
  },
  created() {
    if (!localStorage.getItem('userName') || !localStorage.getItem('account')) {
      this.$router.replace('/404')
    }
    this.userName = localStorage.getItem('userName')
    this.account = localStorage.getItem('account')
    this.$socket.emit('getSysInfo')
    this.$socket.emit('getUserList')
  },
  methods: {
    createRoom() {
      this.$socket.emit('createRoom', {
        roomName: this.roomName
      })
    },
    enterRoom(item) {
      this.$socket.emit('enterRoom', {
        roomId: item.roomId
      })
      this.$router.push(`/camera/${item.roomId}`);
    },
    logout() {
      localStorage.clear()
      this.$router.replace('/login')
    },
    changePassword() {
      this.$router.push('/changePassword')
    }
  },
  sockets: {
    connect() {
      this.$socket.emit('init')
    },
    updateRoomList(res) {
      this.rooms = res
    },
    enterRoomSuccess(res) {
      this.$message({
        message: '成功创建房间',
        type: 'success'
      });
      this.$router.push(`/camera/${res.roomId}`);
    },
    updateOnlineNum(res) {
      this.onlineNum = res
    },
    exitSuccess() {
      this.$message({
        message: '退出房间',
        type: 'success'
      });
    },
    sendUserList(res) {
      this.userList = res;
    }
  }
}
</script>

<style scoped>

/*隐藏chrome下的滚动条*/
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.home {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: 20px;
  display: flex;
}

.home-left {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.home-left-top {
  flex: 1;
  margin: 30px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}

.home-left-top-title {
  font: 20px Extra large;
  font-weight: 700;
}

.home-left-top-info {
  font: 18px large;
}

.home-left-top-logout-btn {
  margin-top: 20px;
}

.home-left-bottom {
  flex: 2;
  margin: 30px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}

.home-left-bottom-top {
  font: 18px Extra large;
  text-align: center;
}

.home-left-bottom-center {
  margin-top: 50px;
  text-align: center;
  font: 50px Extra large;
  font-weight: 700;
}

.home-left-bottom-bottom {
  position: absolute;
  bottom: 50px;
}

.home-center {
  flex: 1;
  margin: 30px 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}

.home-center-title {
  padding: 30px;
  text-align: center;
  font: 20px Extra large;
  font-weight: 700;
}

.home-center-content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 90px;
  margin: 0 30px 30px 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
}

.home-center-content-list {
  margin: 10px;
  padding: 0 30px;
  border-bottom: 1px solid #DCDCDC;
}


.home-right {
  flex: 1;
  margin: 30px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}

.home-right-title {
  font: 20px Extra large;
  font-weight: 700;
  text-align: center;
  margin-bottom: 30px;
}

.home-right-bottom {
  position: absolute;
  bottom: 30px;
  left: 30px;
  right: 30px;
  top: 70px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  overflow-y: scroll;
}

.home-right-content {
  display: flex;
  margin: 10px;
  height: 30px;
  border-bottom: #DCDCDC 1px solid;
}

.home-right-content-room-name {
  line-height: 30px;
  text-align: center;
  flex: 2;
}

.home-right-content-enter-btn {
  flex: 1;
}
</style>
