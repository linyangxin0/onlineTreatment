<template>
  <div class="home">

  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {},
  methods: {

  },
  sockets: {
    connect(data) {
      this.$socket.emit('login', {
        name: 'lin',
        password: '123'
      })
    },
    relogin(data) {
      console.log(data)
    },
  }
}
</script>
