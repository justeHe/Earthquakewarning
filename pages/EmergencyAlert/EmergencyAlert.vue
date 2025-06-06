<template>
  <!-- 全屏警报容器 增加ARIA角色和键盘事件 -->
  <div 
    class="emergency-alert-screen"
    role="alert"
    aria-live="assertive"
    @keydown.esc="$emit('close')"
    tabindex="0"
  >
    <!-- 动态背景层 -->
    <div class="alert-background">
      <div class="seismic-wave"></div>
      <div class="seismic-wave delay-1"></div>
    </div>

    <!-- 主内容容器 -->
    <div class="alert-content">
      <!-- 状态图标组 -->
      <div class="alert-status">
        <i class="alert-icon" aria-hidden="true">⚠️</i>
        <div class="alert-level">高度警报</div>
      </div>

      <!-- 核心信息组 -->
      <div class="alert-main">
        <div class="countdown">
          <div class="countdown-text">预计震动到达</div>
          <div class="countdown-timer">00:{{ formattedTime }}</div>
          <div class="countdown-progress">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
        </div>

        <div class="earthquake-info">
          <div class="info-item">
            <span class="label">震级</span>
			<br>
            <span class="value magnitude">{{ magnitude }}</span>
          </div>
          <div class="info-item">
            <span class="label">深度</span>
			<br>
            <span class="value">{{ depth }} km</span>
          </div>
          <div class="info-item">
            <span class="label">震中位置</span>
            <span class="value">{{ epicenter }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮组 -->
      <div class="alert-actions">
        <button 
          class="action-btn mute-btn"
          @click="toggleMute"
          :aria-label="isMuted ? '取消静音' : '静音警报'"
        >
          <i :class="['icon', isMuted ? 'icon-volume-off' : 'icon-volume-up']"></i>
          <span class="btn-text">{{ isMuted ? '取消静音' : '静音' }}</span>
        </button>
        <button 
          class="action-btn vibrate-btn"
          @click="toggleVibration"
          :aria-label="isVibrationEnabled ? '关闭振动' : '开启振动'"
        >
          <i :class="['icon', isVibrationEnabled ? 'icon-vibration' : 'icon-vibration-off']"></i>
          <span class="btn-text">{{ isVibrationEnabled ? '关闭振动' : '开启振动' }}</span>
        </button>
        <button 
          class="action-btn guide-btn"
          @click="goToEemerCenter"
          aria-label="应急指南"
        >
          <i class="icon icon-guide"></i>
          <span class="btn-text">应急指南</span>
        </button>
        <button 
          class="action-btn close-btn"
          @click="goToMain"
          aria-label="关闭警报"
        >
          <i class="icon icon-close"></i>
          <span class="btn-text">关闭</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const goToMain = () => {
  // 停止振动
  if (vibrationTimer) {
    clearInterval(vibrationTimer)
    vibrationTimer = null
  }
  isVibrationEnabled.value = false
  
  // 停止音频
  if (alertAudio.value) {
    alertAudio.value.stop()
  }
  
  uni.navigateTo({
    url: '/pages/index/index'
  })
}

	
const goToEemerCenter = () =>{
	uni.navigateTo({
	  url: '/pages/Emergenciecenter/Emergenciecenter' // 替换为你的测试页面路径
	})
}

const props = defineProps({
  duration: { type: Number, default: 20 }, // 倒计时总时长
  magnitude: { type: Number, default: 4.0 }, // 震级
  depth: { type: Number, default: 10 }, // 深度
  epicenter: { type: String, default:"四川省成都市" } // 震中
})

const emit = defineEmits(['close', 'mute', 'unmute', 'show-guide'])

const remainingTime = ref(props.duration)
const isMuted = ref(false)
const isVibrationEnabled = ref(true)
const alertAudio = ref(null)
let timer = null
let vibrationTimer = null

// 格式化显示时间
const formattedTime = computed(() => {
  return remainingTime.value.toString().padStart(2, '0')
})

// 进度条计算
const progress = computed(() => {
  return ((props.duration - remainingTime.value) / props.duration) * 100
})

// 倒计时逻辑
const startCountdown = () => {
  timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
}

// 初始化音频
const initAudio = () => {
  try {
    // 检查声音设置
    const soundEnabled = uni.getStorageSync('soundEnabled')
    if (soundEnabled === false) {
      isMuted.value = true
      return
    }

    const innerAudioContext = uni.createInnerAudioContext()
    innerAudioContext.src = '/static/music/alert.mp3'
    innerAudioContext.loop = true
    
    // 设置音频事件监听
    innerAudioContext.onPlay(() => {
      console.log('开始播放警报音频')
    })
    
    innerAudioContext.onError((res) => {
      console.error('音频播放错误:', res.errMsg)
    })
    
    // 设置音量
    const volume = uni.getStorageSync('soundVolume')
    if (typeof volume === 'number') {
      innerAudioContext.volume = volume / 100
    }
    
    alertAudio.value = innerAudioContext
    
    // 如果没有静音，开始播放
    if (!isMuted.value) {
      innerAudioContext.play()
    }
  } catch (error) {
    console.error('音频初始化失败:', error)
  }
}

// 振动控制函数
const vibrate = () => {
  // 检查振动设置
  const vibrationEnabled = uni.getStorageSync('vibrationEnabled')
  if (vibrationEnabled === false) {
    if (vibrationTimer) {
      clearInterval(vibrationTimer)
      vibrationTimer = null
    }
    return
  }

  try {
    // 检查是否支持振动API
    if (uni.vibrateLong) {
      uni.vibrateLong({
        success: () => {
          console.log('振动成功')
        },
        fail: () => {
          console.error('振动失败')
        }
      })
    }
  } catch (error) {
    console.error('振动API不可用:', error)
  }
}

// 切换静音状态
const toggleMute = () => {
  isMuted.value = !isMuted.value
  if (alertAudio.value) {
    if (isMuted.value) {
      alertAudio.value.pause()
    } else {
      alertAudio.value.play()
    }
  }
  emit(isMuted.value ? 'mute' : 'unmute')
}

// 切换振动状态
const toggleVibration = () => {
  isVibrationEnabled.value = !isVibrationEnabled.value
  if (!isVibrationEnabled.value && vibrationTimer) {
    clearInterval(vibrationTimer)
    vibrationTimer = null
  } else if (isVibrationEnabled.value) {
    startVibration()
  }
}

// 开始振动循环
const startVibration = () => {
  // 检查振动设置
  const vibrationEnabled = uni.getStorageSync('vibrationEnabled')
  if (vibrationEnabled === false) {
    isVibrationEnabled.value = false
    return
  }

  if (vibrationTimer) {
    clearInterval(vibrationTimer)
  }
  
  // 立即执行一次振动
  vibrate()
  
  // 设置振动间隔（每3秒振动一次）
  vibrationTimer = setInterval(() => {
    vibrate()
  }, 3000)
}

// 显示指南
const showGuide = () => {
  emit('show-guide')
}

onMounted(() => {
  startCountdown()
  startVibration()
  initAudio()
})

// 在组件卸载时清理资源
onUnmounted(() => {
  if (vibrationTimer) {
    clearInterval(vibrationTimer)
    vibrationTimer = null
  }
  
  if (alertAudio.value) {
    alertAudio.value.destroy()
    alertAudio.value = null
  }
})
</script>

<style scoped>
/* 全屏警报容器 */
.emergency-alert-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #c0392b, #e74c3c);
  color: #fff;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: pulseBackground 0.8s infinite;
}

/* 动态背景效果 */
.alert-background {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.seismic-wave {
  position: absolute;
  bottom: -50%;
  left: 50%;
  width: 200vmax;
  height: 200vmax;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 45%;
  transform: translate(-50%, 0) rotate(0deg);
  animation: wave 2s infinite linear;
}

.delay-1 {
  animation-delay: 1s;
  opacity: 0.5;
}

/* 核心内容样式 */
.alert-content {
  position: relative;
  z-index: 1;
  max-width: 600px;
  padding: 2rem;
  text-align: center;
}

/* 倒计时样式 */
.countdown-timer {
  font-size: 4rem;
  font-weight: 700;
  margin: 1rem 0;
  font-family: monospace;
  animation: 
      textPulse 0.5s infinite alternate,
      textShake 0.3s infinite;
}

@keyframes textShake {
  0%, 100% { transform: translateX(0) rotate(0); }
  25% { transform: translateX(-3px) rotate(-0.5deg); }
  75% { transform: translateX(3px) rotate(0.5deg); }
}

.countdown-progress {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #f39c12;
  transition: width 1s linear;
}

/* 地震信息 */
.earthquake-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 2rem 0;
}

.info-item {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 8px;
}

.magnitude {
  color: #f39c12;
  font-size: 1.5em;
}

/* 操作按钮 */
.alert-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.alert-content {
  position: relative;
  overflow: hidden;
}

.alert-content::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 3px solid #f39c12;
  border-radius: 12px;
  animation: borderAlert 0.6s infinite;
  pointer-events: none;
}


.action-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 0,x, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

/* 动画定义 */
@keyframes pulseBackground {
  0% { opacity: 0.95; }
  50% { opacity: 1; }
  100% { opacity: 0.95; }
}

@keyframes wave {
  from { transform: translate(-50%, 0) rotate(0deg); }
  to { transform: translate(-50%, -80%) rotate(720deg); }
}

/* 无障碍优化 */
.action-btn:focus {
  outline: 2px solid #f39c12;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .seismic-wave {
    animation: none;
  }
  
  .emergency-alert-screen {
    animation: none;
  }
}

.alert-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 1rem;
}

.action-btn {
  width: auto;
  height: 48px;
  padding: 0 1rem;
  border: none;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

/* 针对小屏幕的响应式调整 */
@media (max-width: 480px) {
  .alert-actions {
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
  }
  
  .action-btn {
    width: 80%;
    justify-content: center;
  }
}

/* 振动按钮样式 */
.vibrate-btn {
  background: rgba(255, 255, 255, 0.1);
}

.vibrate-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.icon-vibration,
.icon-vibration-off {
  font-size: 1.2rem;
}
</style>