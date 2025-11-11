<template>
  <div class="client-detail-container">
    <ChildHeader title="客户详情" />
    <main class="detail-main-container">
      <SimpleBar style="max-height: 100%">
        <div class="main-content">
          <!-- 左侧主内容区 -->
          <div class="left-content">
            <!-- 客户基本信息卡片 -->
            <t-card :bordered="false" class="client-info-card">
              <div class="card-header-section">
                <div class="client-avatar-section">
                  <t-avatar size="80px" class="client-avatar">{{ nameInitials }}</t-avatar>
                  <div class="client-basic-info">
                    <h2 class="client-name">{{ clientDetail.client_name }}</h2>
                    <div class="client-badges">
                      <span class="badge badge-origin" :style="{ background: plateColorMap[clientDetail.origin] }">
                        {{ originMap[clientDetail.origin] }}
                      </span>
                      <span class="badge badge-language">
                        {{ languageMap[clientDetail.language] }}
                      </span>
                      <span
                        class="badge badge-status"
                        :style="{ background: statusMap[clientDetail.state]?.color }">
                        {{ statusMap[clientDetail.state]?.label }}
                      </span>
                    </div>
                    <div v-if="clientDetail.client_company" class="company-name">
                      {{ clientDetail.client_company }}
                    </div>
                  </div>
                </div>

                <div class="action-section">
                  <t-button theme="primary" size="medium" class="edit-btn" @click="handleEdit">
                    <template #icon><edit-icon /></template>
                    编辑客户
                  </t-button>
                </div>
              </div>

              <div class="client-meta-info">
                <div class="meta-item">
                  <Icon name="address" color="#5B8DEF" size="20" />
                  <span class="meta-text">{{ CountryList[clientDetail.country_addrev] }}</span>
                  <img :src="nationalFlag" alt="" class="country-flag" />
                </div>
                <div class="meta-item">
                  <Icon name="date" color="#5B8DEF" size="20" />
                  <span class="meta-label">首次询盘：</span>
                  <span class="meta-text">{{ dayjs(clientDetail.inquiry_date).format('YYYY-MM-DD') }}</span>
                </div>
                <div class="meta-item">
                  <Icon name="date" color="#94A3B8" size="20" />
                  <span class="meta-label">入库时间：</span>
                  <span class="meta-text secondary">{{
                    dayjs(clientDetail.created_at).format('YYYY-MM-DD')
                  }}</span>
                </div>
              </div>
            </t-card>

            <!-- 询盘及订单信息卡片 -->
            <t-card :bordered="false" class="order-info-card">
              <template #header>
                <div class="card-header-with-actions">
                  <div class="card-title-with-icon">
                    <span class="title-icon">📦</span>
                    <span>询盘及订单</span>
                    <t-tag theme="primary" variant="light" size="small">{{ orderList.length }} 个订单</t-tag>
                    <span v-if="batchDeleteMode" class="batch-tag">
                      已选择 {{ selectedOrders.length }} 个订单
                    </span>
                  </div>
                  <div class="header-actions">
                    <t-button
                      v-if="!batchDeleteMode && orderList.length > 0"
                      size="small"
                      variant="outline"
                      @click="toggleBatchDeleteMode">
                      <template #icon>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path
                            d="M15.5 3.5a.5.5 0 0 1-.5.5h-3.5a.5.5 0 0 1 0-1H14V1.5a.5.5 0 0 1 1 0v2zm-13 12a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0V14h1.5a.5.5 0 0 1 0 1h-2zm13 0h-2a.5.5 0 0 1 0-1H14v-1.5a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.5.5zM1 3.5A.5.5 0 0 1 1.5 3h2a.5.5 0 0 1 0 1H2v1.5a.5.5 0 0 1-1 0v-2z" />
                        </svg>
                      </template>
                      批量管理
                    </t-button>
                    <t-button
                      v-if="batchDeleteMode"
                      size="small"
                      variant="outline"
                      @click="toggleBatchDeleteMode">
                      <template #icon>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path
                            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                      </template>
                      取消
                    </t-button>
                    <t-button
                      v-if="batchDeleteMode && selectedOrders.length > 0"
                      size="small"
                      theme="danger"
                      @click="handleBatchDeleteOrders">
                      <template #icon>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path
                            d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z" />
                          <path
                            fill-rule="evenodd"
                            d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                        </svg>
                      </template>
                      删除选中 ({{ selectedOrders.length }})
                    </t-button>
                    <t-button
                      v-if="!batchDeleteMode"
                      size="small"
                      variant="outline"
                      @click="handleImportOrders">
                      <template #icon>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path
                            d="M8.5 1a.5.5 0 0 0-1 0v7.793L5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 8.793V1z" />
                          <path
                            d="M3 10.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z" />
                        </svg>
                      </template>
                      导入订单
                    </t-button>
                    <t-button
                      v-if="!batchDeleteMode"
                      size="small"
                      variant="outline"
                      @click="handleAddOrder">
                      <template #icon>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path
                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
                        </svg>
                      </template>
                      新增订单
                    </t-button>
                  </div>
                </div>
              </template>
              <div v-if="orderList.length === 0" class="empty-orders">
                <div class="empty-icon">📦</div>
                <div class="empty-text">暂无订单</div>
              </div>
              <!-- 批量删除模式：订单列表视图 -->
              <div v-else-if="batchDeleteMode" class="batch-order-list">
                <div
                  v-for="order in orderList"
                  :key="order.id"
                  :class="['batch-order-item', { selected: isOrderSelected(order.id) }]"
                  @click="toggleOrderSelection(order.id)">
                  <div class="order-info">
                    <div class="order-main-info">
                      <span class="order-number">{{ order.order_num }}</span>
                      <span class="order-product">{{ order.product_name }}</span>
                    </div>
                    <div class="order-meta">
                      <span v-if="order.order_inquiry_date" class="order-date">
                        询盘：{{ order.order_inquiry_date }}
                      </span>
                      <span v-if="order.profit" class="order-profit">利润：${{ order.profit }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 正常模式：Tab标签页视图 -->
              <t-tabs v-else v-model="orderNum" class="order-tabs">
                <t-tab-panel
                  v-for="(order, index) in orderList"
                  :key="order.id"
                  :value="order.order_num"
                  :label="order.product_name || order.order_num"
                  :destroy-on-hide="false">
                  <div v-if="currentOrder" class="order-content">
                    <!-- 订单操作按钮 - 右上角浮动 -->
                    <div class="order-action-buttons">
                      <t-button
                        size="small"
                        variant="outline"
                        class="action-btn edit-btn"
                        @click="handleEditOrder(currentOrder)">
                        <template #icon>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                            <path
                              d="M12.854 2.854a.5.5 0 00-.708 0L11 4l1.5 1.5 1.146-1.146a.5.5 0 000-.708l-.792-.792zM10 5l-7.5 7.5V14h1.5l7.5-7.5L10 5z" />
                          </svg>
                        </template>
                        编辑
                      </t-button>
                      <t-button
                        size="small"
                        variant="outline"
                        theme="danger"
                        class="action-btn delete-btn"
                        @click="handleDeleteOrder(currentOrder.id)">
                        <template #icon>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                            <path
                              d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z" />
                            <path
                              fill-rule="evenodd"
                              d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                          </svg>
                        </template>
                        删除
                      </t-button>
                    </div>

                    <!-- 订单基本信息 -->
                    <div class="info-section">
                      <h3 class="section-title">订单基本信息</h3>
                      <div class="info-grid">
                        <div class="info-item">
                          <span class="info-label">询盘日期</span>
                          <span class="info-value">{{
                            currentOrder.order_inquiry_date
                              ? dayjs(currentOrder.order_inquiry_date).format('YYYY-MM-DD')
                              : '暂无'
                          }}</span>
                        </div>
                        <div class="info-item">
                          <span class="info-label">订单编号</span>
                          <span class="info-value highlight">{{ currentOrder.order_num }}</span>
                        </div>
                        <div class="info-item">
                          <span class="info-label">收款账号</span>
                          <span class="info-value">{{ currentOrder.payment_account || '暂无' }}</span>
                        </div>
                        <div class="info-item">
                          <span class="info-label">收款比例</span>
                          <span class="info-value">{{
                            currentOrder.payment_ratio ? currentOrder.payment_ratio + '%' : '暂无'
                          }}</span>
                        </div>
                        <div class="info-item">
                          <span class="info-label">收款日期</span>
                          <span class="info-value">{{
                            currentOrder.payment_date
                              ? dayjs(currentOrder.payment_date).format('YYYY-MM-DD')
                              : '暂无'
                          }}</span>
                        </div>
                        <div class="info-item">
                          <span class="info-label">排产日期</span>
                          <span class="info-value">{{
                            currentOrder.production_date
                              ? dayjs(currentOrder.production_date).format('YYYY-MM-DD')
                              : '暂无'
                          }}</span>
                        </div>
                        <div class="info-item">
                          <span class="info-label">出口方式</span>
                          <span class="info-value">{{ currentOrder.export_method || '暂无' }}</span>
                        </div>
                        <div class="info-item">
                          <span class="info-label">利润</span>
                          <span class="info-value profit">${{ currentOrder.profit || 0 }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- 产品信息 -->
                    <div class="info-section">
                      <h3 class="section-title">产品信息</h3>
                      <div class="info-grid">
                        <div class="info-item">
                          <span class="info-label">产品名称</span>
                          <span class="info-value">{{
                            currentOrder.product_name || clientDetail.product_name
                          }}</span>
                        </div>
                        <div class="info-item">
                          <span class="info-label">产品型号</span>
                          <span class="info-value">{{ currentOrder.product_model || '暂无' }}</span>
                        </div>
                        <div class="info-item">
                          <span class="info-label">产品数量</span>
                          <span class="info-value">{{ currentOrder.product_quantity || '暂无' }}</span>
                        </div>
                        <div class="info-item">
                          <span class="info-label">产品单位</span>
                          <span class="info-value">{{ currentOrder.product_unit || '暂无' }}</span>
                        </div>
                        <div class="info-item">
                          <span class="info-label">产品单价</span>
                          <span class="info-value">{{
                            currentOrder.product_price ? '$' + currentOrder.product_price : '暂无'
                          }}</span>
                        </div>
                      </div>

                      <!-- 详细规格描述 -->
                      <div v-if="currentOrder.product_spec" class="spec-description">
                        <div class="spec-title">详细规格描述</div>
                        <div class="spec-content">
                          {{ currentOrder.product_spec || '暂无详细描述' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </t-tab-panel>
              </t-tabs>
            </t-card>

            <!-- 备注信息卡片 -->
            <t-card :bordered="false" class="remark-card">
              <template #header>
                <div class="card-title-with-icon">
                  <span class="title-icon">📝</span>
                  <span>备注及其他信息</span>
                </div>
              </template>
              <div class="remark-content">
                {{ clientDetail.remark || '暂无备注信息' }}
              </div>
            </t-card>
          </div>

          <!-- 右侧联系信息卡片 -->
          <t-card class="contact-info-card" :bordered="false">
            <template #header>
              <div class="card-title-with-icon">
                <span class="title-icon">📞</span>
                <span>联系信息</span>
              </div>
            </template>
            <div class="contact-info-content">
              <div class="contact-item">
                <div class="contact-label">电子邮件</div>
                <div class="contact-value email">
                  {{ clientDetail.client_email || '暂无' }}
                </div>
              </div>
              <div class="contact-item">
                <div class="contact-label">电话号码</div>
                <div class="contact-value phone">
                  {{ clientDetail.client_phone || '暂无' }}
                </div>
              </div>
            </div>
          </t-card>
        </div>
      </SimpleBar>
    </main>

    <!-- 订单表单弹窗 -->
    <OrderFormDialog
      v-model:visible="orderDialogVisible"
      :client-id="clientID"
      :order="currentEditOrder"
      @success="handleOrderSuccess" />

    <!-- 订单导入弹窗 -->
    <OrderImportDialog
      v-model:visible="orderImportDialogVisible"
      :client-id="clientID"
      @success="handleOrderSuccess" />
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import ChildHeader from '@/components/childHeader.vue'
  import OrderFormDialog from '@/components/OrderFormDialog.vue'
  import OrderImportDialog from '@/components/OrderImportDialog.vue'
  import { useRoute, useRouter } from 'vue-router'
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
  import { EditIcon } from 'tdesign-icons-vue-next'
  import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'

  const route = useRoute()
  const router = useRouter()
  const clientID = Number(route.query.id)
  const clientDetail = ref({})
  const nameInitials = ref('')
  const orderList = ref([]) // 订单列表
  const currentOrder = ref(null) // 当前查看的订单
  const orderNum = ref('')
  const nationalFlag = ref('')

  // 订单弹窗相关
  const orderDialogVisible = ref(false)
  const currentEditOrder = ref(null)

  // 订单导入弹窗
  const orderImportDialogVisible = ref(false)

  // 批量删除相关状态
  const batchDeleteMode = ref(false)
  const selectedOrders = ref([])

  onMounted(() => {
    getClientInfo()
    getClientOrders() // 加载订单列表
  })

  const getClientInfo = async () => {
    const res = await supabase.getClientInfo(clientID)
    if (res.status === 200) {
      clientDetail.value = res.data
      getBaseInfo(res.data)
    }
  }

  // 获取客户的所有订单
  const getClientOrders = async () => {
    try {
      const res = await supabase.getClientOrders(clientID)
      if (res.data && res.data.length > 0) {
        orderList.value = res.data
        orderNum.value = res.data[0].order_num
        currentOrder.value = res.data[0]
      }
    } catch (error) {
      console.error('加载订单失败：', error)
    }
  }

  const getBaseInfo = (value) => {
    const arr = value.client_name?.split(' ')
    nationalFlag.value = `https://flagcdn.com/w40/${value.country_addrev.toLowerCase()}.png`
    if (arr && arr.length >= 2) {
      nameInitials.value = arr[0][0].toUpperCase() + arr[arr.length - 1][0].toUpperCase()
    }
  }

  // 监听订单切换
  watch(orderNum, (newOrderNum) => {
    const order = orderList.value.find((o) => o.order_num === newOrderNum)
    if (order) {
      currentOrder.value = order
    }
  })

  // 跳转到编辑页面
  const handleEdit = () => {
    router.push({
      path: '/add',
      query: { id: clientID },
    })
  }

  // 新增订单
  const handleAddOrder = () => {
    currentEditOrder.value = null
    orderDialogVisible.value = true
  }

  // 导入订单
  const handleImportOrders = () => {
    orderImportDialogVisible.value = true
  }

  // 编辑订单
  const handleEditOrder = (order) => {
    currentEditOrder.value = order
    orderDialogVisible.value = true
  }

  // 删除订单
  const handleDeleteOrder = async (orderId) => {
    const dialog = DialogPlugin.confirm({
      header: '确认删除订单',
      body: '确定要删除这个订单吗？此操作不可恢复！',
      confirmBtn: {
        content: '确认删除',
        theme: 'danger',
      },
      cancelBtn: '取消',
      theme: 'warning',
      onConfirm: async () => {
        try {
          await supabase.deleteOrder(orderId)
          MessagePlugin.success('订单删除成功')
          // 重新加载订单列表
          await getClientOrders()
          dialog.hide()
        } catch (error) {
          MessagePlugin.error('删除订单失败：' + error.message)
        }
      },
      onCancel: () => {
        dialog.hide()
      },
    })
  }

  // 订单保存成功回调
  const handleOrderSuccess = async () => {
    // 重新加载订单列表
    await getClientOrders()
  }

  // 切换批量删除模式
  const toggleBatchDeleteMode = () => {
    batchDeleteMode.value = !batchDeleteMode.value
    if (!batchDeleteMode.value) {
      selectedOrders.value = []
    }
  }

  // 检查订单是否被选中
  const isOrderSelected = (orderId) => {
    return selectedOrders.value.includes(orderId)
  }

  // 切换订单选择状态
  const toggleOrderSelection = (orderId) => {
    const index = selectedOrders.value.indexOf(orderId)
    if (index > -1) {
      selectedOrders.value.splice(index, 1)
    } else {
      selectedOrders.value.push(orderId)
    }
  }

  // 批量删除订单
  const handleBatchDeleteOrders = async () => {
    if (selectedOrders.value.length === 0) {
      MessagePlugin.warning('请先选择要删除的订单！')
      return
    }

    const dialog = DialogPlugin.confirm({
      header: '批量删除确认',
      body: `确定要删除选中的 ${selectedOrders.value.length} 个订单吗？此操作不可恢复！`,
      confirmBtn: {
        content: '确认删除',
        theme: 'danger',
      },
      cancelBtn: '取消',
      theme: 'warning',
      onConfirm: async () => {
        try {
          await supabase.deleteOrders(selectedOrders.value)
          MessagePlugin.success(`成功删除 ${selectedOrders.value.length} 个订单！`)
          selectedOrders.value = []
          batchDeleteMode.value = false
          // 重新加载订单列表
          await getClientOrders()
          dialog.hide()
        } catch (error) {
          MessagePlugin.error('批量删除订单失败：' + error.message)
        }
      },
      onCancel: () => {
        dialog.hide()
      },
    })
  }
</script>

<style scoped lang="scss">
  .client-detail-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--color-bg-layout);
  }

  .detail-main-container {
    flex: 1;
    overflow: hidden;
  }

  .main-content {
    padding: var(--spacing-lg);
    display: flex;
    gap: var(--spacing-lg);
    overflow-x: hidden; // 防止整个页面横向滚动
  }

  .left-content {
    flex: 1;
    min-width: 0; // 允许flex子元素缩小到内容以下
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  /* 客户基本信息卡片 */
  .client-info-card {
    box-shadow: var(--shadow-base);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: box-shadow var(--transition-base);

    &:hover {
      box-shadow: var(--shadow-md);
    }

    :deep(.t-card__body) {
      padding: var(--spacing-lg);
    }

    .card-header-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-lg);
      border-bottom: 1px solid var(--color-border-light);
    }

    .client-avatar-section {
      display: flex;
      gap: var(--spacing-base);
      flex: 1;
    }

    .client-avatar {
      flex-shrink: 0;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
      color: white;
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-semibold);
      box-shadow: var(--shadow-md);
    }

    .client-basic-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .client-name {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0;
      line-height: var(--line-height-tight);
    }

    .client-badges {
      display: flex;
      gap: var(--spacing-xs);
      flex-wrap: wrap;
    }

    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: white;
      transition: transform var(--transition-base);

      &:hover {
        transform: translateY(-1px);
      }
    }

    .badge-language {
      background: var(--color-primary-light);
      color: var(--color-primary);
    }

    .company-name {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
    }

    .action-section {
      flex-shrink: 0;
    }

    .edit-btn {
      height: 40px;
      padding: 0 var(--spacing-base);
      border-radius: var(--radius-base);
      font-weight: var(--font-weight-medium);
      transition: all var(--transition-base);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(91, 141, 239, 0.3);
      }
    }

    .client-meta-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: var(--font-size-base);
    }

    .meta-label {
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-medium);
    }

    .meta-text {
      color: var(--color-text-primary);
      font-weight: var(--font-weight-medium);

      &.secondary {
        color: var(--color-text-secondary);
      }
    }

    .country-flag {
      width: 24px;
      height: auto;
      border-radius: 2px;
      box-shadow: var(--shadow-sm);
    }
  }

  /* 订单信息卡片 */
  .order-info-card,
  .remark-card {
    box-shadow: var(--shadow-base);
    border-radius: var(--radius-lg);
    transition: box-shadow var(--transition-base);

    &:hover {
      box-shadow: var(--shadow-md);
    }

    :deep(.t-card__header) {
      padding: var(--spacing-base) var(--spacing-lg);
      border-bottom: 1px solid var(--color-border-light);
    }

    :deep(.t-card__body) {
      padding: var(--spacing-lg);
      overflow-x: hidden; // 防止订单卡片内容溢出
    }
  }

  .card-title-with-icon {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);

    .title-icon {
      font-size: var(--font-size-2xl);
    }

    .batch-tag {
      margin-left: 8px;
      padding: 2px 12px;
      background: var(--color-warning-light);
      color: var(--color-warning);
      border-radius: 12px;
      font-size: 14px;
      font-weight: 500;
    }
  }

  .card-header-with-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-base);

    .header-actions {
      display: flex;
      gap: var(--spacing-sm);
    }
  }

  .empty-orders {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2xl);
    text-align: center;

    .empty-icon {
      font-size: 48px;
      margin-bottom: var(--spacing-base);
      opacity: 0.5;
    }

    .empty-text {
      font-size: var(--font-size-lg);
      color: var(--color-text-secondary);
    }
  }

  /* 批量删除模式：订单列表视图 */
  .batch-order-list {
    max-height: 600px;
    overflow-y: auto;
    padding: 16px;
  }

  .batch-order-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    margin-bottom: 12px;
    background: var(--color-bg-container);
    border: 2px solid var(--color-border-light);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: var(--color-primary);
      background: rgba(91, 141, 239, 0.05);
      transform: translateX(4px);
    }

    &.selected {
      border-color: var(--color-primary);
      background: rgba(91, 141, 239, 0.1);
      box-shadow: 0 2px 8px rgba(91, 141, 239, 0.2);
    }

    .order-info {
      flex: 1;
      min-width: 0;
    }

    .order-main-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 6px;

      .order-number {
        font-size: 16px;
        font-weight: 600;
        color: var(--color-text-primary);
      }

      .order-product {
        font-size: 14px;
        color: var(--color-text-secondary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .order-meta {
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 13px;
      color: var(--color-text-tertiary);

      .order-date,
      .order-profit {
        display: flex;
        align-items: center;
      }

      .order-profit {
        color: var(--color-success);
        font-weight: 500;
      }
    }
  }

  .order-tabs {
    // 防止标签栏过宽导致页面横向滚动
    :deep(.t-tabs__nav-wrap) {
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: thin; // Firefox 窄滚动条

      // 自定义滚动条样式（Chrome/Safari）
      &::-webkit-scrollbar {
        height: 6px;
      }

      &::-webkit-scrollbar-track {
        background: var(--color-bg-layout);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--color-text-placeholder);
        border-radius: 3px;

        &:hover {
          background: var(--color-text-secondary);
        }
      }
    }

    :deep(.t-tabs__nav) {
      flex-wrap: nowrap; // 不换行，允许横向滚动
    }

    :deep(.t-tabs__nav-item) {
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
      transition: color var(--transition-base);
      flex-shrink: 0; // 标签不压缩，保持原始宽度
      white-space: nowrap; // 标签文字不换行

      &.t-is-active {
        color: var(--color-primary);
      }
    }
  }

  .order-content {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    padding-top: var(--spacing-base);
  }

  .order-action-buttons {
    position: absolute;
    top: 14px;
    right: 0;
    display: flex;
    gap: var(--spacing-xs);
    z-index: 10;

    .action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: var(--radius-base);
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-sm);
      transition: all var(--transition-base);
      box-shadow: var(--shadow-sm);

      &.edit-btn {
        border-color: var(--color-primary);
        color: var(--color-primary);

        &:hover {
          background: var(--color-primary);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(var(--color-primary-rgb, 91, 141, 239), 0.3);
        }
      }

      &.delete-btn {
        border-color: var(--color-error);
        color: var(--color-error);

        &:hover {
          background: var(--color-error);
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(229, 72, 77, 0.3);
        }
      }

      svg {
        flex-shrink: 0;
      }
    }
  }

  .info-section {
    .section-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0 0 var(--spacing-base) 0;
      padding-bottom: var(--spacing-sm);
      border-bottom: 2px solid var(--color-primary-light);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: var(--spacing-base);
      margin-bottom: var(--spacing-base);
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: var(--spacing-sm);
      background: var(--color-bg-layout);
      border-radius: var(--radius-base);
      transition: all var(--transition-base);

      &:hover {
        background: var(--color-primary-light);
        transform: translateY(-2px);
      }
    }

    .info-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      font-weight: var(--font-weight-medium);
    }

    .info-value {
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      font-weight: var(--font-weight-medium);

      &.highlight {
        color: var(--color-primary);
        font-weight: var(--font-weight-semibold);
      }

      &.profit {
        color: var(--color-success);
        font-weight: var(--font-weight-semibold);
        font-size: var(--font-size-lg);
      }
    }

    .spec-description {
      margin-top: var(--spacing-base);
    }

    .spec-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-sm);
    }

    .spec-content {
      padding: var(--spacing-base);
      background: var(--color-bg-layout);
      border-radius: var(--radius-base);
      border-left: 3px solid var(--color-primary);
      color: var(--color-text-secondary);
      line-height: var(--line-height-relaxed);
      white-space: pre-wrap;
    }
  }

  /* 备注卡片 */
  .remark-content {
    padding: var(--spacing-base);
    background: var(--color-bg-layout);
    border-radius: var(--radius-base);
    color: var(--color-text-secondary);
    line-height: var(--line-height-relaxed);
    white-space: pre-wrap;
    min-height: 80px;
  }

  /* 联系信息卡片 */
  .contact-info-card {
    width: 360px;
    flex-shrink: 0;
    position: sticky;
    top: var(--spacing-lg);
    height: fit-content;
    box-shadow: var(--shadow-base);
    border-radius: var(--radius-lg);
    transition: box-shadow var(--transition-base);

    &:hover {
      box-shadow: var(--shadow-md);
    }

    :deep(.t-card__header) {
      padding: var(--spacing-base) var(--spacing-lg);
      border-bottom: 1px solid var(--color-border-light);
    }

    :deep(.t-card__body) {
      padding: var(--spacing-base);
    }
  }

  .contact-info-content {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .contact-item {
    padding: var(--spacing-base);
    border-bottom: 1px solid var(--color-border-light);
    transition: background var(--transition-base);

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: var(--color-bg-layout);
    }

    .contact-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-bottom: 4px;
      font-weight: var(--font-weight-medium);
    }

    .contact-value {
      font-size: var(--font-size-base);
      color: var(--color-primary);
      font-weight: var(--font-weight-medium);
      word-break: break-all;

      &.email,
      &.phone {
        cursor: pointer;
        transition: color var(--transition-base);

        &:hover {
          color: var(--color-primary-hover);
          text-decoration: underline;
        }
      }
    }
  }

  /* 响应式设计 */
  @media (max-width: 1024px) {
    .main-content {
      flex-direction: column;
    }

    .contact-info-card {
      width: 100%;
      position: static;
    }
  }

  @media (max-width: 640px) {
    .main-content {
      padding: var(--spacing-sm);
    }

    .client-info-card {
      .card-header-section {
        flex-direction: column;
        gap: var(--spacing-base);
      }

      .client-avatar-section {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .action-section {
        width: 100%;

        .edit-btn {
          width: 100%;
        }
      }
    }

    .info-section .info-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
