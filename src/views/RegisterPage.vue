<template>
  <div id="register">
    <div class="register-come-back">
      <el-button type="info" icon="el-icon-arrow-left"
                 size="small" @click="backBtnClick">返回
      </el-button>
    </div>
    <div class="register-title">
      <span class="register-title-content">
        账号注册
      </span>
    </div>
    <div class="content">
      <div class="content-item">
        <span class="input-title">用户名：</span>
        <el-input v-model="userName" clearable prefix-icon="el-icon-user" class="input-content"></el-input>
      </div>
      <div class="content-item">
        <span class="input-title">身份：</span>
        <el-select v-model="doctor" placeholder="请选择" class="input-content">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="content-item">
        <span class="input-title">账号：</span>
        <el-input v-model="account" clearable prefix-icon="el-icon-s-custom" class="input-content"></el-input>
      </div>
      <div class="content-item">
        <span class="input-title">密码：</span>
        <el-input show-password v-model="firstPassword" clearable prefix-icon="el-icon-lock"
                  class="input-content"></el-input>
      </div>
      <div class="content-item">
        <span class="input-title">重复密码：</span>
        <el-input show-password v-model="secondPassword" clearable prefix-icon="el-icon-lock"
                  class="input-content" @keypress.native.enter="registerClick"></el-input>
      </div>
      <div class="content-btn">
        <el-button @click="registerClick" class="btn-item" type="success">注册</el-button>
        <el-button @click="resetClick" class="btn-item" type="info">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>

import {userRegister} from "@/request/user";

export default {
  name: "register",
  data() {
    return {
      account: '',
      userName: '',
      firstPassword: '',
      secondPassword: '',
      options: [
        {
          value: 0,
          label: '普通用户'
        }, {
          value: 1,
          label: '医生'
        }
      ],
      doctor: 0
    }
  },
  methods: {
    registerClick() {
      if (this.userName && this.account && this.firstPassword && this.secondPassword) {
        if (this.firstPassword === this.secondPassword) {
          userRegister(this.userName, this.account, this.secondPassword, this.doctor).then(res => {
            if (res.data) {
              this.$message({
                message: '注册成功',
                type: 'success'
              });
              setTimeout(() => {
                localStorage.clear();
                this.$router.replace('/login')
              }, 1000)
            } else {
              this.$message({
                message: '注册失败：账号已存在',
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
        this.account = '';
        this.userName = '';
        this.firstPassword = '';
        this.secondPassword = '';
      });
    },
    backBtnClick() {
      this.$router.go(-1)
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

  background-image: url("../assets/img/registerBg.jpg");
  background-size: cover;
}

.register-come-back {
  position: absolute;
  left: 30px;
  top: 30px;
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
  height: 360px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .5);
  border-radius: 10px;
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
