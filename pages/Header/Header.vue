<template>
  <view>
    
    
    <!-- 定位按钮 -->

  </view>
</template>

<script>
// 条件编译加载不同平台的地图SDK

export default {
  data() {
    return {
      map: null,
      AMap: null,
      longitude: 0,
      latitude: 0,
      address: '',
      locating: false,
      marker: null
    }
  },
  onReady() {
    this.initMap()
  },
  methods: {
    async initMap() {
      try {
        // #ifdef H5
        await this.initWebAMap()
        // #endif
        
        // #ifdef APP-PLUS
        await this.initNativeMap()
        // #endif
        
        // 初始定位
        this.locateMe()
      } catch (e) {
        console.error('地图初始化失败:', e)
        uni.showToast({
          title: '地图加载失败',
          icon: 'none'
        })
      }
    },
    
    // H5端高德地图初始化
    async initWebAMap() {
      const AMap = await AMapLoader.load({
        key: '您的高德Web端Key',
        version: '2.0',
        plugins: ['AMap.Geolocation', 'AMap.Geocoder']
      })
      
      this.AMap = AMap
      this.map = new AMap.Map('mapContainer', {
        zoom: 15,
        viewMode: '3D'
      })
      
      // 添加地图控件
      this.map.addControl(new AMap.ControlBar({
        showZoomBar: true,
        showControlButton: true
      }))
    },
    
    // App端原生定位
    async initNativeMap() {
      // 使用uni-app内置定位
      this.map = uni.createMapContext('mapContainer', this)
    },
    
    // 定位核心方法
    async locateMe() {
      // if (this.locating) return
      
      // this.locating = true
      // try {
      //   // #ifdef H5
      //   await this.webLocation()
      //   // #endif
        
      //   // #ifdef APP-PLUS
      //   await this.nativeLocation()
      //   // #endif
      // } catch (e) {
      //   console.error('定位失败:', e)
      //   uni.showToast({
      //     title: '定位失败: ' + (e.message || '未知错误'),
      //     icon: 'none'
      //   })
      // } finally {
      //   this.locating = false
      // }
	  uni.navigateTo({
	          url: '/pages/Disaster-Report/Disaster-Report',
	          success: () => {
	            console.log('跳转成功');
	          },
	          fail: (err) => {
	            console.error('跳转失败:', err);
	            uni.showToast({
	              title: '无法打开警报页面',
	              icon: 'none'
	            });
	          }
	        });
	  
    },
    
    // H5端定位
    async webLocation() {
      return new Promise((resolve, reject) => {
        const geolocation = new this.AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          showMarker: false
        })
        
        geolocation.getCurrentPosition((status, result) => {
          if (status === 'complete') {
            this.handleLocationSuccess(result.position)
            resolve()
          } else {
            reject(new Error(result.message || '获取位置失败'))
          }
        })
      })
    },
    
    // App端定位
    async nativeLocation() {
      const [err, res] = await uni.getLocation({
        type: 'gcj02',
        altitude: true,
        isHighAccuracy: true
      })
      
      if (err) throw err
      
      this.longitude = res.longitude
      this.latitude = res.latitude
      
      // 移动地图中心
      this.map.moveToLocation({
        latitude: this.latitude,
        longitude: this.longitude
      })
      
      // 添加标记
      this.addMarker([this.longitude, this.latitude])
      
      // 逆地理编码
      this.reverseGeocode()
    },
    
    // 处理定位成功
    handleLocationSuccess(position) {
      this.longitude = position.lng
      this.latitude = position.lat
      
      // 更新地图中心
      this.map.setCenter([this.longitude, this.latitude])
      
      // 添加标记
      this.addMarker([this.longitude, this.latitude])
      
      // 逆地理编码
      this.reverseGeocode()
    },
    
    // 添加标记
    addMarker(position) {
      if (this.marker) {
        this.map.remove(this.marker)
      }
      
      // #ifdef H5
      this.marker = new this.AMap.Marker({
        position: position,
        map: this.map,
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png'
      })
      // #endif
      
      // #ifdef APP-PLUS
      this.map.translateMarker({
        markerId: 1,
        destination: {
          latitude: position[1],
          longitude: position[0]
        },
        autoRotate: false
      })
      // #endif
    },
    
    // 逆地理编码获取地址
    async reverseGeocode() {
      try {
        // #ifdef H5
        const geocoder = new this.AMap.Geocoder()
        const result = await new Promise((resolve) => {
          geocoder.getAddress([this.longitude, this.latitude], (status, result) => {
            resolve(result)
          })
        })
        this.address = result.regeocode.formattedAddress
        // #endif
        
        // #ifdef APP-PLUS
        const [err, res] = await uni.request({
          url: 'https://restapi.amap.com/v3/geocode/regeo',
          data: {
            key: 'eb59d743db0924ca2ed1310a303eba45',
            location: `${this.longitude},${this.latitude}`
          }
        })
        if (res.data.status === '1') {
          this.address = res.data.regeocode.formatted_address
        }
        // #endif
      } catch (e) {
        console.error('逆地理编码失败:', e)
        this.address = '地址解析失败'
      }
    }
  }
}
</script>

<style lang="scss">
/* 信息卡片样式 */
.info-card {
  position: relative; 
  bottom: 20px;
  left: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.info-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

.info-text {
  font-size: 14px;
  color: #333;
  flex: 1;
}

/* 定位按钮样式 */
.locate-btn {
  position: absolute;
  right: 15px;
  bottom: 90px;
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  z-index: 999;
  
  image {
    width: 24px;
    height: 24px;
  }
  
  &[disabled] {
    opacity: 0.7;
  }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .info-card {
    background: rgba(30, 30, 30, 0.9);
  }
  
  .info-text {
    color: #FFFFFF;
  }
  
  .locate-btn {
    background-color: #2C2C2E;
  }
}
</style>