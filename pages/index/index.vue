<template>
  <div class="container">
    <!-- 紧急警报 -->
    <EmergencyAlert v-if="showEmergencyAlert" @close="closeEmergencyAlert" />

    <!-- 头部 -->
    <Header />

    <!-- 主内容区，根据 currentTab 动态切换 -->
    <div class="content">
      <AlertTab v-if="currentTab === 'alert'" />
      <HistoryTab v-else-if="currentTab === 'history'" />
      <GuideTab v-else-if="currentTab === 'guide'" />
      <SettingsTab v-else-if="currentTab === 'settings'" />
    </div>

    <!-- 底部标签栏 -->
    <TabBar :activeTab="currentTab" @changeTab="changeTab" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Header from '../Header/Header.vue'
import EmergencyAlert from '../EmergencyAlert/EmergencyAlert.vue'
import TabBar from '../TabBar/TabBar.vue'
import AlertTab from '../AlertTab/AlertTab.vue'
import HistoryTab from '../HistoryTab/HistoryTab.vue'
import GuideTab from '../GuideTab/GuideTab.vue'
import SettingsTab from '../SettingsTab/SettingsTab.vue'

const currentTab = ref('alert')
const showEmergencyAlert = ref(false)

function changeTab(tab) {
  currentTab.value = tab
}

function closeEmergencyAlert() {
  showEmergencyAlert.value = false
}

// 模拟收到地震预警（5% 概率）并显示紧急警报，10秒后自动恢复
onMounted(() => {
  setTimeout(() => {
    if (Math.random() < 0.05) {
      showEmergencyAlert.value = true
      setTimeout(() => {
        showEmergencyAlert.value = false
      }, 10000)
    }
  }, 3000)
})
</script>

<style scoped>
:root {
  --primary-color: #e74c3c;
  --secondary-color: #3498db;
  --dark-color: #2c3e50;
  --light-color: #f7f9fc;
  --warning-color: #f39c12;
  --safe-color: #27ae60;
}

/* 背景渐变，使界面更有层次感 */
.container {
  max-width: 430px;
  margin: 0 auto;
  background: linear-gradient(to bottom, var(--light-color), #ffffff);
  min-height: 100vh;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding-bottom: 60px; /* 为底部标签栏留出空间 */
  border-radius: 10px;
  overflow: hidden;
}

/* 卡片式主内容区域 */
.content {
  padding: 20px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  margin: 15px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

/* 增强 hover 效果 */
.content:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}
</style>
