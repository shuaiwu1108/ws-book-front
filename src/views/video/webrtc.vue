<template>
  <el-row :gutter="10">
    <el-col :span="4" style="padding: 10px">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" disabled>全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedVideos" @change="handleCheckedVideoChange" :max="value">
        <el-checkbox v-for="video in videos" :label="video" :key="video.id" style="display: block">{{ video.equipName }}
        </el-checkbox>
      </el-checkbox-group>
    </el-col>
    <el-col :span="20" style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding: 10px">
      <div class="filter-container">
        分屏：
        <el-button type="primary" @click="value=1;fff()">1</el-button>
        <el-button type="primary" @click="value=4;fff()">4</el-button>
        <el-button type="primary" @click="value=9;fff()">9</el-button>
      </div>
      <div class="video-container" :style="'height:' + windowsHeight+ 'px'">
        <el-row v-for="row in rows" :gutter="5">
          <el-col v-for="col in cols" :span="colSpan">
            <div class="video-col" :style="'height:' + colHeight + 'px'">
              <video class="video" controls :ref="'video'+((row - 1) * cols + (col - 1))" playsinline></video>
              <el-button class="video-button" type="info" icon="el-icon-circle-close" circle size="mini"></el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {getEquips} from "@/api/video";
import flvjs from "@/assets/flv.min.js"
import mpegts from 'mpegts.js'

export default {
  name: 'Video',
  data() {
    return {
      value: 1,
      windowsHeight: 0,
      rows: 1,
      cols: 1,
      colSpan: 24,
      colHeight: 0,
      videos: [],
      checkAll: false,
      checkedVideos: [],
      isIndeterminate: false,
      players: [],
    }
  },
  created() {
    this.getEquips()
    this.fff()
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
    handleCheckAllChange(val) {
      // this.checkedVideos = val ? this.videos : [];
      // this.isIndeterminate = false;
      //
      // if (!val) {
      //   this.destroyPlay()
      // } else {
      //   for (let i = 0; i < this.checkedVideos.length; i++) {
      //     this.createdPlay(i)
      //   }
      // }
    },
    handleCheckedVideoChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.videos.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.videos.length;

      this.destroyPlay()

      for (let i = 0; i < checkedCount; i++) {
        this.createdPlay(i)
      }
    },
    fff() {
      let v = Math.sqrt(this.value)
      this.rows = v | 0
      this.cols = (v + 0.6) | 0
      this.colSpan = 24 / this.cols
      this.colHeight = this.windowsHeight / this.rows
      this.destroyPlay()
      this.checkedVideos = []
      this.isIndeterminate = false
    },
    getEquips() {
      getEquips().then(response => {
        this.videos = response.data
      })
    },
    createdPlay(i) {
      // if (flvjs.isSupported()) {
      //   let videoElement = null;
      //   videoElement = this.$refs['video' + i][0];
      //   let player = flvjs.createPlayer({
      //     url: this.videos[i].equipAddr,
      //     hasVideo: true,
      //     hasAudio: false,
      //     isLive: true,
      //     type: 'flv'
      //   }, {
      //     stashInitialSize: 128,
      //     autoCleanupSourceBuffer: true,
      //     lazyLoad: false,
      //     enableWorker: false,
      //     enableStashBuffer: false
      //   });
      //   player.attachMediaElement(videoElement);
      //   player.load();
      //   player.play();
      //
      //   this.players.push(player)
      // }

      if (mpegts.getFeatureList().mseLivePlayback) {
        let videoElement = null;
        videoElement = this.$refs['video' + i][0];
        let player = mpegts.createPlayer({
          type: 'flv',  // could also be mpegts, m2ts, flv
          isLive: true,
          url: this.videos[i].equipAddr,
          hasAudio: false,
        });
        player.attachMediaElement(videoElement);
        player.load();
        player.play();

        this.players.push(player)
      }
    },
    destroyPlay() {
      for (let i = 0; i < this.players.length; i++) {
        let player = this.players[i]
        player.pause();
        player.unload();
        player.detachMediaElement();
        player.destroy();
        player = null
      }

      this.players = []
    }
  }
}
</script>

<style lang="scss" scoped>
.video-container {
  width: 100%;
  border-radius: 5px;
}

.video-col {
  background-color: rgb(236, 239, 247);
  width: 100%;
  border-radius: 5px;
  margin-bottom: 5px;
  position: relative;
}
.video-button{
  position: absolute;
  top: 5px;
  right: 10px;
  z-index: 1;
}

.video {
  height: 100%;
  width: 100%;
  border-radius: 5px;
  object-fit: fill;
}

.el-row {
  margin: 0 !important;
}
</style>
