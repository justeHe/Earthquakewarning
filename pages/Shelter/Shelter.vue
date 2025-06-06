<template>
  <view class="shelter-page">
    <!-- 顶部地图 -->
    <map
      id="shelterMap"
      class="shelter-map"
      :latitude="currentLocation.latitude"
      :longitude="currentLocation.longitude"
      :markers="allMarkers"
      :scale="14"
      show-location
      @markertap="onMarkerTap"
    >
      <!-- 地图图例 -->
      <cover-view class="map-legend">
        <cover-view class="legend-title">图例说明</cover-view>
        <cover-view class="legend-list">
          <cover-view 
            class="legend-item" 
            v-for="item in markerTypes" 
            :key="item.type"
          >
            <cover-image 
              :src="item.icon" 
              class="legend-icon"
              :style="{
                width: '24rpx',
                height: '24rpx'
              }"
            ></cover-image>
            <cover-view class="legend-text">{{ item.label }}</cover-view>
          </cover-view>
        </cover-view>
      </cover-view>
    </map>

    <!-- 位置列表 -->
    <scroll-view 
      class="location-list" 
      scroll-y
      :show-scrollbar="false"
      :enhanced="true"
    >
      <!-- 分类标签 -->
      <view class="type-tabs">
        <view 
          v-for="tab in tabs" 
          :key="tab.value"
          :class="['tab-item', { active: activeTab === tab.value }]"
          @click="activeTab = tab.value"
        >
          <image :src="tab.icon" class="tab-icon"></image>
          <text>{{ tab.label }}</text>
        </view>
      </view>

      <!-- 位置卡片列表 -->
      <view class="location-cards">
        <view 
          v-for="item in filteredLocations" 
          :key="item.id"
          class="location-card"
          @click="showLocationDetail(item)"
        >
          <view class="card-header">
            <view class="location-type" :style="{ background: item.typeBgColor }">
              <image :src="item.typeIcon" class="type-icon"></image>
            </view>
            <view class="header-info">
              <text class="location-name">{{ item.name }}</text>
              <text class="distance">距离: {{ item.distance }}km</text>
            </view>
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
          
          <view class="card-content">
            <view class="info-item">
              <uni-icons type="staff" size="16" color="#666"></uni-icons>
              <text>可容纳: {{ item.capacity }}人</text>
            </view>
            <view class="info-item">
              <uni-icons type="shop" size="16" color="#666"></uni-icons>
              <text>物资情况: {{ item.supplies }}</text>
            </view>
            <view class="info-item">
              <uni-icons type="phone" size="16" color="#666"></uni-icons>
              <text>联系电话: {{ item.contact }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 详情弹窗 -->
    <uni-popup ref="detailPopup" type="bottom">
      <view class="detail-popup">
        <view class="popup-header">
          <text class="popup-title">位置详情</text>
          <view class="close-btn" @click="closeDetail">
            <uni-icons type="close" size="20" color="#666"></uni-icons>
          </view>
        </view>
        
        <scroll-view class="popup-content" scroll-y>
          <template v-if="selectedLocation">
            <view class="detail-header">
              <view class="location-type" :style="{ background: selectedLocation.typeBgColor }">
                <image :src="selectedLocation.typeIcon" class="type-icon"></image>
              </view>
              <view class="header-info">
                <text class="location-name">{{ selectedLocation.name }}</text>
                <text class="distance">距离: {{ selectedLocation.distance }}km</text>
              </view>
            </view>
            
            <view class="detail-section">
              <view class="section-title">基本信息</view>
              <view class="info-grid">
                <view class="info-item">
                  <text class="label">类型</text>
                  <text class="value">{{ selectedLocation.type }}</text>
                </view>
                <view class="info-item">
                  <text class="label">容纳人数</text>
                  <text class="value">{{ selectedLocation.capacity }}人</text>
                </view>
                <view class="info-item">
                  <text class="label">当前人数</text>
                  <text class="value">{{ selectedLocation.currentPeople }}人</text>
                </view>
                <view class="info-item">
                  <text class="label">空置率</text>
                  <text class="value">{{ selectedLocation.vacancyRate }}%</text>
                </view>
              </view>
            </view>
            
            <view class="detail-section">
              <view class="section-title">物资情况</view>
              <view class="supplies-list">
                <view 
                  v-for="supply in selectedLocation.suppliesList" 
                  :key="supply.name"
                  class="supply-item"
                >
                  <view class="supply-header">
                    <text class="supply-name">{{ supply.name }}</text>
                    <text class="supply-status" :class="supply.statusClass">
                      {{ supply.status }}
                    </text>
                  </view>
                  <view class="supply-bar">
                    <view 
                      class="supply-progress" 
                      :style="{ width: supply.percentage + '%', background: supply.color }"
                    ></view>
                  </view>
                </view>
              </view>
            </view>
            
            <view class="detail-section">
              <view class="section-title">联系方式</view>
              <view class="contact-list">
                <view class="contact-item" @click="handleCall(selectedLocation.contact)">
                  <uni-icons type="phone" size="20" color="#2563eb"></uni-icons>
                  <text class="contact-text">{{ selectedLocation.contact }}</text>
                  <text class="contact-label">点击拨打</text>
                </view>
                <view class="contact-item">
                  <uni-icons type="staff" size="20" color="#2563eb"></uni-icons>
                  <text class="contact-text">{{ selectedLocation.manager }}</text>
                  <text class="contact-label">负责人</text>
                </view>
              </view>
            </view>
            
            <view class="detail-section">
              <view class="section-title">到达路线</view>
              <view class="route-info">
                <text class="route-text">{{ selectedLocation.routeInfo }}</text>
                <button class="nav-btn" @click="startNavigation">
                  开始导航
                  <uni-icons type="forward" size="16" color="#fff"></uni-icons>
                </button>
              </view>
            </view>
          </template>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

// 当前位置
const currentLocation = ref({
  latitude: 39.90469,
  longitude: 116.40717
})

// 标记点类型
const markerTypes = [
  { type: 'shelter', label: '避难所', icon: '/static/icons/shelter.svg', color: '#3b82f6', bgColor: '#EFF6FF' },
  { type: 'medical', label: '医疗站', icon: '/static/icons/medical.svg', color: '#10b981', bgColor: '#ECFDF5' },
  { type: 'supplies', label: '物资站', icon: '/static/icons/supplies.svg', color: '#f59e0b', bgColor: '#FEF3C7' }
]

// 标签页
const tabs = [
  { value: 'all', label: '全部', icon: '/static/icons/all.svg' },
  { value: 'shelter', label: '避难所', icon: '/static/icons/shelter.svg' },
  { value: 'medical', label: '医疗站', icon: '/static/icons/medical.svg' },
  { value: 'supplies', label: '物资站', icon: '/static/icons/supplies.svg' }
]

const activeTab = ref('all')

// 模拟位置数据
const locations = ref([
  {
    id: 1,
    type: 'shelter',
    name: '朝阳区应急避难所',
    latitude: 39.90569,
    longitude: 116.40817,
    distance: '0.3',
    capacity: 500,
    currentPeople: 120,
    vacancyRate: 76,
    supplies: '充足',
    contact: '010-12345678',
    manager: '张主任',
    typeColor: '#3b82f6',
    typeBgColor: '#EFF6FF',
    typeIcon: '/static/icons/shelter.svg',
    routeInfo: '从当前位置向东200米，右转进入幸福小区，避难所位于小区东南角',
    suppliesList: [
      { name: '饮用水', status: '充足', percentage: 85, color: '#3b82f6', statusClass: 'status-good' },
      { name: '食品', status: '充足', percentage: 80, color: '#3b82f6', statusClass: 'status-good' },
      { name: '医疗用品', status: '中等', percentage: 60, color: '#f59e0b', statusClass: 'status-medium' },
      { name: '帐篷', status: '充足', percentage: 90, color: '#3b82f6', statusClass: 'status-good' }
    ]
  },
  {
    id: 2,
    type: 'medical',
    name: '朝阳区第一医疗站',
    latitude: 39.90669,
    longitude: 116.40917,
    distance: '0.5',
    capacity: 200,
    currentPeople: 45,
    vacancyRate: 77.5,
    supplies: '充足',
    contact: '010-12345679',
    manager: '李医生',
    typeColor: '#10b981',
    typeBgColor: '#ECFDF5',
    typeIcon: '/static/icons/medical.svg',
    routeInfo: '从当前位置向北300米，左转进入医院大门，医疗站位于急诊部一层',
    suppliesList: [
      { name: '医疗器械', status: '充足', percentage: 90, color: '#3b82f6', statusClass: 'status-good' },
      { name: '药品', status: '充足', percentage: 85, color: '#3b82f6', statusClass: 'status-good' },
      { name: '防护用品', status: '中等', percentage: 65, color: '#f59e0b', statusClass: 'status-medium' }
    ]
  },
  {
    id: 3,
    type: 'supplies',
    name: '朝阳区物资储备站',
    latitude: 39.90369,
    longitude: 116.40617,
    distance: '0.4',
    capacity: 1000,
    currentPeople: 80,
    vacancyRate: 92,
    supplies: '充足',
    contact: '010-12345680',
    manager: '王站长',
    typeColor: '#f59e0b',
    typeBgColor: '#FEF3C7',
    typeIcon: '/static/icons/supplies.svg',
    routeInfo: '从当前位置向西400米，物资站位于体育场旁',
    suppliesList: [
      { name: '食品', status: '充足', percentage: 95, color: '#3b82f6', statusClass: 'status-good' },
      { name: '饮用水', status: '充足', percentage: 90, color: '#3b82f6', statusClass: 'status-good' },
      { name: '生活用品', status: '充足', percentage: 85, color: '#3b82f6', statusClass: 'status-good' },
      { name: '帐篷', status: '中等', percentage: 70, color: '#f59e0b', statusClass: 'status-medium' }
    ]
  }
])

// 计算所有标记点
const allMarkers = computed(() => {
  return locations.value.map(location => ({
    id: location.id,
    latitude: location.latitude,
    longitude: location.longitude,
    iconPath: location.typeIcon,
    width: 32,
    height: 32,
    callout: {
      content: `${location.name}\n距离: ${location.distance}km`,
      color: '#ffffff',
      fontSize: 12,
      borderRadius: 4,
      padding: 8,
      bgColor: location.typeColor,
      display: 'BYCLICK',
      textAlign: 'center',
      anchorY: -60
    }
  }))
})

// 根据选中的标签筛选位置
const filteredLocations = computed(() => {
  if (activeTab.value === 'all') {
    return locations.value
  }
  return locations.value.filter(location => location.type === activeTab.value)
})

// 选中的位置
const selectedLocation = ref(null)
const detailPopup = ref(null)

// 显示位置详情
const showLocationDetail = (location) => {
  selectedLocation.value = location
  detailPopup.value.open()
}

// 关闭详情
const closeDetail = () => {
  detailPopup.value.close()
}

// 标记点点击事件
const onMarkerTap = (e) => {
  const location = locations.value.find(loc => loc.id === e.detail.markerId)
  if (location) {
    showLocationDetail(location)
  }
}

// 拨打电话
const handleCall = (number) => {
  uni.makePhoneCall({
    phoneNumber: number,
    success: () => {
      uni.vibrateShort({ type: 'heavy' })
    },
    fail: () => {
      uni.showToast({
        title: '呼叫失败，请检查网络',
        icon: 'none'
      })
    }
  })
}

// 开始导航
const startNavigation = () => {
  if (!selectedLocation.value) return
  
  uni.openLocation({
    latitude: selectedLocation.value.latitude,
    longitude: selectedLocation.value.longitude,
    name: selectedLocation.value.name,
    address: selectedLocation.value.routeInfo,
    success: () => {
      uni.showToast({
        title: '正在打开导航',
        icon: 'success'
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.shelter-page {
  min-height: 100vh;
  background: #f8f9fa;
  position: relative;
}

.shelter-map {
  width: 100%;
  height: 45vh;
}

.map-legend {
  position: absolute;
  top: 24rpx;
  left: 24rpx;
  background: rgba(255, 255, 255, 0.95);
  padding: 16rpx 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  min-width: 180rpx;
  z-index: 100;
}

.legend-title {
  font-size: 24rpx;
  color: #475569;
  margin-bottom: 12rpx;
  padding-bottom: 8rpx;
  border-bottom: 2rpx solid rgba(0, 0, 0, 0.05);
}

.legend-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  padding: 4rpx 0;
  height: 40rpx;
}

.legend-icon {
  flex-shrink: 0;
  margin-right: 12rpx;
  display: block;
}

.legend-text {
  font-size: 24rpx;
  color: #1e293b;
  line-height: 32rpx;
}

.location-list {
  height: calc(55vh - 120rpx);
  background: #ffffff;
  border-radius: 32rpx 32rpx 0 0;
  margin-top: -20rpx;
  padding: 32rpx;
  position: relative;
  z-index: 1;
}

.type-tabs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32rpx;
  padding: 0 16rpx;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  .tab-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 16rpx;
    margin-right: 24rpx;
    min-width: 140rpx;
    border-radius: 12rpx;
    flex-shrink: 0;
    transition: all 0.3s ease;
    
    &:last-child {
      margin-right: 0;
    }
    
    &.active {
      background: #f0f9ff;
      
      text {
        color: #3b82f6;
      }
    }
    
    .tab-icon {
      width: 48rpx;
      height: 48rpx;
      margin-bottom: 8rpx;
    }
    
    text {
      font-size: 24rpx;
      color: #666;
      white-space: nowrap;
    }
  }
}

.location-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.location-type {
  width: 56rpx;
  height: 56rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  background: v-bind('selectedLocation ? selectedLocation.typeBgColor : "#f8fafc"');
  
  .type-icon {
    width: 36rpx;
    height: 36rpx;
  }
}

.header-info {
  flex: 1;
  
  .location-name {
    font-size: 32rpx;
    font-weight: 600;
    color: #1e293b;
    display: block;
    margin-bottom: 4rpx;
  }
  
  .distance {
    font-size: 24rpx;
    color: #64748b;
    display: flex;
    align-items: center;
    
    &::before {
      content: '';
      display: inline-block;
      width: 8rpx;
      height: 8rpx;
      background: #64748b;
      border-radius: 50%;
      margin-right: 8rpx;
    }
  }
}

.card-content {
  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
    padding: 12rpx 16rpx;
    background: rgba(59, 130, 246, 0.05);
    border-radius: 8rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .uni-icons {
      margin-right: 12rpx;
      color: #3b82f6;
    }
    
    text {
      font-size: 26rpx;
      color: #1e293b;
    }
  }
}

.detail-popup {
  background: #ffffff;
  border-radius: 32rpx 32rpx 0 0;
  padding: 32rpx;
  max-height: 80vh;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.popup-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1e293b;
}

.close-btn {
  padding: 12rpx;
  
  &:active {
    opacity: 0.7;
  }
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 32rpx;
}

.detail-section {
  margin-bottom: 32rpx;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16rpx;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  
  .info-item {
    background: #f8fafc;
    padding: 16rpx;
    border-radius: 12rpx;
    
    .label {
      font-size: 24rpx;
      color: #64748b;
      display: block;
    }
    
    .value {
      font-size: 28rpx;
      color: #1e293b;
      font-weight: 500;
      margin-top: 4rpx;
      display: block;
    }
  }
}

.supplies-list {
  .supply-item {
    margin-bottom: 16rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.supply-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.supply-name {
  font-size: 26rpx;
  color: #1e293b;
}

.supply-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  
  &.status-good {
    background: #dcfce7;
    color: #16a34a;
  }
  
  &.status-medium {
    background: #fef3c7;
    color: #d97706;
  }
  
  &.status-low {
    background: #fee2e2;
    color: #dc2626;
  }
}

.supply-bar {
  height: 12rpx;
  background: #f1f5f9;
  border-radius: 6rpx;
  overflow: hidden;
}

.supply-progress {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

.contact-list {
  .contact-item {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background: #f8fafc;
    border-radius: 12rpx;
    margin-bottom: 16rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &:active {
      opacity: 0.7;
    }
    
    .uni-icons {
      margin-right: 12rpx;
    }
    
    .contact-text {
      flex: 1;
      font-size: 28rpx;
      color: #1e293b;
    }
    
    .contact-label {
      font-size: 24rpx;
      color: #64748b;
      margin-left: 12rpx;
    }
  }
}

.route-info {
  background: #f8fafc;
  padding: 20rpx;
  border-radius: 12rpx;
  
  .route-text {
    font-size: 26rpx;
    color: #1e293b;
    line-height: 1.6;
    margin-bottom: 16rpx;
    display: block;
  }
}

.nav-btn {
  background: #3b82f6;
  color: #ffffff;
  font-size: 28rpx;
  padding: 16rpx 32rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  
  .uni-icons {
    margin-left: 8rpx;
  }
  
  &:active {
    opacity: 0.9;
  }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .shelter-page {
    background: #1a1a1a;
  }
  
  .location-list,
  .detail-popup {
    background: #262626;
  }
  
  .location-card {
    background: #333333;
    border-color: rgba(255, 255, 255, 0.1);
  }
  
  .card-header {
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }
  
  .header-info {
    .location-name {
      color: #e5e7eb;
    }
    
    .distance {
      color: #9ca3af;
      
      &::before {
        background: #9ca3af;
      }
    }
  }
  
  .card-content {
    .info-item {
      background: rgba(59, 130, 246, 0.1);
      
      text {
        color: #e5e7eb;
      }
    }
  }
  
  .contact-item,
  .route-info {
    background: #333333;
  }
  
  .contact-text,
  .route-text {
    color: #e5e7eb;
  }
  
  .location-type {
    background: rgba(255, 255, 255, 0.1) !important;
  }
  
  .map-legend {
    background: rgba(38, 38, 38, 0.95);
    
    .legend-title {
      color: #94a3b8;
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }
    
    .legend-text {
      color: #e5e7eb;
    }
  }
}
</style> 