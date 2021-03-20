<template>
  <div>
    <!-- 简单资料 -->
    <div>
      <div>
        <span>医生姓名：{{ info.name }}</span>
      </div>
      <div>
        <span>联系方式：{{ info.tel }}</span>
      </div>
      <div>
        <span>所属部门：{{ info.partment }}</span>
      </div>
    </div>
    <!-- 详细资料 -->
    <div>
      {{ info.info }}
    </div>
    <!-- 预约时间 -->
    <div>
      <span>预约时间：</span>
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
      />
      <el-time-select
        v-model="time"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30',
        }"
        placeholder="选择时间"
      />
    </div>
  </div>
</template>

<script>
import { selectDoctorInfoById } from '../request/user';

export default {
  name: 'DoctorInfoPage',
  data() {
    return {
      info: {},
      date: '',
      time: '',
      timeStamp: '',
    };
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
  },
  methods: {
    transfromToTimeSamp() {
      if (this.date !== '' && this.time !== '') {
        let newTime = 0;
        let timeArr = this.time.split(':');
        newTime = 3600 * timeArr[0] + 60 * timeArr[1];
        this.timeStamp = Date.parse(this.date) + newTime;
      }
    },
  },
};
</script>

<style></style>
