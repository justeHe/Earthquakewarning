<template>
  <div class="alert-tab">
    <!-- 安全状态提示 -->
    <div :class="['alert-status', alertStatus]">
      <i :class="alertIcon" class="alert-icon"></i>
      <h3 class="alert-title">{{ alertTitle }}</h3>
      <p class="alert-message">{{ alertMessage }}</p>
    </div>
    
    <!-- 位置信息 -->
    <div class="location-info">
      <i class="fas fa-map-marker-alt location-icon"></i>
      <div class="location-text">
        <div class="location-name">当前位置</div>
        <div class="location-address">{{ location }}</div>
      </div>
      <button class="refresh-btn" @click="refreshLocation" :disabled="isRefreshing">
        <i class="fas" :class="isRefreshing ? 'fa-spinner fa-pulse' : 'fa-sync-alt'"></i>
      </button>
    </div>


    <view class="map-container">
      <map
        id="wx-map"
        :latitude="latitude"
        :longitude="longitude"
        :markers="markers"
        :show-location="true"
        style="width:100%;height:300px;"
        @tap="handleMapTap"
      ></map>
      <button @tap="openAmap" class="amap-button" v-if="canOpenAmap">
        <image src="/static/amap-logo.png" mode="aspectFit" class="amap-logo"></image>
        在高德地图中查看
      </button>
    </view>
    
    <!-- 地震信息 -->
    <h3 class="quake-title">周边地震</h3>
    <div class="quake-card" v-for="quake in quakes" :key="quake.id">
      <div class="quake-header">
        <div class="quake-magnitude">{{ quake.magnitude }}</div>
        <div class="quake-time">{{ quake.time }}</div>
      </div>
      <div class="quake-details">
        <div class="quake-distance">距离: {{ quake.distance }}</div>
        <div class="quake-depth">深度: {{ quake.depth }}</div>
      </div>
      <div class="quake-warning">
        <i class="fas fa-exclamation-triangle warning-icon"></i>
        <div>{{ quake.warning }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 公共状态
const alertStatus = ref('safe')
const alertIcon = ref('fas fa-check-circle')
const alertTitle = ref('当前安全')
const alertMessage = ref('您所在区域当前无地震威胁')
const location = ref('正在获取位置...')
const isRefreshing = ref(false)
const quakes = ref([
  { id: 1, magnitude: 'M4.2', time: '2023-05-15 08:23', distance: '85km', depth: '10km', warning: '不会对您所在区域造成明显影响' },
  { id: 2, magnitude: 'M5.8', time: '2023-05-12 14:37', distance: '120km', depth: '15km', warning: '部分地区有震感' }
])


// 小程序地图相关
const latitude = ref(39.90469)
const longitude = ref(116.40717)
const markers = ref([{
  id: 1,
  width: 30,
  height: 30
}])
const canOpenAmap = ref(false)

// 检查是否安装高德地图
function checkAmapInstalled() {
  wx.getSetting({
    success(res) {
      canOpenAmap.value = res.authSetting['scope.werun'] || false
    }
  })
}

// 使用高德API获取位置
function getAmapLocation() {
  wx.request({
    url: 'https://restapi.amap.com/v3/ip',
    data: {
      key: '3ceccd136aabe918552f561c13f20691',
      output: 'JSON'
    },
    success: (res) => {
      if (res.data.status === '1') {
        const { rectangle } = res.data
        const coords = rectangle.split(';')[0].split(',')
        longitude.value = parseFloat(coords[0])
        latitude.value = parseFloat(coords[1])
        updateAmapMarker()
        getAmapAddress(longitude.value, latitude.value)
      } else {
        getWxLocationAsFallback()
      }
    },
    fail: () => {
      getWxLocationAsFallback()
    }
  })
}
       
function getAmapAddress(lng, lat) {
  wx.request({
    url: 'https://restapi.amap.com/v3/geocode/regeo',
    data: {
      key: '3ceccd136aabe918552f561c13f20691',
      location: `${lng},${lat}`,
      radius: 1000,
      extensions: 'base',
      output: 'JSON'
    },
    success: (res) => {
      if (res.data.status === '1') {
        location.value = res.data.regeocode.formatted_address || 
                       `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      } else {
        location.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      }
    },
    fail: () => {
      location.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    }
  })
}

// 更新地图标记
function updateAmapMarker() {
  markers.value = [{
    id: 1,
    latitude: latitude.value,
    longitude: longitude.value,
    // iconPath: '/static/location.png',
    width: 30,
    height: 30,
    callout: {
      content: '我的位置',
      color: '#ffffff',
      bgColor: '#1890ff',
      padding: 5,
      borderRadius: 4,
      display: 'ALWAYS'
    }
  }]
}

// 微信定位作为备用
function getWxLocationAsFallback() {
  wx.getLocation({
    type: 'gcj02',
    success: (res) => {
      longitude.value = res.longitude
      latitude.value = res.latitude
      updateAmapMarker()
      getAmapAddress(res.longitude, res.latitude)
    }
  })
}

// 打开高德地图
function openAmap() {
  wx.navigateToMiniProgram({
    appId: 'wx9f4d9a2e9b9d9b9d', // 高德地图小程序appid
    path: `pages/map/map?location=${latitude.value},${longitude.value}&name=我的位置`,
    success: () => console.log('跳转成功'),
    fail: (err) => console.error('跳转失败:', err)
  })
}

function handleMapTap(e) {
  console.log('地图点击:', e)
}


onMounted(() => {
  
  getAmapLocation()
})
</script>

<style scoped>
/* 公共样式 */
.alert-tab {
  padding: 15px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* 警报状态样式 */
.alert-status {
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}
.alert-status.safe {
  background-color: #e6f7ff;
  border: 2px solid #27ae60;
}
.alert-status.warning {
  background-color: #fffbe6;
  border: 2px solid #f39c12;
  animation: alert-pulse 1.5s infinite;
}
.alert-status.danger {
  background-color: #ffe6e6;
  border: 2px solid #e74c3c;
  animation: alert-pulse 0.8s infinite;
}

@keyframes alert-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

.alert-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}
.alert-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}
.alert-message {
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* 位置信息样式 */
.location-info {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}
.location-info:hover {
  transform: translateY(-2px);
}

.location-icon {
  color: #3498db;
  font-size: 1.5rem;
  margin-right: 15px;
}

.location-text {
  flex: 1;
}
.location-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
  margin-bottom: 5px;
}
.location-address {
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.3;
}

.refresh-btn {
  background: none;
  border: none;
  padding: 8px;
  margin-left: 10px;
  border-radius: 50%;
  transition: all 0.3s ease;
}
.refresh-btn:not(:disabled):hover {
  background: #f0f2f5;
  transform: rotate(360deg);
}
.refresh-btn i {
  font-size: 1.2rem;
  color: #3498db;
}

/* 地震信息样式 */
.quake-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 25px 0 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eee;
}

.quake-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}
.quake-card:hover {
  transform: translateY(-3px);
}

.quake-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.quake-magnitude {
  font-weight: 700;
  font-size: 1.3rem;
  color: #e74c3c;
}
.quake-time {
  color: #7f8c8d;
  font-size: 0.85rem;
}

.quake-details {
  display: flex;
  gap: 15px;
  margin-bottom: 12px;
  font-size: 0.9rem;
}
.quake-distance, .quake-depth {
  color: #34495e;
}
.quake-distance::before {
  content: '📍';
  margin-right: 5px;
}
.quake-depth::before {
  content: '⏚';
  margin-right: 5px;
}

.quake-warning {
  display: flex;
  align-items: center;
  color: #f39c12;
  font-size: 0.9rem;
  padding: 8px 12px;
  background: #fffbe6;
  border-radius: 6px;
}
.warning-icon {
  margin-right: 8px;
  font-size: 1.1rem;
}

/* 加载和错误状态 */
.map-loading, .map-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}
.map-loading i {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #3498db;
}
.map-error {
  color: #e74c3c;
}
.map-error i {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .alert-tab {
    padding: 10px;
  }
  
  .alert-status {
    padding: 15px;
  }
  
  .location-info {
    padding: 12px;
  }
  
  .quake-title {
    font-size: 1.1rem;
  }
}
</style>