<template>
  <view class="map-container">
    <!-- 返回按钮 -->
    <view class="back-btn" @tap="goBack">
      <text class="back-icon">←</text>
      <text class="back-text">返回</text>
    </view>

    <map
      id="earthquakeMap"
      :latitude="centerLatitude"
      :longitude="centerLongitude"
      :markers="[...markers, myLocationMarker]"
      :circles="circles"
      :scale="scale"
      style="width: 100%; height: 100vh;"
      @markertap="onMarkerTap"
      show-location
    >
      <!-- 地图控制按钮 -->
      <view class="map-controls">
        <view class="control-btn" @tap="zoomIn">
          <text>+</text>
        </view>
        <view class="control-btn" @tap="zoomOut">
          <text>-</text>
        </view>
        <view class="location-btn" @tap="backToMyLocation">
          <text>定位</text>
        </view>
      </view>
    </map>
    
    <!-- 地震信息弹窗 -->
    <view class="quake-info" v-if="selectedQuake">
      <view class="info-header">
        <view class="title-section">
          <text class="magnitude" :style="{ color: getColorByMagnitude(selectedQuake.magnitude) }">
            {{ selectedQuake.magnitude }}
          </text>
          <text class="title">{{ selectedQuake.title }}</text>
        </view>
        <text class="close" @tap="selectedQuake = null">×</text>
      </view>
      <view class="info-content">
        <view class="info-row">
          <text class="label">深度：</text>
          <text class="value">{{ selectedQuake.depth }}km</text>
        </view>
        <view class="info-row">
          <text class="label">时间：</text>
          <text class="value">{{ selectedQuake.time }}</text>
        </view>
        <view class="info-row">
          <text class="label">烈度：</text>
          <text class="value">{{ selectedQuake.intensity }}</text>
        </view>
        <view class="info-row">
          <text class="label">状态：</text>
          <text class="value" :class="selectedQuake.type">{{ selectedQuake.status }}</text>
        </view>
        <view class="info-row coordinates">
          <text class="label">坐标：</text>
          <text class="value">{{ selectedQuake.latitude }}°N, {{ selectedQuake.longitude }}°E</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const centerLatitude = ref(35.0)
const centerLongitude = ref(105.0)
const scale = ref(5)
const markers = ref([])
const circles = ref([])
const selectedQuake = ref(null)
let markerFlashInterval = null

// 我的位置标记
const myLocationMarker = computed(() => ({
  id: 'my-location',
  latitude: centerLatitude.value,
  longitude: centerLongitude.value,
  width: 24,
  height: 24,
  iconPath: '/static/icons/location-pin.svg',
  anchor: { x: 0.5, y: 1 },
  callout: {
    content: '当前位置',
    color: '#FFFFFF',
    fontSize: 12,
    borderRadius: 4,
    padding: 4,
    bgColor: '#3B82F6',
    display: 'ALWAYS'
  }
}))

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 从历史数据创建标记和圆圈
const createMarkersAndCircles = (quakes) => {
  const newMarkers = []
  const newCircles = []
  
  quakes.forEach((quake, index) => {
    if (!quake.latitude || !quake.longitude) return
    
    // 创建标记
    newMarkers.push({
      id: index,
      latitude: quake.latitude,
      longitude: quake.longitude,
      width: 12,
      height: 12,
      iconPath: '/static/icons/earthquake.svg',
      anchor: { x: 0.5, y: 0.5 },
      callout: {
        content: `${quake.magnitude}级`,
        color: '#FFFFFF',
        fontSize: 10,
        borderRadius: 4,
        padding: 4,
        bgColor: getColorByMagnitude(quake.magnitude),
        display: 'ALWAYS'
      }
    })
    
    // 创建圆圈
    newCircles.push({
      latitude: quake.latitude,
      longitude: quake.longitude,
      color: getColorByMagnitude(quake.magnitude, 0.2),
      fillColor: getColorByMagnitude(quake.magnitude, 0.1),
      radius: getMagnitudeRadius(quake.magnitude),
      strokeWidth: 1
    })
  })
  
  markers.value = newMarkers
  circles.value = newCircles
}

// 根据震级获取颜色
const getColorByMagnitude = (magnitude, alpha = 1) => {
  const mag = Number.parseFloat(magnitude)
  let color
  if (mag < 3.5) color = [74, 222, 128] // 绿色
  else if (mag < 4.5) color = [250, 204, 21] // 黄色
  else if (mag < 6) color = [251, 146, 60] // 橙色
  else if (mag < 7) color = [248, 113, 113] // 红色
  else color = [220, 38, 38] // 深红色
  
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`
}

// 根据震级获取圆圈半径（单位：米）
const getMagnitudeRadius = (magnitude) => {
  const mag = Number.parseFloat(magnitude)
  return 2 ** mag * 1000 // 指数增长
}

// 标记闪烁效果
const startMarkerFlash = () => {
  let visible = true
  markerFlashInterval = setInterval(() => {
    markers.value = markers.value.map(marker => ({
      ...marker,
      alpha: visible ? 1 : 0.3
    }))
    visible = !visible
  }, 1000)
}

// 处理标记点击
const onMarkerTap = (e) => {
  if (e.detail.markerId === 'my-location') return
  
  const historyData = uni.getStorageSync('earthquakeHistory')
  if (historyData) {
    selectedQuake.value = historyData[e.detail.markerId]
    // 移动到地震位置
    centerLatitude.value = selectedQuake.value.latitude
    centerLongitude.value = selectedQuake.value.longitude
    scale.value = 8
  }
}

// 缩放控制
const zoomIn = () => {
  if (scale.value < 14) scale.value++
}

const zoomOut = () => {
  if (scale.value > 4) scale.value--
}

// 返回当前位置
const backToMyLocation = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      centerLatitude.value = res.latitude
      centerLongitude.value = res.longitude
      scale.value = 8
    },
    fail: () => {
      uni.showToast({
        title: '无法获取位置',
        icon: 'none'
      })
    }
  })
}

onMounted(() => {
  // 获取历史数据
  const historyData = uni.getStorageSync('earthquakeHistory')
  if (historyData) {
    createMarkersAndCircles(historyData)
    startMarkerFlash()
  }
  
  // 获取当前位置
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      centerLatitude.value = res.latitude
      centerLongitude.value = res.longitude
      scale.value = 8
    },
    fail: () => {
      uni.showToast({
        title: '无法获取位置',
        icon: 'none'
      })
    }
  })
})

onUnmounted(() => {
  if (markerFlashInterval) {
    clearInterval(markerFlashInterval)
  }
})
</script>

<style scoped>
.back-btn {
  position: absolute;
  top: 40px;
  left: 16px;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-icon {
  font-size: 20px;
  color: #333;
}

.back-text {
  font-size: 14px;
  color: #333;
}

.map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.map-controls {
  position: absolute;
  right: 20rpx;
  bottom: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.control-btn, .location-btn {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.control-btn text {
  font-size: 40rpx;
  color: #333;
}

.location-btn {
  width: auto;
  padding: 0 20rpx;
}

.quake-info {
  position: absolute;
  bottom: 40rpx;
  left: 20rpx;
  right: 120rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}

.title-section {
  flex: 1;
  margin-right: 16rpx;
}

.magnitude {
  font-size: 40rpx;
  font-weight: bold;
  margin-right: 12rpx;
}

.title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.close {
  font-size: 40rpx;
  color: #666;
  padding: 0 10rpx;
  line-height: 1;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.info-row {
  display: flex;
  align-items: center;
}

.label {
  color: #666;
  width: 120rpx;
  font-size: 24rpx;
}

.value {
  color: #333;
  flex: 1;
  font-size: 24rpx;
}

.value.automatic {
  color: #f97316;
}

.value.reviewed {
  color: #22c55e;
}

.coordinates {
  margin-top: 8rpx;
  padding-top: 8rpx;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
</style> 