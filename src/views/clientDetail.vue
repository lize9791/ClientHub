<template>
  <div class="client-detail-container">
    <ChildHeader title="客户详情" />
    <main class="detail-main-container">
      <t-card :bordered="false">
        <t-avatar size="60px">{{ nameInitials }}</t-avatar>
        <div class="middle">
          <div class="client_name">
            {{ clientDetail.client_name }}
            <span
              class="client_origin"
              :style="{ backgroundColor: plateColorMap[clientDetail.origin] }">
              {{ originMap[clientDetail.origin] }}
            </span>
            <span class="client_lang">
              {{ languageMap[clientDetail.language] }}
            </span>
          </div>
          <div v-if="clientDetail.client_company" class="client_company">
            {{ clientDetail.client_company }}
          </div>
          <div class="address">
            <span class="country-box">
              <Icon name="address" color="#0052d9" size="18" />
              <span>{{ CountryList[clientDetail.country_addrev] }}</span>
            </span>
            <span class="company-address-box">
              <Icon name="globeAlt" color="#0052d9" size="18" />
            </span>
          </div>
        </div>
        <div class="created_at">
          <Icon name="date" color="#999999" />
          <span>创建时间：{{ dayjs(clientDetail.created_at).format('YYYY-MM-DD') }}</span>
        </div>
      </t-card>
      <t-card :bordered="false" title="询盘及订单"></t-card>
    </main>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import ChildHeader from '@/components/childHeader.vue'
  import { useBaseInfoStore } from '@/stores/baseInfo.js'
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { plateColorMap, originMap, languageMap } from '@/utils/index.js'
  import Icon from '@/components/icon.vue'
  import CountryList from '@/utils/countryList.json'
  import dayjs from 'dayjs'

  const route = useRoute()
  const clientID = Number(route.query.id)
  const baseInfo = useBaseInfoStore()
  const { clientList } = storeToRefs(baseInfo)
  const clientDetail = ref({})
  const nameInitials = ref()
  onMounted(() => {
    clientDetail.value = clientList.value.filter((item) => item.id === clientID)[0]
    getName()
  })

  const getName = () => {
    const arr = clientDetail.value.client_name?.split(' ')
    console.log(arr)
    if (arr.length === 0) return
    nameInitials.value = arr[0][0].toUpperCase() + arr[1][0].toUpperCase()
  }
</script>

<style lang="scss" scoped>
  .client-detail-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .detail-main-container {
      flex: 1;
      overflow: auto;
      padding: 12px;
      .t-card {
        box-shadow:
          rgba(0, 0, 0, 0.1) 0 1px 3px 0,
          rgba(0, 0, 0, 0.1) 0 1px 2px -1px;
        margin-bottom: 24px;
        &:last-child {
          margin-bottom: 0;
        }
        :deep(.t-card__body) {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          .middle {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
            .client_name {
              font-size: 18px;
              font-weight: bold;
              .client_origin {
                padding: 3px 8px;
                color: #fff;
                border-radius: 8px;
                font-size: 12px;
              }
              .client_lang {
                padding: 3px 8px;
                //border: 1px solid #0052d9;
                background-color: #e6f0ff;
                color: #0052d9;
                border-radius: 8px;
                font-size: 12px;
                margin-left: 5px;
              }
            }
            .address {
              display: flex;
              gap: 20px;
              .country-box,
              .company-address-box {
                display: flex;
                align-items: center;
                color: #666666;
              }
            }
          }
          .created_at {
            display: flex;
            align-items: center;
            span {
              color: #999999;
              margin-left: 5px;
            }
          }
        }
      }
    }
  }
</style>
