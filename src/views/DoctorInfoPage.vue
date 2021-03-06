<template>
  <div class="page">
    <!-- 简单资料 -->
    <div class="content-top">
      <div class="content-top-left">
        <el-image
          class="user-avatar"
          :src="info.avatar_url"
          fit="cover"
        />
      </div>
      <div class="content-top-right">
        <div class="content-top-right-name">
          <span>医生姓名：{{ info.name }}</span>
        </div>
        <div class="content-top-right-tel">
          <span>联系方式：{{ info.tel }}</span>
        </div>
        <div class="content-top-right-partment">
          <span>所属部门：{{ info.partment }}</span>
        </div>
        <p
          class="content-top-right-info"
          v-html="displayInfo"
        >
          {{ displayInfo }}
        </p>
      </div>
    </div>
    <!-- 预约时间 -->
    <div class="page-content-bottom">
      <div class="page-content-bottom-left">
        <div class="page-content-bottom-text">
          <span>预约时间：</span>
        </div>
        <div>
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            class="page-content-bottom-date"
          />
        </div>
        <div>
          <el-time-select
            ref="timeSelect"
            v-model="time"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30',
            }"
            placeholder="选择时间"
            class="page-content-bottom-time"
            @change="choseTime"
          />
        </div>
        <div>
          <el-button
            size="middle"
            type="message"
            class="page-content-bottom-button"
            @click="makeAppointment"
          >
            预约
          </el-button>
        </div>
      </div>
      <!-- 当前已预约时段 -->
      <div class="page-content-bottom-right">
        <div class="page-content-bottom-right-title">
          <span>当前已预约时段:</span>
        </div>
        <div class="page-content-bottom-right-content">
          <div
            v-for="(item, index) in displayTimes"
            :key="index"
            class="page-content-bottom-right-text"
            :class="{ ownAppointment: userId + '' === item.user_id + '' }"
          >
            <span>{{ item.time }}</span>
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
        shortcuts: [
          {
            text: '明天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit('pick', date);
            },
          },
          {
            text: '后天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 2);
              picker.$emit('pick', date);
            },
          },
          {
            text: '一周后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            },
          },
        ],
      },
      userId: '',
    };
  },
  computed: {
    displayTimes() {
      this.appointedTimes.forEach(item => {
        item.time = dateFormat('YY-mm-dd HH:MM', new Date(item.time));
      });
      return this.appointedTimes;
    },
    displayInfo() {
      return this.info.info && `&nbsp;&nbsp;&nbsp;&nbsp;${this.info.info.replace(/\n/g, '\n&nbsp;&nbsp;&nbsp;&nbsp;')}`;
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
    this._getAppointment();
    this.userId = localStorage.getItem('userId');
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
        addAppointment(this.$route.params.id, this.timeStamp, this.userId).then(res => {
          if (res.data) {
            this.$message({
              message: '预约成功',
              type: 'success',
            });
            this._getAppointment();
            this.time = '';
            this.date = '';
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
    _getAppointment() {
      getAppointmentById(this.$route.params.id).then(res => {
        this.appointedTimes = res.data;
      });
    },
    choseTime() {
      if (this.date === '') {
        this.$message({
          message: '请先选择日期',
          type: 'warning',
        });
        this.time = '';
      }
    },
  },
};
</script>

<style scoped>
.page {
  white-space: pre-line;
}

.content-top {
  display: flex;
  margin: 50px 200px 50px 80px;
}

.content-top-left {
  flex: 1;
  text-align: center;
}

.user-avatar {
  width: 200px;
  height: 300px;
}

.content-top-right {
  flex: 4;
}

.content-top-right-name {
  font-size: 20px;
  font-weight: 700;
  margin: 15px 0;
}

.content-top-right-tel,
.content-top-right-partment {
  font-size: 18px;
  margin: 10px 0;
}
.content-top-right-info {
  font-size: 16px;
  line-height: 25px;
}

.page-content-bottom {
  display: flex;
  justify-content: space-around;
  margin-top: 50px;
}

.page-content-bottom-text,
.page-content-bottom-date,
.page-content-bottom-time,
.page-content-bottom-button {
  margin-top: 50px;
}

.page-content-bottom-text {
  margin-top: 20px;
  font-size: 20px;
  font-weight: 700;
}

.page-content-bottom-right-title {
  margin: 20px 0;
  font-size: 20px;
  font-weight: 700;
}

.page-content-bottom-right-content {
  height: 300px;
  width: 400px;
  overflow-y: scroll;

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}

.page-content-bottom-right-text {
  font-size: 18px;
  height: 50px;
  line-height: 50px;

  text-align: center;
}

.page-content-bottom-right-text:hover {
  background-color: #f2f6fc;
}

.ownAppointment {
  background-color: #c1ffc1;
}
</style>
