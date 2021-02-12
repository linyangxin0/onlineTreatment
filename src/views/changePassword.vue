<template>
  <div class="add-content">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
      <el-form-item label="新密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item class="add-content-btn">
        <el-button class="add-content-btn-left" type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button class="add-content-btn-right" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import {updatePassword} from "@/request/home";

export default {
  name: "changePassword",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: '',
        checkPass: '',
      },
      rules: {
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updatePassword(localStorage.getItem('account'), this.ruleForm.checkPass).then(res => {
            if (res.data) {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.$router.push('/home')
            } else {
              this.$message({
                message: '新密码与原密码一致',
                type: 'warning'
              });
            }
          })
        } else {
          this.$message({
            message: '非法输入',
            type: 'warning'
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
.add-content {
  padding: 30px;
  width: 500px;

  position: absolute;
  top: 50%;
  left: 47%;
  margin-left: -250px;
  margin-top: -200px;
}
</style>
