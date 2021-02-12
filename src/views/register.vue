<template>
  <div id="register">
    <div class="register-title">
      <span class="register-title-content">
        账号注册
      </span>
    </div>
    <div class="content">
      <div class="content-item">
        <span class="input-title">用户名：</span>
        <el-input v-model="account" clearable prefix-icon="el-icon-user" class="input-content"></el-input>
      </div>
      <div class="content-item">
        <span class="input-title">账号：</span>
        <el-input v-model="userName" clearable prefix-icon="el-icon-s-custom" class="input-content"></el-input>
      </div>
      <div class="content-item">
        <span class="input-title">密码：</span>
        <el-input show-password v-model="firstPassword" clearable prefix-icon="el-icon-lock"
                  class="input-content"></el-input>
      </div>
      <div class="content-item">
        <span class="input-title">重复密码：</span>
        <el-input show-password v-model="secondPassword" clearable prefix-icon="el-icon-lock"
                  class="input-content"></el-input>
      </div>
      <div class="content-btn">
        <el-button @click="registerClick" class="btn-item">注册</el-button>
        <el-button @click="resetClick" class="btn-item">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "register",
  data() {
    return {
      account: '',
      userName: '',
      firstPassword: '',
      secondPassword: ''
    }
  },
  methods: {
    registerClick() {
      console.log('注册')
    },
    resetClick() {
      this.account = '';
      this.userName = '';
      this.firstPassword = '';
      this.secondPassword = '';
    }
  }
}
</script>

<style scoped>
#register {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background-image: url("../assets/img/register-bg.jpg");
  background-size: cover;
}

.register-title {
  position: absolute;
  width: 300px;
  left: calc(50% - 150px);
  top: 15%;
  text-align: center;
  font: 30px Extra large;
  font-weight: 700;
}

.content {
  width: 600px;
  height: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .5);
  padding: 20px;

  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  font-weight: 700;

  background-color: #fff;
  opacity: 95%;
}

.content-item {
  display: flex;
  height: 60px;
  line-height: 60px;
}

.input-title {
  flex: 1;
}

.input-content {
  flex: 5;
}

.content-btn {
  display: flex;
  justify-content: center;
  margin: 20px;
}

.btn-item {
  flex: 30%;
}
</style>
