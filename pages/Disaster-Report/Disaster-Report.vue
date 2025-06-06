<template>
  <view class="report-page">
    <!-- 地图可视化 -->
    <view class="map-section">
      <map
        id="impact-map"
        :latitude="mapCenter.latitude"
        :longitude="mapCenter.longitude"
        :markers="impactMarkers"
        :polyline="impactAreas"
        style="width: 100%; height: 480rpx;"
        @markertap="handleMarkerTap"
      >
        <!-- <cover-view class="map-toolbar">
          <cover-button class="map-btn" @tap="openHeatmap">
            <image src="/static/icons/fire.svg" class="btn-icon" />
            热力图
          </cover-button>
          <cover-button class="map-btn" @tap="switchLayer">
            <image src="/static/icons/layers.svg" class="btn-icon" />
            地形图
          </cover-button>
        </cover-view> -->
      </map>
    </view>

    <!-- 数据看板 -->
    <view class="dashboard">
      <view 
        class="stats-card"
        v-for="stat in stats"
        :key="stat.id"
		:style="{ transform: `scale(${cardScale})` }"
        @touchstart="handleCardTouch"
        @touchend="handleCardTouchEnd"
      >
        <view class="card-glow"></view>
        <image :src="stat.icon" class="stat-icon" />
        <view class="stat-content">
          <text class="value">{{ stat.value }}</text>
          <text class="label">{{ stat.label }}</text>
        </view>
      </view>
    </view>

    <!-- 照片证据 -->
    <view class="section photo-section">
      <view class="section-header">
        <text class="title">现场影像</text>
        <view class="badge">
          <text class="badge-text">{{ photos.length }}份资料</text>
        </view>
      </view>
      <scroll-view scroll-x class="photo-scroll" show-scrollbar="false">
        <view 
          v-for="(photo, index) in photos" 
          :key="index"
          class="photo-item"
          @tap="previewImage(index)"
        >
          <image 
            :src="photo.url" 
            mode="aspectFill" 
            class="photo-image"
            :lazy-load="true"
          />
          <view class="photo-overlay">
            <image src="/static/icons/location.svg" class="location-icon" />
            <text class="photo-caption">{{ photo.location }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 时间线更新 -->
    <view class="section timeline-section">
      <view class="section-header">
        <text class="title">恢复进展</text>
        <text class="update-time">{{ lastUpdate }}</text>
      </view>
      <view class="timeline">
        <view 
          v-for="(item, index) in timeline" 
          :key="index"
          class="timeline-item"
        >
          <view class="timeline-marker">
            <view class="pulse"></view>
          </view>
          <view class="timeline-content">
            <view class="timeline-header">
              <text class="date">{{ item.date }}</text>
              <text class="title">{{ item.title }}</text>
            </view>
            <text class="description">{{ item.description }}</text>
            <scroll-view v-if="item.images" scroll-x class="timeline-images">
              <image 
                v-for="(img, i) in item.images" 
                :key="i"
                :src="img" 
                mode="aspectFill"
                class="timeline-image"
              />
            </scroll-view>
          </view>
        </view>
      </view>
    </view>

    <!-- 讨论区 -->
    <view class="section discussion-section">
      <view class="section-header">
        <text class="title">讨论区</text>
        <view class="badge">
          <text class="badge-text">{{ discussions.length }}条讨论</text>
        </view>
      </view>
      
      <!-- 讨论列表 -->
      <view class="discussion-list">
        <view 
          v-for="(item, index) in discussions" 
          :key="index"
          class="discussion-item"
        >
          <view class="discussion-header">
            <view class="user-info">
              <image src="/static/icons/anonymous.svg" class="avatar" />
              <text class="username">匿名用户</text>
            </view>
            <text class="time">{{ item.time }}</text>
          </view>
          <view class="discussion-content">
            <text class="text">{{ item.content }}</text>
            <view v-if="item.images && item.images.length" class="image-grid">
              <image 
                v-for="(img, imgIndex) in item.images" 
                :key="imgIndex"
                :src="img"
                mode="aspectFill"
                class="discussion-image"
                @tap="previewDiscussionImage(item.images, imgIndex)"
              />
            </view>
          </view>
          <view class="discussion-footer">
            <view class="location-info">
              <image src="/static/icons/location.svg" class="location-icon" />
              <text class="location-text">{{ item.location || '位置未知' }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 用户提交入口 -->
    <view class="submit-fab" @tap="openSubmission" @touchstart="handleFabTouch" @touchend="handleFabTouchEnd" :style="{ transform: `scale(${fabScale})` }">
      <image src="/static/icons/report.svg" class="fab-icon" />
    </view>

    <!-- 提交弹窗 -->
    <uni-popup ref="submissionPopup" type="bottom">
      <view class="submission-form">
        <textarea 
          v-model="userReport.content"
          placeholder="描述您经历的情况..."
          class="report-input"
          placeholder-class="placeholder"
          maxlength="300"
        />
        <view class="image-preview" v-if="userReport.images.length">
          <view 
            v-for="(img, index) in userReport.images" 
            :key="index"
            class="preview-item"
          >
            <image :src="img" mode="aspectFill" class="preview-image" />
            <view class="remove-btn" @tap="removeImage(index)">×</view>
          </view>
        </view>
        <view class="form-controls">
          <button @tap="addPhoto" class="photo-button">
            <image src="/static/icons/camera.svg" class="button-icon" />
            添加照片
          </button>
          <button @tap="submitReport" class="submit-button" :disabled="!userReport.content">提交报告</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'


// 模拟数据
const mapCenter = ref({ latitude: 30.88, longitude: 103.49 })

const impactMarkers = ref([
  {
    id: 1,
    latitude: 30.88,
    longitude: 103.49,
    iconPath: '/static/location.png',
    width: 40,
    height: 40,
    title: '东京震中'
  }
])

const impactAreas = ref([
  {
    points: [
      { latitude: 30.88, longitude: 103.49 },
      { latitude: 30.89, longitude: 103.50 }
    ],
    color: '#FF000033',
    width: 2
  }
])

const stats = ref([
  { id: 1, icon: '/static/icons/building.svg', value: '4.0级', label: '最大震级' },
  { id: 2, icon: '/static/icons/alert.svg', value: '12k', label: '受影响人数' },
  { id: 3, icon: '/static/icons/clock.svg', value: '48h', label: '响应时间' }
])

const photos = ref([
  {
    url: '/static/disaster.png',
    location: '成都市都江堰'
  }
])

const timeline = ref([
  {
    date: '2025-06-06 14:00',
    title: '房屋修复',
    description: '主要干道恢复通车',
    images: ['/static/repair.png']
  }
])

// 讨论区数据
const discussions = ref([])

// 用户提交相关
const userReport = ref({
  content: '',
  images: [],
  location: null,
  time: null
})

const lastUpdate = computed(() => {
  return timeline.value[0]?.date || '暂无数据'
})

const submissionPopup = ref(null)

// 交互方法
const fabScale = ref(1)

const handleFabTouch = () => {
  fabScale.value = 0.95
}

const handleFabTouchEnd = () => {
  fabScale.value = 1
}

// 修改卡片触摸处理方法
const cardScale = ref(1)

const handleCardTouch = () => {
  cardScale.value = 0.98
}

const handleCardTouchEnd = () => {
  cardScale.value = 1
}

const openSubmission = async () => {
  try {
    const location = await getLocation()
    userReport.value.location = location
    submissionPopup.value.open()
  } catch (error) {
    console.error('获取位置失败:', error)
  }
}

const getLocation = () => {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: 'gcj02',
      success: res => resolve(res),
      fail: reject
    })
  })
}

const addPhoto = () => {
  uni.chooseImage({
    count: 3,
    success: res => {
      userReport.value.images.push(...res.tempFilePaths)
    }
  })
}

const removeImage = (index) => {
  userReport.value.images.splice(index, 1)
}

const previewDiscussionImage = (images, index) => {
  uni.previewImage({
    urls: images,
    current: index
  })
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const submitReport = () => {
  if (!userReport.value.content) {
    uni.showToast({
      title: '请输入内容',
      icon: 'none'
    })
    return
  }
  
  const newDiscussion = {
    content: userReport.value.content,
    images: [...userReport.value.images],
    location: userReport.value.location?.address || '位置未知',
    time: formatTime(new Date())
  }
  
  // 添加到讨论列表
  discussions.value.unshift(newDiscussion)
  
  // 保存到本地存储
  const savedDiscussions = uni.getStorageSync('disaster-discussions') || []
  savedDiscussions.unshift(newDiscussion)
  uni.setStorageSync('disaster-discussions', savedDiscussions)
  
  // 重置表单
  userReport.value = {
    content: '',
    images: [],
    location: null,
    time: null
  }
  
  // 关闭弹窗
  submissionPopup.value.close()
  
  // 显示提交成功提示
  uni.showToast({
    title: '提交成功',
    icon: 'success'
  })
}

// 初始化加载讨论数据
onMounted(() => {
  const savedDiscussions = uni.getStorageSync('disaster-discussions') || []
  discussions.value = savedDiscussions
})
</script>

<style lang="scss" scoped>
/* 设计系统变量 */
$icon-sm: 32rpx;  // 小尺寸控件
$icon-md: 40rpx;  // 中等尺寸
$icon-lg: 56rpx;  // 主要操作图标
$color-primary: #e74c3c;
$color-text: #2c3e50;
$color-text-secondary: #7f8c8d;

.report-page {
  padding-bottom: 160rpx;
  background: #f5f7fa;
  min-height: 100vh;
}

/* 地图模块 */
.map-section {
  margin: 32rpx;
  border-radius: 32rpx;
  overflow: hidden;
  box-shadow: 0 16rpx 48rpx rgba(0,0,0,0.08);
  
  .map-toolbar {
    position: absolute;
    bottom: 24rpx;
    right: 24rpx;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    
    .map-btn {
      background: rgba(255,255,255,0.95);
      border-radius: 40rpx;
      padding: 12rpx 24rpx;
      box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: $color-text;
      
      .btn-icon {
        width: $icon-sm;
        height: $icon-sm;
        margin-right: 12rpx;
        transition: transform 0.2s ease;
      }
      
      &:active {
        transform: scale(0.98);
        .btn-icon {
          transform: scale(0.95);
        }
      }
    }
  }
}

/* 数据看板 */
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240rpx, 1fr));
  gap: 24rpx;
  padding: 0 32rpx;
  
  .stats-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 32rpx;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    .card-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 8rpx;
      background: linear-gradient(90deg, $color-primary 0%, #e67e22 100%);
    }
    
    .stat-icon {
      width: $icon-md;
      height: $icon-md;
      margin-bottom: 24rpx;
      transition: transform 0.2s ease;
    }
    
    .value {
      font-size: 40rpx;
      font-weight: 700;
      color: $color-text;
      line-height: 1.2;
    }
    
    .label {
      font-size: 26rpx;
      color: $color-text-secondary;
    }
    
    &:active {
      transform: scale(0.98);
      .stat-icon {
        transform: scale(0.9);
      }
    }
  }
}

/* 照片模块 */
.photo-section {
  margin-top: 48rpx;
  
  .section-header {
    padding: 0 32rpx 24rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .badge {
      background: rgba($color-primary, 0.1);
      border-radius: 8rpx;
      padding: 8rpx 16rpx;
      
      .badge-text {
        color: $color-primary;
        font-size: 24rpx;
        font-weight: 500;
      }
    }
  }
  
  .photo-scroll {
    padding: 0 32rpx;
    
    .photo-item {
      width: 320rpx;
      margin-right: 24rpx;
      border-radius: 16rpx;
      overflow: hidden;
      position: relative;
      
      .photo-image {
        width: 100%;
        height: 240rpx;
        transition: transform 0.3s ease;
      }
      
      .photo-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: linear-gradient(transparent 0%, rgba(0,0,0,0.6) 100%);
        padding: 24rpx;
        display: flex;
        align-items: center;
        
        .location-icon {
          width: $icon-sm;
          height: $icon-sm;
          margin-right: 12rpx;
        }
        
        .photo-caption {
          color: #fff;
          font-size: 26rpx;
          text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.3);
        }
      }
      
      &:active .photo-image {
        transform: scale(1.02);
      }
    }
  }
}

/* 时间线模块 */
.timeline-section {
  margin-top: 48rpx;
  
  .timeline {
    padding: 0 32rpx;
    
    &-item {
      position: relative;
      padding-left: 48rpx;
      margin-bottom: 48rpx;
      
      &::before {
        content: '';
        position: absolute;
        left: -2rpx;
        top: 0;
        bottom: 0;
        width: 4rpx;
        background: #eee;
      }
      
      .timeline-marker {
        position: absolute;
        left: -16rpx;
        top: 0;
        width: 32rpx;
        height: 32rpx;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
        
        &::before {
          content: '';
          position: absolute;
          width: $icon-sm;
          height: $icon-sm;
          background: $color-primary;
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        
        .pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba($color-primary, 0.2);
          animation: pulse 1.5s infinite;
        }
      }
      
      .timeline-content {
        background: #fff;
        border-radius: 16rpx;
        padding: 24rpx;
        box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
        
        .date {
          color: $color-primary;
          font-size: 26rpx;
          margin-bottom: 8rpx;
        }
        
        .title {
          font-size: 32rpx;
          font-weight: 600;
          margin-bottom: 8rpx;
        }
        
        .description {
          color: #666;
          font-size: 28rpx;
          line-height: 1.4;
        }
        
        .timeline-images {
          margin-top: 16rpx;
          
          .timeline-image {
            width: 160rpx;
            height: 160rpx;
            border-radius: 8rpx;
            margin-right: 16rpx;
          }
        }
      }
    }
  }
}

/* 讨论区样式 */
.discussion-section {
  margin-top: 48rpx;
  
  .discussion-list {
    padding: 0 32rpx;
  }
  
  .discussion-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    
    .discussion-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;
      
      .user-info {
        display: flex;
        align-items: center;
        gap: 12rpx;
        
        .avatar {
          width: 64rpx;
          height: 64rpx;
          border-radius: 50%;
        }
        
        .username {
          font-size: 28rpx;
          color: $color-text;
          font-weight: 500;
        }
      }
      
      .time {
        font-size: 24rpx;
        color: $color-text-secondary;
      }
    }
    
    .discussion-content {
      .text {
        font-size: 28rpx;
        color: $color-text;
        line-height: 1.6;
        margin-bottom: 16rpx;
      }
      
      .image-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12rpx;
        margin-top: 16rpx;
        
        .discussion-image {
          width: 100%;
          height: 200rpx;
          border-radius: 8rpx;
          background: #f5f5f5;
        }
      }
    }
    
    .discussion-footer {
      margin-top: 16rpx;
      padding-top: 16rpx;
      border-top: 2rpx solid rgba(0,0,0,0.05);
      
      .location-info {
        display: flex;
        align-items: center;
        gap: 8rpx;
        
        .location-icon {
          width: $icon-sm;
          height: $icon-sm;
          opacity: 0.6;
        }
        
        .location-text {
          font-size: 24rpx;
          color: $color-text-secondary;
        }
      }
    }
  }
}

/* 图片预览样式 */
.image-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 16rpx;
  
  .preview-item {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    
    .preview-image {
      width: 100%;
      height: 100%;
      border-radius: 8rpx;
    }
    
    .remove-btn {
      position: absolute;
      top: -16rpx;
      right: -16rpx;
      width: 40rpx;
      height: 40rpx;
      background: rgba(0,0,0,0.5);
      border-radius: 50%;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
    }
  }
}

/* 提交按钮状态 */
.submit-button {
  &:disabled {
    opacity: 0.5;
    background: $color-text-secondary !important;
  }
}

/* 悬浮按钮 */
.submit-fab {
  position: fixed;
  right: 48rpx;
  bottom: 96rpx;
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: $color-primary;
  box-shadow: 0 12rpx 32rpx rgba($color-primary, 0.3);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  .fab-icon {
    width: $icon-lg;
    height: $icon-lg;
    transition: transform 0.2s ease;
  }
  
  .fab-icon {
      transition: transform 0.2s ease;
    }
}

/* 表单弹窗 */
.submission-form {
  background: #fff;
  padding: 48rpx;
  border-radius: 24rpx 24rpx 0 0;
  
  .report-input {
    height: 240rpx;
    width: 100%;
    padding: 24rpx;
    background: #f8f9fa;
    border-radius: 12rpx;
    font-size: 28rpx;
  }
  
  .form-controls {
    display: flex;
    gap: 24rpx;
    margin-top: 32rpx;
    
    button {
      flex: 1;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 28rpx;
      
      .button-icon {
        width: $icon-sm;
        height: $icon-sm;
        margin-right: 12rpx;
        vertical-align: -4rpx;
      }
      
      &.photo-button {
        background: #f8f9fa;
        color: $color-text-secondary;
      }
      
      &.submit-button {
        background: $color-primary;
        color: #fff;
      }
    }
  }
}

/* 动画 */
@keyframes pulse {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .report-page {
    background: #1a1a1a;
    
    .stats-card,
    .timeline-content {
      background: #2d2d2d;
    }
    
    .value {
      color: #fff !important;
    }
    
    .label,
    .description {
      color: #b3b3b3 !important;
    }
    
    .btn-icon,
    .stat-icon,
    .fab-icon {
      filter: invert(1) brightness(1.2);
    }
    
    .location-icon {
      filter: invert(1);
    }
    
    .report-input {
      background: #262626;
      color: #fff;
    }
  }
  
  .discussion-item {
    background: #2d2d2d !important;
    
    .text {
      color: #fff !important;
    }
    
    .discussion-footer {
      border-color: rgba(255,255,255,0.1);
    }
  }
  
  .image-preview .preview-item .remove-btn {
    background: rgba(255,255,255,0.2);
  }
}

/* 响应式调整 */
@media (max-width: 480px) {
  $icon-sm: 28rpx;
  $icon-md: 36rpx;
  $icon-lg: 48rpx;
  
  .map-toolbar .btn-icon {
    width: $icon-sm;
    height: $icon-sm;
  }
  
  .stats-card .stat-icon {
    width: $icon-md;
    height: $icon-md;
  }
  
  .submit-fab .fab-icon {
    width: $icon-lg;
    height: $icon-lg;
  }
  
  .photo-item {
    width: 280rpx !important;
    .photo-image {
      height: 200rpx !important;
    }
  }
}
</style>