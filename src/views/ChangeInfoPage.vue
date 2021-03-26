<template>
  <div id="changePassword">
    <div class="changePassword-come-back">
      <el-button
        type="info"
        icon="el-icon-arrow-left"
        size="small"
        @click="backBtnClick"
      >
        返回
      </el-button>
    </div>
    <div class="changePassword-title">
      <span class="changePassword-title-content"> 修改个人信息 </span>
    </div>
    <div class="content">
      <el-form
        :label-position="labelPosition"
        label-width="80px"
        :model="formLabelAlign"
      >
        <el-form-item label="电话">
          <el-input v-model="formLabelAlign.tel" />
        </el-form-item>
        <el-form-item label="所属部门">
          <el-input v-model="formLabelAlign.partment" />
        </el-form-item>
        <el-form-item label="个人信息">
          <el-input
            v-model="formLabelAlign.info"
            type="textarea"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="updateClick"
          >
            确认修改
          </el-button>
          <el-button @click="resetClick">
            重置
          </el-button>
        </el-form-item>
        <el-form-item label="更换头像">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="avatar"
            >
            <i
              v-else
              class="el-icon-plus avatar-uploader-icon"
            />
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getUserInfoById, updateUserInfo } from '../request/user';

export default {
  name: 'ChangeInfoPage',
  data() {
    return {
      labelPosition: 'right',
      formLabelAlign: {
        tel: '',
        partment: '',
        info: '',
      },
      imageUrl: '',
    };
  },
  created() {
    // 检查登陆状态
    if (!localStorage.getItem('userName') || !localStorage.getItem('account')) {
      this.$router.replace('/404');
    }
    getUserInfoById(this.$route.params.id).then(res => {
      this.formLabelAlign.tel = res.data.tel;
      this.formLabelAlign.partment = res.data.partment;
      this.formLabelAlign.info = res.data.info;
    });
  },
  methods: {
    backBtnClick() {
      this.$router.go(-1);
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    resetClick() {
      getUserInfoById(this.$route.params.id).then(res => {
        this.formLabelAlign.tel = res.data.tel;
        this.formLabelAlign.partment = res.data.partment;
        this.formLabelAlign.info = res.data.info;
      });
    },
    updateClick() {
      updateUserInfo(this.$route.params.id, this.formLabelAlign).then(res => {
        if (res.data) {
          this.$message({
            message: '修改成功',
            type: 'success',
          });
        } else {
          this.$message({
            message: '修改失败，或内容没有发生变化',
            type: 'warning',
          });
        }
      });
    },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
#changePassword {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background-image: url('../assets/img/changPasswordBg.jpg');
  background-size: cover;
}

.changePassword-come-back {
  position: absolute;
  top: 30px;
  left: 30px;
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
  height: 450px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 20px;

  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  overflow-y: scroll;
  font-weight: 700;
  background-color: #fff;
  opacity: 90%;
}

.content-item {
  display: flex;
  height: 60px;
  line-height: 60px;
}

/* 头像框*/
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}
.avatar-uploader:hover,
.el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
