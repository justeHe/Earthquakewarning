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
            <span class="value magnitude">{{ magnitude }}</span>
          </div>
          <div class="info-item">
            <span class="label">深度</span>
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
        </button>
        <button 
          class="action-btn guide-btn"
          @click="showGuide"
          aria-label="应急指南"
        >
          <i class="icon icon-guide"></i>
        </button>
        <button 
          class="action-btn close-btn"
          @click="$emit('close')"
          aria-label="关闭警报"
        >
          <i class="icon icon-close"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  duration: { type: Number, default: 20 }, // 倒计时总时长
  magnitude: { type: Number, required: true }, // 震级
  depth: { type: Number, required: true }, // 深度
  epicenter: { type: String, required: true } // 震中
})

const emit = defineEmits(['close', 'mute', 'unmute', 'show-guide'])

const remainingTime = ref(props.duration)
const isMuted = ref(false)
let timer = null

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

// 静音切换
const toggleMute = () => {
  isMuted.value = !isMuted.value
  emit(isMuted.value ? 'mute' : 'unmute')
}

// 显示指南
const showGuide = () => {
  emit('show-guide')
}

onMounted(() => {
  startCountdown()
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
</style>