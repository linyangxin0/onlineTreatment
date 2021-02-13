<template>
  <div id="home">
    <div class="home-content">
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
            {{ item.userName }}
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
      userList: [],
      isDoctor: null
    }
  },
  created() {
    if (!localStorage.getItem('userName') || !localStorage.getItem('account')) {
      this.$router.replace('/404')
    }
    this.userName = localStorage.getItem('userName')
    this.account = localStorage.getItem('account')
    this.isDoctor = localStorage.getItem('isDoctor')

    this.$socket.emit('getSysInfo')
    this.$socket.emit('getUserList', this.userName)
  },
  methods: {
    createRoom() {
      if (this.isDoctor + '' === '1') {
        for (let item of this.rooms) {
          if (item.roomName + '' === this.roomName.trim() + '') {
            this.$message({
              type: 'warning',
              message: '房间名已存在'
            });
            return;
          }
        }
        this.$prompt('若需要，请输入该房间密码；否则请点击“无需密码”按钮', '提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定创建',
          cancelButtonText: '无需密码',
          inputPlaceholder: '请输入...'
        }).then(({value}) => {
          this.$socket.emit('createRoom', {
            roomName: this.roomName.trim(),
            password: value
          })
        }).catch((action) => {
          if (action === 'cancel') {
            this.$socket.emit('createRoom', {
              roomName: this.roomName.trim(),
              password: null
            })
          }
        });
      } else {
        this.$message({
          type: 'warning',
          message: '不具备创建房间权限'
        });
      }
    },
    enterRoom(item) {
      if (item.password !== null) {
        this.$prompt('请输入房间密码', '提示', {
          confirmButtonText: '确定',
          inputPlaceholder: '请输入...'
        }).then(({value}) => {
          this.$socket.emit('enterRoom', {
            roomId: item.roomId,
            password: value
          })
        })
      } else {
        this.$socket.emit('enterRoom', {
          roomId: item.roomId,
          password: null
        })
      }
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
    createRoomSuccess(res) {
      this.$message({
        message: '成功创建房间',
        type: 'success'
      });
      this.$router.push(`/camera/${res.roomId}`);
    },
    enterRoomSuccess(res) {
      this.$message({
        message: '成功进入房间',
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
    },
    enterRoomFailure() {
      this.$message({
        message: '房间密码错误',
        type: 'warning'
      });
    }
  }
}
</script>

<style scoped>

/*隐藏chrome下的滚动条*/
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

#home {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  background-image: url("../assets/img/homeBg.jpg");
}

.home-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: 20px;
  display: flex;
  opacity: 95%;
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
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border-radius: 10px;
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
  background-color: #fff;
  border-radius: 10px;
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

  background-color: #fff;
  border-radius: 10px;
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
  text-align: center;
}

.home-right {
  flex: 1;
  margin: 30px;
  padding: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;

  background-color: #fff;
  border-radius: 10px;
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
