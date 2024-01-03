<template>
  <div class="app-container">
    <div class="filter-container">
      分屏：
      <el-button type="primary" @click="value=1;fff()">1</el-button>
      <el-button type="primary" @click="value=4;fff()">4</el-button>
      <el-button type="primary" @click="value=9;fff()">9</el-button>
    </div>
    <div class="video-container" :style="'height:' + windowsHeight+ 'px'">
      <el-row v-for="row in rows" :gutter="5">
        <el-col v-for="col in cols" :span="colSpan">
          <div class="video-col" :style="'height:' + colHeight + 'px'"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Video',
  data() {
    return {
      value: 1,
      windowsHeight: 0,
      rows: 1,
      cols: 1,
      colSpan: 24,
      colHeight: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 自适应表格高度
      this.windowsHeight = window.innerHeight - 140
      this.colHeight = this.windowsHeight / this.rows
      // 监听窗口大小变化
      const self = this;
      window.onresize = function () {
        self.windowsHeight = window.innerHeight - 140
        self.colHeight = self.windowsHeight / self.rows
      }
    })
  },
  methods: {
    fff() {
      let v = Math.sqrt(this.value)
      this.rows = v | 0
      this.cols = (v + 0.6) | 0
      this.colSpan = 24 / this.cols
      this.colHeight = this.windowsHeight / this.rows
    }
  }
}
</script>

<style lang="scss" scoped>
.video-container {
  width: 100%;
  border-radius: 4px;
}

.video-col {
  background-color: rgb(236, 239, 247);
  width: 100%;
  border-radius: 5px;
  margin-bottom: 5px;
}
</style>
