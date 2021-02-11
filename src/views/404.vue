<template>
  <div class="not-found-content">
      未登录，或登录的用户权限不足，请等待跳转
  </div>
</template>

<script>
  export default {
    name: "404",
    created() {
      this.goLogin()
    },
    methods:{
      goLogin(){
        setTimeout(()=> {
          this.$router.replace('/login')
        },3000)
      }
    }
  }
</script>

<style scoped>
  .not-found-content{
    position: fixed;
    top: 50%;
    left: 30%;
    font-size: 30px;
  }
</style>
