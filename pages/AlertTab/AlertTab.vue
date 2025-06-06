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
      ></map>
      <!-- 地图控制按钮 -->
      <view class="map-controls">
        <view 
          class="location-btn" 
          :class="{ 'is-loading': isUpdatingLocation }" 
          hover-class="button-hover"
          hover-stay-time="100"
          @tap="backToMyLocation"
        >
          <text class="location-text">我的位置</text>
        </view>
      </view>
    </view>
    
    <!-- 地震信息 -->
    <h3 class="quake-title">
      周边地震
      <view class="data-analysis-btn" @tap="goToSeismicData">
        <text class="btn-text">数据分析</text>
        <text class="btn-icon">📊</text>
      </view>
    </h3>
    <div 
      class="quake-card" 
      v-for="quake in quakes" 
      :key="quake.id"
      @click="moveToQuake(quake)"
    >
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
      <div class="quake-coords">
        经纬度: {{ quake.latitude.toFixed(4) }}, {{ quake.longitude.toFixed(4) }}
        <view class="view-details-wrapper" @click.stop="goToEarthquakeMap">
          <text class="view-details">查看详情</text>
        </view>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AMapWX from "../../lib/amap-wx.130.js"
const amapFile = require('./lib/amap-wx.130.js')


// 公共状态
const alertStatus = ref('safe')
const mapKey = '3ceccd136aabe918552f561c13f20691'
const alertIcon = ref('fas fa-check-circle')
const alertTitle = ref('当前安全')
const alertMessage = ref('您所在区域当前无地震威胁')
const location = ref('正在获取位置...')
const isRefreshing = ref(false)

const quakes = ref([
  { id: 1, magnitude: 'M4.2', time: '2025-05-15 08:23', distance: '85km', depth: '10km', warning: '无明显震感',latitude: 30,
    longitude: 120},
  { id: 2, magnitude: 'M5.8', time: '2025-05-12 14:37', distance: '120km', depth: '15km', warning: '部分地区有震感', latitude: 39.9040,
    longitude: 116.4071 }
])



// 小程序地图相关
const latitude = ref(39.90469)
const longitude = ref(116.40717)
const markers = ref([])

// 用户实际位置
const myLatitude = ref(39.90469)
const myLongitude = ref(116.40717)

const processRegeoData = (data) => {
  const regeocodeData = data.regeocodeData || {};
  return {
    name: data[0].name || "无",
    desc: data[0].desc || "无",
    longitude: Number.parseFloat(data[0].longitude) || 0,
    latitude: Number.parseFloat(data[0].latitude) || 0
  };
}

const getAddress = async () => {
  const myAmapFun = new amapFile.AMapWX({ key: mapKey });
  
  try {
    const [err, data] = await new Promise(resolve => {
      myAmapFun.getRegeo({
        success: res => resolve([null, res]),
        fail: err => resolve([err, null])
      });
    });

    if (err) {
      throw new Error(err.errMsg || '逆地理编码请求失败');
    }

    if (!data || typeof data !== 'object') {
      throw new Error('无效的逆地理编码响应格式');
    }

    const processedData = processRegeoData(data);

    
    console.log('处理后的结构化数据:', processedData);
    return processedData;
    
  } catch (err) {
    console.error('地址解析错误:', err.message);
    throw err; // 向上传递错误或在此处理
  }
};



// 更新地图标记
const updateMarkers = (activeId = null) => {
  if (activeId) {
    // 查看地震位置时只显示该地震点
    const quake = quakes.value.find(q => q.id === activeId)
    if (quake) {
      markers.value = [{
        id: quake.id,
        latitude: quake.latitude,
        longitude: quake.longitude,
        width: 40,
        height: 40,
        callout: {
          content: `${quake.magnitude} ${quake.distance}\n${quake.warning}`,
          color: '#ffffff',
          bgColor: '#1890ff',
          padding: 5,
          borderRadius: 4,
          display: 'ALWAYS'
        }
      }]
    }
  } else {
    // 正常显示所有点
    markers.value = [
      {
        id: 0,
        latitude: myLatitude.value,
        longitude: myLongitude.value,
        width: 30,
        height: 30,
        callout: {
          content: '当前位置',
          color: '#ffffff',
          bgColor: '#1890ff',
          padding: 5,
          borderRadius: 4,
          display: 'ALWAYS'
        }
      },
      ...quakes.value.map(quake => ({
        id: quake.id,
        latitude: quake.latitude,
        longitude: quake.longitude,
        width: 30,
        height: 30,
        callout: {
          content: `${quake.magnitude} ${quake.distance}\n${quake.warning}`,
          color: '#ffffff',
          bgColor: '#ff4d4f',
          padding: 5,
          borderRadius: 4,
          display: 'ALWAYS'
        }
      }))
    ]
  }
}

// 移动到地震位置
const moveToQuake = (quake) => {
  console.log('点击地震卡片:', quake)
  isViewingQuake.value = true
  // 更新地图视图中心点
  latitude.value = quake.latitude
  longitude.value = quake.longitude
  // 更新标记点，只显示选中的地震点
  updateMarkers(quake.id)
}

// 是否正在更新位置
const isUpdatingLocation = ref(false)

// 获取位置并更新
const getWxLocationAsFallback = () => {
  isUpdatingLocation.value = true
  wx.getLocation({
    type: 'gcj02',
    success: (res) => {
      console.log('获取位置成功:', res)
      myLongitude.value = res.longitude
      myLatitude.value = res.latitude
      if (!isViewingQuake.value) {
        longitude.value = res.longitude
        latitude.value = res.latitude
      }
      updateMarkers()
      getAddress()
        .then(data => {
          location.value = data.name
        })
        .catch(err => console.error('获取地址失败:', err.message))
    },
    fail: (err) => {
      console.error('获取位置失败:', err)
      uni.showToast({
        title: '获取位置失败',
        icon: 'none'
      })
    },
    complete: () => {
      isUpdatingLocation.value = false
    }
  })
}

// 回到当前位置
const backToMyLocation = () => {
  isViewingQuake.value = false
  // 更新到用户当前位置
  latitude.value = myLatitude.value
  longitude.value = myLongitude.value
  // 更新标记，显示所有点
  updateMarkers()
  // 重新获取一次位置
  getWxLocationAsFallback()
}

// 是否正在查看地震位置
const isViewingQuake = ref(false)

// 跳转到地震地图页面
const goToEarthquakeMap = () => {
  // 保存地震历史数据
  uni.setStorageSync('earthquakeHistory', quakes.value)
  
  // 跳转到地图页面
  uni.navigateTo({
    url: '/pages/EarthquakeMap/EarthquakeMap'
  })
}

// 跳转到地震数据分析页面
const goToSeismicData = () => {
  uni.navigateTo({
    url: '/pages/SeismicData/SeismicData',
    success: () => {
      console.log('成功跳转到数据分析页面')
    },
    fail: (err) => {
      console.error('跳转失败:', err)
      uni.showToast({
        title: '页面跳转失败',
        icon: 'none'
      })
    }
  })
}

onMounted(() => {
  console.log('初始化地图组件')
  getWxLocationAsFallback()
  updateMarkers()
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
  font-size: 14px;
  color: #1565C0;
  font-weight: 500;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.data-analysis-btn {
  display: flex;
  align-items: center;
  background: #3B82F6;
  padding: 6rpx 16rpx;
  border-radius: 24rpx;
  gap: 8rpx;
}

.btn-text {
  color: #FFFFFF;
  font-size: 24rpx;
  font-weight: normal;
}

.btn-icon {
  font-size: 24rpx;
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
  color: #C41E3A;
}
.quake-time {
  color: #4B5563;
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
  color: #B45309;
  font-size: 0.9rem;
  padding: 8px 12px;
  background: #FEF3C7;
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

.map-container {
  position: relative;
  width: 100%;
  height: 300px;
}

.map-controls {
  position: absolute;
  right: 16px;
  bottom: 16px;
}

.location-btn {
  min-width: 56px;
  height: 32px;
  background-color: #FFFFFF;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 12px;
}

.location-btn.is-loading {
  opacity: 0.7;
}

.location-text {
  font-size: 14px;
  color: #1565C0;
  font-weight: 500;
}

.button-hover {
  background-color: #F5F5F5;
  opacity: 0.8;
}

.quake-coords {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
  color: #64748B;
  margin-top: 16rpx;
}

.view-details-wrapper {
  padding: 16rpx;
  margin: -16rpx;
}

.view-details {
  color: #1E40AF;
  font-size: 24rpx;
}

/* 暗黑模式下的颜色调整 */
@media (prefers-color-scheme: dark) {
  .location-text {
    color: #60A5FA;
  }
  
  .quake-magnitude {
    color: #F87171;
  }
  
  .quake-time {
    color: #9CA3AF;
  }
  
  .quake-warning {
    color: #FCD34D;
    background: rgba(254, 243, 199, 0.1);
  }
  
  .view-details {
    color: #60A5FA;
  }
}
</style>