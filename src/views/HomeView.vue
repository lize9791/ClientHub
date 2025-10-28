<template>
  <div class="home-container">
    <!--    客户信息整理系统-->
    <header class="home-header">客户信息整理系统</header>
    <main class="main-container">
      <div class="status-bar">
        <t-button theme="primary" @click="handleAddCustomer">
          <template #icon><add-icon /></template>
          新增客户
        </t-button>
        <div class="bar-list">
          <div v-for="(key, value) in statusMap" :key="value" class="status-item">
            <span :style="{ backgroundColor: key.color }"></span>
            {{ key.label }}
          </div>
        </div>
      </div>
      <div class="client-list-container">
        <div
          class="client"
          v-for="client in clientList"
          :key="client.id"
          :style="{
            background: `linear-gradient(to right, white, ${statusMap[client.state].color})`,
          }"
          @click="handleCustomerDetail(client)">
          <div class="national_flag">
            <img :src="getImageUrl(client.country_addrev)" alt="" width="40" />
          </div>
          <div class="client-content">
            <span class="name">{{ client.client_name }}</span>
            <span class="country">{{ client.country }}</span>
            <span class="product_name">{{ client.product_name }}</span>
            <span class="inquiry_date">
              询盘日期：{{ dayjs(client.inquiry_date).format('YYYY-MM-DD') }}
            </span>
          </div>
        </div>
        <t-loading v-if="loading" />
        <t-empty v-if="!loading && !clientList.length" />
      </div>
    </main>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { statusMap } from '@/utils/index.js'
  import dayjs from 'dayjs'
  import { AddIcon } from 'tdesign-icons-vue-next'
  import { useRouter } from 'vue-router'
  import { useBaseInfoStore } from '@/stores/baseInfo.js'
  import { storeToRefs } from 'pinia'

  const router = useRouter()
  const loading = ref(true)
  const baseInfo = useBaseInfoStore()
  const { clientList } = storeToRefs(baseInfo)

  onMounted(async () => {
    loading.value = true
    await baseInfo.getClientList()
    console.log(clientList.value)
    loading.value = false
  })

  const getImageUrl = (name) => {
    return `https://flagcdn.com/w40/${name.toLowerCase()}.png`
  }

  // 跳转新增客户页面
  const handleAddCustomer = () => {
    router.push('/add')
  }

  // 跳转客户详情页面
  const handleCustomerDetail = (client) => {
    router.push({
      path: '/detail',
      query: {
        id: client.id,
      },
    })
  }
</script>
<style scoped lang="scss">
  .home-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .home-header {
      width: 100%;
      height: 60px;
      text-align: center;
      line-height: 60px;
      font-size: 22px;
      border-bottom: 1px solid #3899cc;
      background-color: #0ba6df;
      color: #fff;
    }
    .main-container {
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      .status-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        padding: 0 12px;
        border-bottom: 1px solid #ebebeb;
        .bar-list {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .status-item {
          height: 30px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 3px;
          color: #333;
          position: relative;
          font-size: 14px;
          span {
            width: 100%;
            height: 3px;
            border-radius: 2px;
            position: absolute;
            bottom: 0;
          }
        }
      }
      .client-list-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        .client {
          display: flex;
          align-items: center;
          height: 60px;
          padding: 0 12px;
          border-bottom: 1px solid #ebebeb;
          position: relative;
          cursor: pointer;
          .state-box {
            width: 200px;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            z-index: -1;
          }
          .national_flag {
            margin-right: 10px;
            img {
              object-fit: contain;
            }
          }
          .client-content {
            height: 30px;
            gap: 10px;
            .name {
              font-size: 20px;
              font-weight: bold;
            }
            .country {
              font-size: 14px;
              font-weight: bold;
              margin-left: 10px;
            }
            .product_name {
              font-size: 14px;
              font-weight: bold;
              margin-left: 10px;
            }
            .inquiry_date {
              font-size: 14px;
              color: #a7a5a5;
              margin-left: 8px;
            }
          }
        }
        .t-loading {
          flex: 1;
        }
        .t-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
</style>
