<template>
  <div id="changePassword">
    <div class="changePassword-title">
      <span class="changePassword-title-content">
        修改密码
      </span>
    </div>
    <div class="content">
      <div class="content-item">
        <span class="input-title">账号：</span>
        <el-input v-model="account" disabled clearable prefix-icon="el-icon-user" class="input-content"></el-input>
      </div>
      <div class="content-item">
        <span class="input-title">原密码：</span>
        <el-input v-model="oldPassword" show-password clearable prefix-icon="el-icon-lock"
                  class="input-content"></el-input>
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
        <el-button @click="changePasswordClick" class="btn-item" type="success">修改</el-button>
        <el-button @click="resetClick" class="btn-item" type="info">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>

import {updatePassword} from "@/request/user";

export default {
  name: "ChangePasswordPage",
  data() {
    return {
      account: '',
      oldPassword: '',
      firstPassword: '',
      secondPassword: ''
    }
  },
  created() {
    //检查登陆状态
    if (!localStorage.getItem('userName') || !localStorage.getItem('account')) {
      this.$router.replace('/404')
    }
    this.account = localStorage.getItem('account')
  },
  methods: {
    changePasswordClick() {
      if (this.oldPassword && this.account && this.firstPassword && this.secondPassword) {
        if (this.firstPassword === this.secondPassword) {
          updatePassword(this.account, this.oldPassword, this.secondPassword).then(res => {
            if (res.data.first) {
              if (res.data.second) {
                this.$message({
                  message: '修改成功,请重新登录',
                  type: 'success'
                });
                setTimeout(() => {
                  localStorage.clear();
                  this.$router.replace('/login')
                }, 1000)
              } else {
                this.$message({
                  message: '密码未发生变化',
                  type: 'warning'
                });
              }
            } else {
              this.$message({
                message: '修改失败：原密码不正确',
                type: 'warning'
              });
            }
          })
        } else {
          this.$message({
            message: '两次密码输入不一致，请重新输入',
            type: 'warning'
          });
        }
      } else {
        this.$message({
          message: '输入为空！',
          type: 'warning'
        });
      }
    },
    resetClick() {
      this.$confirm('是否清空当前输入?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        center: true
      }).then(() => {
        this.oldPassword = '';
        this.firstPassword = '';
        this.secondPassword = '';
      });
    }
  }
}
</script>

<style scoped>
#changePassword {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background-image: url("../assets/img/changPasswordBg.jpg");
  background-size: cover;
}

.changePassword-title {
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
  border-radius: 20px;
  padding: 20px;

  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  font-weight: 700;

  background-color: #fff;
  opacity: 90%;
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
