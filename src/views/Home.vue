<template>
  <div class="home">
    <input v-model="roomName">
    <button @click="createRoom">创建房间</button>
    <div v-for="item in rooms">
      <div>
        <span>{{ item.roomName }}</span>
        <button @click="enterRoom(item)">进入房间</button>
      </div>
    </div>
    <div>
      当前在线人数：{{ onlineNum }}
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
      userInfo: null
    }
  },
  created() {
    this.userInfo = this.$route.query.userInfo
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
      console.log(res)
    },
    UpdateOnlineNum(res) {
      this.onlineNum = res
    },
  }
}
</script>
