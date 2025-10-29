<template>
  <div class="home-container">
    <header class="home-header">
      <div class="title">客户管理</div>
      <t-button theme="primary" @click="handleAddCustomer">
        <template #icon><add-icon /></template>
        新增客户
      </t-button>
    </header>
    <main class="main-container">
      <div class="status-bar">
        <div class="bar-list">
          <div v-for="(key, value) in statusMap" :key="value" class="status-item">
            <span :style="{ backgroundColor: key.color }"></span>
            {{ key.label }}
          </div>
        </div>
      </div>
      <div class="client-list-container">
        <SimpleBar style="max-height: 100%">
          <div class="scroll-box">
            <div
              class="client"
              v-for="client in clientList"
              :key="client.id"
              @click="handleCustomerDetail(client)">
              <div class="top">
                <span
                  class="state-box"
                  :style="{
                    background: statusMap[client.state].color,
                  }"></span>
                <span class="name">{{ client.client_name }}</span>
              </div>
              <div class="mid">
                <span class="country">{{ client.country }}</span>
                <div class="national_flag">
                  <img :src="getImageUrl(client.country_addrev)" alt="" width="20" />
                </div>
              </div>
              <div class="client-content">
                <span class="product_name">{{ client.product_name }}</span>
                <span class="inquiry_date">
                  {{ dayjs(client.inquiry_date).format('YYYY-MM-DD') }}
                </span>
              </div>
            </div>
          </div>
        </SimpleBar>
        <t-loading v-if="loading" />
        <t-empty v-if="!loading && !clientList.length" />
      </div>
    </main>
  </div>
</template>

<script setup>
  import { ref, onMounted, onActivated } from 'vue'
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

  onMounted(() => {
    refreshHome()
  })

  onActivated(() => {
    if (sessionStorage.getItem('refresh') === '1') {
      refreshHome()
      sessionStorage.removeItem('refresh') // 清除标记
    }
  })

  const refreshHome = async () => {
    loading.value = true
    await baseInfo.getClientList()
    loading.value = false
  }

  const getImageUrl = (name) => {
    return `https://flagcdn.com/w20/${name.toLowerCase()}.png`
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
      background-color: #1e40af;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      .title {
        flex: 1;
      }
      .t-button {
        background-color: #f59e0b;
        border: none;
        &:hover {
          background-color: #d97706;
        }
      }
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
        position: relative;
        overflow: hidden;
        .scroll-box {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          grid-auto-rows: 170px; /* 固定行高，确保间距一致 */
          gap: 20px; /* 固定行列间距 */
          padding: 20px;
          align-items: start;
        }
        .client {
          display: flex;
          flex-direction: column;
          row-gap: 10px;
          width: 100%;
          height: 100%;
          padding: 12px;
          cursor: pointer;
          background: white;
          border-radius: 12px;
          border: 1px solid transparent;
          /* 默认阴影 - 轻微层次感 */
          box-shadow:
            0 2px 4px rgba(0, 0, 0, 0.05),
            0 1px 2px rgba(0, 0, 0, 0.1);

          /* 过渡效果 */
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          &:hover {
            /* 悬停阴影 - 提升层次感 */
            box-shadow:
              0 8px 25px rgba(0, 0, 0, 0.1),
              0 4px 12px rgba(0, 0, 0, 0.08);

            /* 轻微上浮效果 */
            transform: translateY(-4px);

            /* 边框增强 */
            border-color: rgba(30, 64, 175, 0.2);
          }
          .top {
            display: flex;
            align-items: center;
            gap: 10px;
            .state-box {
              display: inline-block;
              width: 20px;
              height: 20px;
              border-radius: 50%;
            }
          }
          .mid {
            display: flex;
            gap: 10px;
            .national_flag {
              img {
                object-fit: contain;
              }
            }
          }

          .client-content {
            height: 30px;
            .product_name {
              font-size: 14px;
              font-weight: bold;
            }
            .inquiry_date {
              font-size: 14px;
              color: #a7a5a5;
              margin-left: 8px;
            }
          }
        }
        .t-loading {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
        }
        .t-empty {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
</style>
