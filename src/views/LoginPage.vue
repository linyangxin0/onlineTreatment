<template>
  <div class="login">
    <div class="login-content">
      <div class="login-title">
        <span>线上望诊系统</span>
      </div>
      <div class="login-input-content">
        <span class="login-input-text">账号：</span>
        <el-input class="login-input"
                  clearable
                  v-model="account"
                  placeholder="account"
                  prefix-icon="el-icon-user-solid"></el-input>
      </div>
      <div class="login-input-content">
        <span class="login-input-text">密码：</span>
        <el-input class="login-input"
                  prefix-icon="el-icon-edit"
                  placeholder="password"
                  v-model="password"
                  type="password"
                  clearable></el-input>
      </div>
      <div class="login-bottom">
        <el-button class="login-btn" type="success" @click="login">登录</el-button>
        <el-button class="login-btn" type="info" @click="register">注册</el-button>
      </div>

    </div>
  </div>
</template>

<script>
import {userLogin} from "@/request/home";

export default {
  name: "LoginPage",
  data() {
    return {
      account: '',
      password: ''
    }
  },
  methods: {
    login() {
      if (this.account.trim() === '' || this.password.trim() === '') {
        this.$message.error('用户名或密码不能为空');
      } else {
        userLogin(this.account, this.password).then(res => {
          if (res.data) {
            this.$message({
              message: '登陆成功',
              type: 'success'
            });
            this.$router.push('/')
            localStorage.setItem('userName', res.data.name)
            localStorage.setItem('account', res.data.account)

          } else {
            this.$message.error('用户名或密码错误');
          }
        });
      }
    },
    register() {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped>
.login {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  background-image: url("../assets/img/loginBg.jpg");
  background-size: cover;
}

.login-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);

  height: 300px;
  width: 500px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .5);
}

.login-title {
  text-align: center;
  margin: 20px;
  font: 25px Extra large;
}

.login-input-content {
  margin: 20px 20px;
  height: 40px;
  display: flex;
}

.login-input-text {
  flex: 1;
  text-align: center;
  line-height: 40px;

  font: 18px Extra large;
  font-weight: 700;
  color: #303133;
}

.login-input {
  flex: 7;
}

.login-bottom {
  margin: 50px 30px;

  display: flex;
}

.login-btn {
  flex: 1;
}
</style>
