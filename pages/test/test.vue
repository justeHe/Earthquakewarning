<script setup>
import { ref, onMounted } from 'vue'
const amapFile = require('../../lib/amap-wx.130.js') // 保持原有 require 语法

const title = ref('hello world')

const getAddress = () => {
    const myAmapFun = new amapFile.AMapWX({ key: '3ceccd136aabe918552f561c13f20691' })
    myAmapFun.getRegeo({
        success: (data) => console.log(data),
        fail: (info) => console.log(info)
    })
}

onMounted(getAddress)
</script>