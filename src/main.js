import './assets/index.css'
import 'simplebar-vue/dist/simplebar.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import TDesign from 'tdesign-vue-next'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import SimpleBar from 'simplebar-vue'

// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(TDesign)

// 注册全局组件（可选）
app.component('SimpleBar', SimpleBar)

app.mount('#app')
