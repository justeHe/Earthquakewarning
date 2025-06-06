<template>
  <view class="history-tab">
    <!-- 过滤按钮 -->
    <view class="history-filter">
      <button 
        v-for="filter in filters" 
        :key="filter.value" 
        :class="['filter-btn', { active: activeFilter === filter.value }]"
        @click="setFilter(filter.value)"
      >
        {{ filter.label }}
      </button>
      <button 
        class="filter-btn"
        @click="viewEarthquakeMap"
      >
        地震地图
      </button>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-state">
      <uni-load-more status="loading"></uni-load-more>
    </view>
    <view v-else-if="error" class="error-state">
      <uni-icons type="info" size="24" color="#e74c3c"></uni-icons>
      <text>数据加载失败: {{ error }}</text>
      <button @click="retryLoading" class="retry-btn">重试</button>
    </view>
    
    <!-- 历史记录列表 -->
    <template v-else>
      <view v-if="filteredItems.length === 0" class="empty-state">
        <uni-icons type="folder" size="24" color="#95a5a6"></uni-icons>
        <text>暂无地震数据</text>
      </view>
      <view class="history-item" v-for="item in filteredItems" :key="item.id">
        <view :class="['history-severity', item.severityClass]">
          <text class="magnitude">{{ item.magnitude }}</text>
          <text class="magnitude-label">级</text>
        </view>
        <view class="history-content"
			 @click="goToShelter">
          <view class="history-title">
            <text class="location">{{ item.title }}</text>
            <view :class="['status-badge', item.type]">
              <text>{{ item.status }}</text>
            </view>
			<button 
			    v-if="item.id === 'fake-test-001'" 
			    class="test-btn" 
			    @click="goToTestPage"
			  >
			    测试
			  </button>
          </view>
          <view class="history-meta">
            <text class="history-time">
              <uni-icons type="calendar" size="14" color="#666"></uni-icons>
              {{ item.time }}
            </text>
            <text class="history-depth">
              <uni-icons type="location" size="14" color="#666"></uni-icons>
              深度: {{ item.depth }}km
            </text>
          </view>
          <view class="history-desc">
            <text v-if="item.intensity">
              <uni-icons type="notification" size="14" color="#888"></uni-icons>
              最大烈度: {{ item.intensity }}
            </text>
            <text v-if="item.epicenter">
              <uni-icons type="map" size="14" color="#888"></uni-icons>
              震中: {{ item.epicenter }}
            </text>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 地震数据API配置
const API_URL = 'https://api.wolfx.jp/cenc_eqlist.json'
const CACHE_TIME = 5 * 60 * 1000 // 5分钟缓存

const filters = [
  { value: 'all', label: '全部' },
  { value: 'warning', label: '预警' },
  { value: 'earthquake', label: '地震' }
]
const activeFilter = ref('all')
const historyItems = ref([])
const loading = ref(false)
const error = ref(null)
const lastFetchTime = ref(0)

const goToTestPage = () => {
  uni.navigateTo({
    url: '/pages/EmergencyAlert/EmergencyAlert' 
  })
}

const goToShelter = () => {
  uni.navigateTo({
    url: '/pages/Disaster-Report/Disaster-Report' 
  })
}

// 数据加载函数
const loadData = async () => {
  // 检查缓存
  const now = Date.now()
  if (now - lastFetchTime.value < CACHE_TIME && historyItems.value.length > 0) {
    return
  }

  loading.value = true
  error.value = null
  
  try {
    const [err, res] = await new Promise(resolve => {
      uni.request({
        url: API_URL,
        method: 'GET',
        success: res => resolve([null, res]),
        fail: err => resolve([err, null])
      })
    })

    if (err) {
      throw err
    }

    if (res.statusCode !== 200) {
      throw new Error(`请求失败，状态码: ${res.statusCode}`)
    }

    // 处理API返回的对象格式数据
    let rawData = []
    if (res?.data?.constructor === Object) {
      // 将对象转换为数组
      rawData = Object.keys(res.data).map(key => {
        return {
          No: key, // 保留原始编号
          ...res.data[key] // 展开对象属性
        }
      })
    }
    
    if (rawData.length === 0) {
      throw new Error('未找到有效地震数据')
    }

    historyItems.value = processData(rawData)
    lastFetchTime.value = now
  } catch (err) {
    error.value = err.errMsg || err.message || '获取地震数据失败'
    console.error('地震数据加载错误:', err)
    
    // 如果本地有缓存数据，保持显示但提示错误
    if (historyItems.value.length > 0) {
      error.value += ' (显示缓存数据)'
    }
  } finally {
    loading.value = false
  }
}

// 数据处理函数
const processData = (data) => {
  const processedData = data
    .filter(item => item && item.time && item.magnitude) // 基础数据校验
    .sort((a, b) => new Date(b.time) - new Date(a.time)) // 按时间倒序
    .map(item => ({
      id: item.EventID || `eq-${item.time}-${item.magnitude}-${Math.random().toString(36).substr(2, 6)}`,
      type: item.type || 'reviewed',
      magnitude: Number.parseFloat(item.magnitude).toFixed(1),
      title: formatLocation(item.location),
      status: item.type === 'automatic' ? '自动预警' : '正式测定',
      time: formatTime(item.time),
      depth: item.depth ? `${Number.parseFloat(item.depth).toFixed(1)}` : '未知',
      intensity: item.intensity || '未知',
      epicenter: item.location,
      description: `震源深度${item.depth || '未知'}千米，坐标: ${item.latitude || '未知'}, ${item.longitude || '未知'}`,
      severityClass: getSeverityClass(item.magnitude),
      reportTime: item.ReportTime ? formatTime(item.ReportTime) : null,
      latitude: Number.parseFloat(item.latitude) || 0,
      longitude: Number.parseFloat(item.longitude) || 0
    }))

  // 保存处理后的数据到本地存储
  uni.setStorageSync('earthquakeHistory', processedData)
  
  return processedData
}

// 地点格式化
const formatLocation = (location) => {
  if (!location) return '未知地点'
  // 去除可能重复的"中国"前缀
  return location.replace(/^中国(省|自治区|)/, '').trim() || location
}

// 时间格式化函数
const formatTime = (timeString) => {
  try {
    const date = new Date(timeString)
    return Number.isNaN(date.getTime())
      ? timeString 
      : `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  } catch {
    return timeString
  }
}

// 补零函数
const pad = (n) => n.toString().padStart(2, '0')

// 震级分类函数
const getSeverityClass = (magnitude) => {
  const value = Number.parseFloat(magnitude) || 0
  if (value < 3.5) return 'minor'
  if (value < 4.5) return 'light'
  if (value < 6) return 'moderate'
  if (value < 7) return 'strong'
  return 'major'
}

// 过滤后的数据
const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return historyItems.value
  return historyItems.value.filter(item => 
    activeFilter.value === 'warning' 
      ? item.type === 'automatic' 
      : item.type !== 'automatic'
  )
})

// 设置过滤类型
const setFilter = (filter) => {
  activeFilter.value = filter
}

// 重试加载
const retryLoading = () => {
  loadData()
}

// 查看地震地图
const viewEarthquakeMap = () => {
  if (historyItems.value.length > 0) {
    uni.setStorageSync('earthquakeHistory', historyItems.value)
  }

  uni.navigateTo({
    url: '/pages/EarthquakeMap/EarthquakeMap'
  })
}

// 初始化加载数据
onMounted(() => {
  loadData().then(() => {
      // 添加一条虚构数据
      historyItems.value.unshift({
        id: 'fake-test-001',
        type: 'automatic',
        magnitude: '4.0',
        title: '测试地震·都江堰',
        status: '自动预警',
        time: formatTime(new Date().toISOString()),
        depth: '5.0',
        intensity: 'V',
        epicenter: '"四川成都市都江堰”',
        description: '测试数据：深度5km，震中坐标 30.88, 103.49',
        severityClass: getSeverityClass(4.0),
        reportTime: formatTime(new Date().toISOString())
      })
    })
  
  // 每5分钟自动刷新数据
  setInterval(() => {
    if (!loading.value) {
      loadData()
    }
  }, 5 * 60 * 1000)
})
</script>

<style scoped>
/* 基础样式 */
.history-tab {
  padding: 20rpx;
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* 过滤按钮样式 */
.history-filter {
  display: flex;
  gap: 16rpx;
  margin-bottom: 32rpx;
  padding: 16rpx;
  background: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.filter-btn {
  flex: 1;
  padding: 20rpx 0;
  background: #f1f5f9;
  border: none;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: 500;
  color: #64748b;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.filter-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: transparent;
  transition: all 0.3s;
}

.filter-btn.active {
  background: #ffffff;
  color: #1e40af;
  font-weight: 600;
}

.filter-btn.active::after {
  background: #1e40af;
}

/* 地震条目卡片 */
.history-item {
  display: flex;
  flex-direction: row;
  background: white;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 6rpx solid;
}

.history-item:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

/* 根据震级设置左侧边框颜色 */
.history-item.minor { border-color: #4ade80; }
.history-item.light { border-color: #facc15; }
.history-item.moderate { border-color: #fb923c; }
.history-item.strong { border-color: #f87171; }
.history-item.major { border-color: #dc2626; }

/* 震级圆圈样式 */
.history-severity {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-right: 24rpx;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.history-severity.minor {
  background: linear-gradient(135deg, #4ade80, #22c55e);
}
.history-severity.light {
  background: linear-gradient(135deg, #facc15, #eab308);
}
.history-severity.moderate {
  background: linear-gradient(135deg, #fb923c, #f97316);
}
.history-severity.strong {
  background: linear-gradient(135deg, #f87171, #ef4444);
}
.history-severity.major {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

.magnitude {
  font-size: 42rpx;
  line-height: 1;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.magnitude-label {
  font-size: 22rpx;
  opacity: 0.9;
  margin-top: -8rpx;
  text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
}

/* 内容区域 */
.history-content {
  flex: 1;
  min-width: 0;
}

.history-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.location {
  font-weight: 600;
  font-size: 32rpx;
  color: #1e293b;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 20rpx;
}

.status-badge {
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  font-weight: 500;
  white-space: nowrap;
}

.status-badge.automatic {
  background: rgba(251, 191, 36, 0.1);
  color: #d97706;
  border: 1rpx solid rgba(251, 191, 36, 0.3);
}

.status-badge.reviewed {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  border: 1rpx solid rgba(34, 197, 94, 0.3);
}

/* 元信息样式 */
.history-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  margin-bottom: 16rpx;
  font-size: 26rpx;
  color: #475569;
}

.history-time, .history-depth {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

/* 描述信息 */
.history-desc {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  font-size: 26rpx;
  color: #64748b;
}

.history-desc > text {
  display: flex;
  align-items: center;
  gap: 6rpx;
  background: #f8fafc;
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
}

/* 状态提示样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx;
  color: #64748b;
  gap: 24rpx;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60rpx;
  color: #dc2626;
  gap: 24rpx;
  text-align: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx;
  color: #94a3b8;
  gap: 24rpx;
}

.error-icon, .empty-icon {
  font-size: 48rpx;
}

.retry-btn {
  margin-top: 24rpx;
  padding: 16rpx 40rpx;
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 8rpx;
  font-size: 28rpx;
  box-shadow: 0 4rpx 12rpx rgba(30, 64, 175, 0.2);
}

/* 响应式调整 */
@media (max-width: 750px) {
  .history-item {
    flex-direction: column;
  }
  
  .history-severity {
    margin-right: 0;
    margin-bottom: 20rpx;
    align-self: center;
  }
  
  .history-meta,
  .history-desc {
    flex-direction: column;
    gap: 12rpx;
  }
  
  .history-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 12rpx;
  }
  
  .location {
    margin-right: 0;
    white-space: normal;
  }
  
  .status-badge {
    align-self: flex-start;
  }
}

.test-btn {
  padding: 12rpx 32rpx;
  background: linear-gradient(to right, #3b82f6, #2563eb);
  color: #fff;
  font-size: 26rpx;
  border: none;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(59, 130, 246, 0.4);
  transition: all 0.3s;
}

.test-btn:active {
  transform: scale(0.96);
  opacity: 0.9;
}


/* 加载动画 */
.spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid rgba(30, 64, 175, 0.1);
  border-radius: 50%;
  border-top-color: #1e40af;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.map-btn {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
  color: white !important;
}

.map-btn:active {
  opacity: 0.9;
}
</style>