<template>
  <view class="seismic-data">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <text class="title">地震数据分析</text>
      <view class="time-selector">
        <text 
          v-for="(period, index) in timePeriods" 
          :key="index"
          :class="['time-option', { active: selectedPeriod === period.value }]"
          @tap="selectedPeriod = period.value"
        >
          {{ period.label }}
        </text>
      </view>
    </view>

    <!-- 地震波形图 -->
    <view class="section seismic-graph">
      <view class="section-header">
        <text class="section-title">地震波形</text>
        <view class="graph-legend">
          <view class="legend-item">
            <view class="color-dot p-wave"></view>
            <text>P波</text>
          </view>
          <view class="legend-item">
            <view class="color-dot s-wave"></view>
            <text>S波</text>
          </view>
        </view>
      </view>
      <view class="graph-container">
        <canvas canvas-id="seismicGraph" class="wave-canvas"></canvas>
        <view class="axis-labels">
          <text>强度</text>
        </view>
        <view class="time-axis">
          <text>时间（秒）</text>
        </view>
      </view>
    </view>

    <!-- 余震时间线 -->
    <view class="section aftershock-timeline">
      <view class="section-header">
        <text class="section-title">余震分布</text>
        <view class="magnitude-filter">
          <text>震级 ≥</text>
          <picker 
            :value="magnitudeIndex" 
            :range="magnitudeRange"
            @change="onMagnitudeChange"
          >
            <text class="selected-magnitude">{{ magnitudeRange[magnitudeIndex] }}</text>
          </picker>
        </view>
      </view>
      <scroll-view 
        class="timeline-container" 
        scroll-x 
        :show-scrollbar="false"
      >
        <view class="timeline">
          <view 
            v-for="(event, index) in filteredAftershocks" 
            :key="index"
            class="timeline-event"
            :style="{ left: event.position + '%' }"
          >
            <view 
              class="event-dot"
              :style="{ 
                width: event.magnitude * 8 + 'rpx',
                height: event.magnitude * 8 + 'rpx',
                backgroundColor: getEventColor(event.magnitude)
              }"
            ></view>
            <view class="event-info">
              <text class="magnitude">M{{ event.magnitude }}</text>
              <text class="time">{{ formatTime(event.time) }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 区域震动预测 -->
    <view class="section shaking-prediction">
      <view class="section-header">
        <text class="section-title">区域震动预测</text>
        <view class="confidence-indicator">
          <text class="confidence-label">置信度</text>
          <text class="confidence-value">{{ currentConfidence }}%</text>
        </view>
      </view>
      <view class="prediction-map">
        <map
          id="predictionMap"
          class="map"
          :latitude="mapCenter.latitude"
          :longitude="mapCenter.longitude"
          :circles="intensityCircles"
          :scale="11"
        >
          <cover-view class="intensity-legend">
            <cover-view class="legend-title">预测震级</cover-view>
            <cover-view 
              v-for="(level, index) in intensityLevels" 
              :key="index"
              class="intensity-level"
            >
              <cover-view 
                class="color-block"
                :style="{ backgroundColor: level.color }"
              ></cover-view>
              <cover-view class="level-text">{{ level.label }}</cover-view>
            </cover-view>
          </cover-view>
        </map>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 时间周期选项
const timePeriods = [
  { label: '24小时', value: 24 },
  { label: '7天', value: 168 },
  { label: '30天', value: 720 }
]
const selectedPeriod = ref(24)

// 震级范围
const magnitudeRange = ['3.0', '4.0', '5.0', '6.0']
const magnitudeIndex = ref(0)

// 地图中心
const mapCenter = ref({
  latitude: 39.9042,
  longitude: 116.4074
})

// 震级颜色
const intensityLevels = [
  { label: '≥6.0', color: '#DC2626' },
  { label: '5.0-5.9', color: '#FB923C' },
  { label: '4.0-4.9', color: '#FBBF24' },
  { label: '3.0-3.9', color: '#22C55E' }
]

// 模拟余震数据
const aftershocks = ref([
  {
    magnitude: 4.5,
    time: new Date(Date.now() - 3600000),
    position: 15
  },
  {
    magnitude: 3.8,
    time: new Date(Date.now() - 7200000),
    position: 30
  },
  {
    magnitude: 5.2,
    time: new Date(Date.now() - 14400000),
    position: 45
  }
])

// 模拟预测圈
const intensityCircles = ref([
  {
    latitude: 39.9042,
    longitude: 116.4074,
    color: '#DC262650',
    fillColor: '#DC262620',
    radius: 5000,
    strokeWidth: 2
  },
  {
    latitude: 39.9042,
    longitude: 116.4074,
    color: '#FB923C50',
    fillColor: '#FB923C20',
    radius: 10000,
    strokeWidth: 2
  },
  {
    latitude: 39.9042,
    longitude: 116.4074,
    color: '#FBBF2450',
    fillColor: '#FBBF2420',
    radius: 15000,
    strokeWidth: 2
  }
])

// 当前置信度
const currentConfidence = ref(85)

// 根据震级筛选余震
const filteredAftershocks = computed(() => {
  const minMagnitude = Number.parseFloat(magnitudeRange[magnitudeIndex.value])
  return aftershocks.value.filter(event => event.magnitude >= minMagnitude)
})

// 获取事件颜色
const getEventColor = (magnitude) => {
  if (magnitude >= 6.0) return '#DC2626'
  if (magnitude >= 5.0) return '#FB923C'
  if (magnitude >= 4.0) return '#FBBF24'
  return '#22C55E'
}

// 格式化时间
const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 震级选择变化
const onMagnitudeChange = (e) => {
  magnitudeIndex.value = e.detail.value
}

// 绘制地震波形
const drawSeismicWave = () => {
  const ctx = uni.createCanvasContext('seismicGraph')
  const width = 600
  const height = 200
  const padding = 20
  
  // 清空画布
  ctx.clearRect(0, 0, width, height)
  
  // 绘制坐标轴
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.setStrokeStyle('#94A3B8')
  ctx.stroke()
  
  // 生成波形数据
  const points = []
  for (let i = 0; i < 100; i++) {
    const x = padding + (width - 2 * padding) * (i / 100)
    const y = height/2 + Math.sin(i/5) * 30 * Math.exp(-i/50)
    points.push([x, y])
  }
  
  // 绘制P波
  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1])
  for (const point of points) {
    ctx.lineTo(point[0], point[1])
  }
  ctx.setStrokeStyle('#3B82F6')
  ctx.stroke()
  
  // 绘制S波（稍微偏移）
  ctx.beginPath()
  ctx.moveTo(points[0][0], points[0][1] + 20)
  for (const point of points) {
    ctx.lineTo(point[0], point[1] + 20 + Math.cos(point[0]/10) * 10)
  }
  ctx.setStrokeStyle('#EF4444')
  ctx.stroke()
  
  ctx.draw()
}

onMounted(() => {
  drawSeismicWave()
})
</script>

<style lang="scss" scoped>
.seismic-data {
  min-height: 100vh;
  background: #F8FAFC;
  padding: 32rpx;
}

.nav-header {
  margin-bottom: 32rpx;
  
  .title {
    font-size: 36rpx;
    font-weight: 600;
    color: #1E293B;
    margin-bottom: 24rpx;
  }
  
  .time-selector {
    display: flex;
    gap: 16rpx;
    
    .time-option {
      padding: 12rpx 24rpx;
      background: #FFFFFF;
      border-radius: 32rpx;
      font-size: 26rpx;
      color: #64748B;
      
      &.active {
        background: #3B82F6;
        color: #FFFFFF;
      }
    }
  }
}

.section {
  background: #FFFFFF;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    
    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #1E293B;
    }
  }
}

// 地震波形图样式
.seismic-graph {
  .graph-legend {
    display: flex;
    gap: 16rpx;
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8rpx;
      
      .color-dot {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        
        &.p-wave {
          background: #3B82F6;
        }
        
        &.s-wave {
          background: #EF4444;
        }
      }
      
      text {
        font-size: 24rpx;
        color: #64748B;
      }
    }
  }
  
  .graph-container {
    position: relative;
    height: 400rpx;
    
    .wave-canvas {
      width: 100%;
      height: 100%;
    }
    
    .axis-labels {
      position: absolute;
      left: -24rpx;
      top: 50%;
      transform: rotate(-90deg);
      transform-origin: left center;
      
      text {
        font-size: 24rpx;
        color: #64748B;
      }
    }
    
    .time-axis {
      text-align: center;
      margin-top: 8rpx;
      
      text {
        font-size: 24rpx;
        color: #64748B;
      }
    }
  }
}

// 余震时间线样式
.aftershock-timeline {
  .magnitude-filter {
    display: flex;
    align-items: center;
    gap: 8rpx;
    
    text {
      font-size: 26rpx;
      color: #64748B;
    }
    
    .selected-magnitude {
      color: #3B82F6;
      font-weight: 500;
    }
  }
  
  .timeline-container {
    height: 200rpx;
    position: relative;
    
    .timeline {
      position: relative;
      height: 100%;
      width: 200%;
      
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 2rpx;
        background: #E2E8F0;
      }
    }
    
    .timeline-event {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      
      .event-dot {
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }
      
      .event-info {
        position: absolute;
        top: 20rpx;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        white-space: nowrap;
        
        .magnitude {
          font-size: 26rpx;
          font-weight: 500;
          color: #1E293B;
          display: block;
        }
        
        .time {
          font-size: 22rpx;
          color: #64748B;
        }
      }
    }
  }
}

// 区域震动预测样式
.shaking-prediction {
  .confidence-indicator {
    display: flex;
    align-items: center;
    gap: 8rpx;
    
    .confidence-label {
      font-size: 26rpx;
      color: #64748B;
    }
    
    .confidence-value {
      font-size: 26rpx;
      color: #22C55E;
      font-weight: 500;
    }
  }
  
  .prediction-map {
    height: 500rpx;
    position: relative;
    border-radius: 12rpx;
    overflow: hidden;
    
    .map {
      width: 100%;
      height: 100%;
    }
    
    .intensity-legend {
      position: absolute;
      right: 24rpx;
      bottom: 24rpx;
      background: rgba(255, 255, 255, 0.9);
      padding: 16rpx;
      border-radius: 8rpx;
      
      .legend-title {
        font-size: 24rpx;
        color: #64748B;
        margin-bottom: 8rpx;
      }
      
      .intensity-level {
        display: flex;
        align-items: center;
        gap: 8rpx;
        margin-top: 4rpx;
        
        .color-block {
          width: 24rpx;
          height: 24rpx;
          border-radius: 4rpx;
        }
        
        .level-text {
          font-size: 22rpx;
          color: #1E293B;
        }
      }
    }
  }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .seismic-data {
    background: #1A1A1A;
  }
  
  .section {
    background: #262626;
    
    .section-title {
      color: #E5E7EB;
    }
  }
  
  .nav-header {
    .title {
      color: #E5E7EB;
    }
    
    .time-option {
      background: #333333;
      color: #94A3B8;
      
      &.active {
        background: #3B82F6;
        color: #FFFFFF;
      }
    }
  }
  
  .timeline::after {
    background: #374151;
  }
  
  .event-info {
    .magnitude {
      color: #E5E7EB !important;
    }
    
    .time {
      color: #94A3B8 !important;
    }
  }
  
  .intensity-legend {
    background: rgba(38, 38, 38, 0.9) !important;
    
    .legend-title {
      color: #94A3B8 !important;
    }
    
    .level-text {
      color: #E5E7EB !important;
    }
  }
}
</style> 