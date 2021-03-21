<template>
  <div class="dcotor-info-page">
    <!-- 简单资料 -->
    <div class="dcotor-info-content-top">
      <div class="dcotor-info-content-top-left">
        <el-image
          class="user-avatar"
          :src="info.avatar_url"
          fit="cover"
        />
      </div>
      <div class="dcotor-info-content-top-right">
        <div class="dcotor-info-content-top-right-name">
          <span>医生姓名：{{ info.name }}</span>
        </div>
        <div class="dcotor-info-content-top-right-tel">
          <span>联系方式：{{ info.tel }}</span>
        </div>
        <div class="dcotor-info-content-top-right-partment">
          <span>所属部门：{{ info.partment }}</span>
        </div>
        <p class="dcotor-info-content-top-right-info">
          {{ info.info }}
        </p>
      </div>
    </div>
    <!-- 预约时间 -->
    <div class="doctor-info-page-content-bottom">
      <div class="doctor-info-page-content-bottom-left">
        <div>
          <span class="doctor-info-page-content-bottom-text">预约时间：</span>
        </div>
        <div>
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="选择日期"
            class="doctor-info-page-content-bottom-date"
          />
        </div>
        <div>
          <el-time-select
            v-model="time"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30',
            }"
            placeholder="选择时间"
            class="doctor-info-page-content-bottom-time"
          />
        </div>
        <div>
          <el-button
            size="middle"
            type="message"
            class="doctor-info-page-content-bottom-button"
            @click="makeAppointment"
          >
            预约
          </el-button>
        </div>
      </div>
      <!-- 当前已预约时段 -->
      <div class="doctor-info-page-content-bottom-right">
        <div class="doctor-info-page-content-bottom-right-title">
          <span>当前已预约时段</span>
        </div>
        <div>
          <div
            v-for="(item, index) in displayTimes"
            :key="index"
            class="doctor-info-page-content-bottom-right-text"
          >
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { selectDoctorInfoById, addAppointment, getAppointmentById } from '../request/user';
import { dateFormat } from '@/utils/timeFormate';

export default {
  name: 'DoctorInfoPage',
  data() {
    return {
      info: {},
      date: '',
      time: '',
      timeStamp: '',
      appointedTimes: [],
    };
  },
  computed: {
    displayTimes() {
      let displayTimesArr = [];
      let arr = [];
      this.appointedTimes.forEach(item => arr.push(item.time));
      arr.forEach(item => {
        displayTimesArr.push(dateFormat('YY-mm-dd HH:MM', new Date(item)));
      });
      return displayTimesArr;
    },
  },
  watch: {
    date() {
      this.transfromToTimeSamp();
    },
    time() {
      this.transfromToTimeSamp();
    },
  },
  created() {
    selectDoctorInfoById(this.$route.params.id).then(res => {
      this.info = res.data;
    });
    getAppointmentById(this.$route.params.id).then(res => {
      this.appointedTimes = res.data;
    });
  },
  methods: {
    transfromToTimeSamp() {
      if (this.date !== '' && this.time !== '') {
        let newTime = 0;
        let timeArr = this.time.split(':');
        newTime = 1000 * (3600 * timeArr[0] + 60 * timeArr[1]);
        this.timeStamp = Date.parse(this.date) + newTime;
      }
    },
    makeAppointment() {
      if (this.timeStamp !== '') {
        addAppointment(this.$route.params.id, this.timeStamp).then(res => {
          if (res.data) {
            this.$message({
              message: '预约成功',
              type: 'success',
            });
          } else {
            this.$message({
              message: '预约失败，该时段已有预约',
              type: 'warning',
            });
          }
        });
      } else {
        this.$message({
          message: '请选择正确时间',
          type: 'warning',
        });
      }
    },
  },
};
</script>

<style scoped>
.dcotor-info-page {
  white-space: pre-line;
}

.dcotor-info-content-top {
  display: flex;
  margin: 50px 200px 50px 80px;
}

.dcotor-info-content-top-left {
  flex: 1;
  text-align: center;
}

.user-avatar {
  width: 200px;
  height: 300px;
}

.dcotor-info-content-top-right {
  flex: 4;
}

.dcotor-info-content-top-right-name {
  font-size: 20px;
  font-weight: 700;
  margin: 15px 0;
}

.dcotor-info-content-top-right-tel,
.dcotor-info-content-top-right-partment {
  font-size: 18px;
  margin: 10px 0;
}
.dcotor-info-content-top-right-info {
  font-size: 16px;
  line-height: 25px;
}

.doctor-info-page-content-bottom {
  display: flex;
  justify-content: space-around;
  margin-top: 50px;
}

.doctor-info-page-content-bottom-text,
.doctor-info-page-content-bottom-date,
.doctor-info-page-content-bottom-time,
.doctor-info-page-content-bottom-button {
  margin-top: 50px;
}

.doctor-info-page-content-bottom-right-title {
  margin: 20px 0;
  font-size: 20px;
  font-weight: 700;
}
.doctor-info-page-content-bottom-right-text {
  font-size: 18px;
  height: 25px;
  line-height: 25px;
}
</style>
