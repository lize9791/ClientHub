<template>
  <div class="client-detail-container">
    <ChildHeader title="客户详情" />
    <main class="detail-main-container">
      <SimpleBar style="max-height: 100%">
        <div class="main-content">
          <div class="left-box">
            <t-card :bordered="false" class="flex-card">
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
                  <span
                    class="client_state"
                    :style="{ backgroundColor: statusMap[clientDetail.state]?.color }">
                    {{ statusMap[clientDetail.state]?.label }}
                  </span>
                </div>
                <div v-if="clientDetail.client_company" class="client_company">
                  {{ clientDetail.client_company }}
                </div>
                <div class="address">
                  <span class="country-box">
                    <Icon name="address" color="#0052d9" size="18" />
                    <span>{{ CountryList[clientDetail.country_addrev] }}</span>
                    <img :src="nationalFlag" alt="" />
                  </span>
                  <span class="company-address-box">
                    <Icon name="globeAlt" color="#0052d9" size="18" />
                  </span>
                </div>
              </div>
              <div class="right-box">
                <div class="inquiry_date">
                  <Icon name="date" color="#000000" />
                  <span>首次询盘：{{ dayjs(clientDetail.inquiry_date).format('YYYY-MM-DD') }}</span>
                </div>
                <div class="created_at">
                  <Icon name="date" color="#999999" />
                  <span>入库时间：{{ dayjs(clientDetail.created_at).format('YYYY-MM-DD') }}</span>
                </div>
              </div>
            </t-card>
            <t-card :bordered="false" title="询盘及订单">
              <t-tabs v-model="orderNum">
                <t-tab-panel
                  v-for="(item, index) in orderList"
                  :key="item"
                  :value="item"
                  :label="'订单' + numberToChinese(index + 1)"
                  :destroy-on-hide="false">
                  <div class="order-content">
                    <div class="base-content">
                      <div class="title">订单基本信息</div>
                      <div class="base-info">
                        <div class="inquiry_date">
                          询盘日期：{{ dayjs(clientDetail.inquiry_date).format('YYYY-MM-DD') }}
                        </div>
                        <div class="order_num">订单编号：{{ item }}</div>
                        <div class="receiving_account">收款账号：</div>
                        <div class="receiving_artio">收款比例 ：</div>
                        <div class="receiving_date">收款日期 ：</div>
                        <div class="scheduling_date">排产日期 ：</div>
                        <div class="export_method">出口方式 ：</div>
                      </div>
                    </div>
                    <div class="product-content">
                      <div class="title">产品信息</div>
                      <div class="product-info">
                        <div class="pro-name">产品名称：{{ clientDetail.product_name }}</div>
                        <div class="pro-model">产品型号：</div>
                        <div class="pro-num">产品数量：</div>
                        <div class="pro-unit">产品单位：</div>
                        <div class="pro-price">产品单价：</div>
                      </div>
                      <div class="detailed_specifications">
                        <div class="title">详细规格描述</div>
                        <div class="content">
                          详细规格描述详细规格描述详细规格描述详细规格描述详细规格描述详细规格描述
                        </div>
                      </div>
                    </div>
                  </div>
                </t-tab-panel>
              </t-tabs>
            </t-card>
            <t-card :bordered="false" title="备注及其他信息">
              <div class="remark-content">{{ clientDetail.remark }}</div>
            </t-card>
          </div>
          <t-card class="contact-info" :bordered="false" title="联系信息">
            <div class="info-content">
              <div class="email">
                <p class="label">电子邮件</p>
                <p class="text">{{ clientDetail.client_email || '暂无' }}</p>
              </div>
              <div class="phone">
                <p class="label">电话号码</p>
                <p class="text">{{ clientDetail.client_phone || '暂无' }}</p>
              </div>
            </div>
          </t-card>
        </div>
      </SimpleBar>
    </main>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import ChildHeader from '@/components/childHeader.vue'
  import { useRoute } from 'vue-router'
  import {
    plateColorMap,
    originMap,
    languageMap,
    statusMap,
    numberToChinese,
  } from '@/utils/index.js'
  import Icon from '@/components/icon.vue'
  import CountryList from '@/utils/countryList.json'
  import dayjs from 'dayjs'
  import supabase from '@/request/supabase.js'

  const route = useRoute()
  const clientID = Number(route.query.id)
  const clientDetail = ref({})
  const nameInitials = ref()
  const orderList = ref([])
  const orderNum = ref('')
  const nationalFlag = ref('')

  onMounted(() => {
    getClientInfo()
  })

  const getClientInfo = async () => {
    const res = await supabase.getClientInfo(clientID)
    if (res.status === 200) {
      clientDetail.value = res.data
      getBaseInfo(res.data)
    }
  }

  const getBaseInfo = (value) => {
    const arr = value.client_name?.split(' ')
    if (value.order_num) {
      orderList.value = value.order_num?.split(',')
      orderNum.value = orderList.value.length ? orderList.value[0] : ''
    }
    nationalFlag.value = `https://flagcdn.com/w40/${value.country_addrev.toLowerCase()}.png`
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
      overflow: hidden;
      .main-content {
        padding: 12px;
        display: flex;
        gap: 16px;
      }
      .left-box {
        flex: 1;
      }
      .contact-info {
        width: 400px;
        height: max-content;
        position: sticky;
        top: 12px;
        :deep(.t-card__body) {
          padding-top: 10px;
          .info-content {
            .email,
            .phone {
              border-bottom: 1px solid #0000001a;
              .text {
                color: #0052d9;
              }
            }
            .phone {
              border-bottom: none;
            }
          }
        }
      }
      .t-card {
        box-shadow:
          rgba(0, 0, 0, 0.1) 0 1px 3px 0,
          rgba(0, 0, 0, 0.1) 0 1px 2px -1px;
        margin-bottom: 24px;
        &:last-child {
          margin-bottom: 0;
        }
        :deep(.t-card__header) {
          padding-bottom: 0;
        }
        :deep(.t-card__body) {
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
                background-color: #e6f0ff;
                color: #0052d9;
                border-radius: 8px;
                font-size: 12px;
                margin-left: 5px;
              }
              .client_state {
                padding: 3px 8px;
                color: #ffffff;
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
                img {
                  width: 20px;
                  margin-left: 6px;
                }
              }
            }
          }
          .right-box {
            .created_at,
            .inquiry_date {
              display: flex;
              align-items: center;
              span {
                color: #999999;
                margin-left: 5px;
              }
            }
            .inquiry_date {
              margin-bottom: 10px;
              span {
                color: #000;
              }
            }
          }
          .order-content {
            .base-content,
            .product-content {
              padding: 12px 0;
              .title {
                font-size: 18px;
                font-weight: bold;
              }
              .base-info,
              .product-info {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* 关键 */
                gap: 16px; /* 间距 */
                padding: 16px 0;
              }
              .detailed_specifications {
                .title {
                  font-size: 14px;
                  margin-bottom: 6px;
                }
                .content {
                  width: 100%;
                  padding: 16px;
                  border-radius: 10px;
                  background-color: #f5f6fa;
                }
              }
            }
          }
          .remark-content {
            width: 100%;
            padding: 16px;
            border-radius: 10px;
            background-color: #f5f6fa;
          }
        }
      }
      .flex-card {
        :deep(.t-card__body) {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }
      }
    }
  }
</style>
