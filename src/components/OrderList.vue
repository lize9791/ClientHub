<template>
  <div class="order-list-container">
    <div class="list-header">
      <div class="header-info">
        <h3 class="list-title">💰 订单管理</h3>
        <t-tag theme="primary" variant="light">{{ orders.length }} 个订单</t-tag>
      </div>
      <t-button theme="primary" size="small" @click="handleAddOrder">
        <template #icon>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z" />
          </svg>
        </template>
        新增订单
      </t-button>
    </div>

    <div v-if="orders.length === 0 && !showNewOrderForm" class="empty-state">
      <div class="empty-icon">📦</div>
      <div class="empty-text">暂无订单</div>
      <div class="empty-hint">点击"新增订单"按钮添加第一个订单</div>
    </div>

    <div class="orders-list">
      <!-- 新增订单表单 -->
      <OrderForm
        v-if="showNewOrderForm"
        :default-expanded="true"
        @save="handleSaveNewOrder"
        @cancel="handleCancelNewOrder" />

      <!-- 现有订单列表 -->
      <OrderForm
        v-for="order in orders"
        :key="order.id || order.tempId"
        :order="order"
        :default-expanded="false"
        @save="handleUpdateOrder"
        @delete="handleDeleteOrder" />
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { MessagePlugin, DialogPlugin } from 'tdesign-vue-next'
  import OrderForm from './OrderForm.vue'
  import supabase from '@/request/supabase.js'

  const props = defineProps({
    // 客户ID（编辑模式时传入）
    clientId: {
      type: Number,
      default: null,
    },
    // 初始订单列表（用于新增客户时的临时订单）
    initialOrders: {
      type: Array,
      default: () => [],
    },
  })

  const emit = defineEmits(['update:orders'])

  // 订单列表
  const orders = ref([])
  // 是否显示新订单表单
  const showNewOrderForm = ref(false)
  // 临时ID计数器
  let tempIdCounter = 1

  // 初始化订单列表
  const initOrders = async () => {
    if (props.clientId) {
      // 编辑模式：从数据库加载订单
      try {
        const res = await supabase.getClientOrders(props.clientId)
        if (res.data) {
          orders.value = res.data
        }
      } catch (error) {
        MessagePlugin.error('加载订单失败：' + error.message)
      }
    } else {
      // 新增模式：使用传入的初始订单
      orders.value = props.initialOrders.map((order) => ({
        ...order,
        tempId: tempIdCounter++,
      }))
    }
  }

  // 监听clientId变化
  watch(
    () => props.clientId,
    () => {
      initOrders()
    },
    { immediate: true }
  )

  // 新增订单
  const handleAddOrder = () => {
    showNewOrderForm.value = true
  }

  // 保存新订单
  const handleSaveNewOrder = async (orderData) => {
    if (props.clientId) {
      // 编辑模式：直接保存到数据库
      try {
        const res = await supabase.createOrder({
          ...orderData,
          client_id: props.clientId,
        })
        if (res.data) {
          orders.value.unshift(res.data)
          showNewOrderForm.value = false
          MessagePlugin.success('订单添加成功')
          emit('update:orders', orders.value)
        }
      } catch (error) {
        MessagePlugin.error('添加订单失败：' + error.message)
      }
    } else {
      // 新增模式：添加到临时列表
      orders.value.unshift({
        ...orderData,
        tempId: tempIdCounter++,
      })
      showNewOrderForm.value = false
      MessagePlugin.success('订单已添加到列表')
      emit('update:orders', orders.value)
    }
  }

  // 取消新增订单
  const handleCancelNewOrder = () => {
    showNewOrderForm.value = false
  }

  // 更新订单
  const handleUpdateOrder = async (orderData) => {
    if (orderData.id) {
      // 有ID：更新数据库中的订单
      try {
        const res = await supabase.updateOrder(orderData.id, orderData)
        if (res.data) {
          const index = orders.value.findIndex((o) => o.id === orderData.id)
          if (index !== -1) {
            orders.value[index] = res.data
          }
          MessagePlugin.success('订单更新成功')
          emit('update:orders', orders.value)
        }
      } catch (error) {
        MessagePlugin.error('更新订单失败：' + error.message)
      }
    } else {
      // 无ID：更新临时列表中的订单
      const index = orders.value.findIndex((o) => o.tempId === orderData.tempId)
      if (index !== -1) {
        orders.value[index] = orderData
        MessagePlugin.success('订单已更新')
        emit('update:orders', orders.value)
      }
    }
  }

  // 删除订单
  const handleDeleteOrder = async (orderId) => {
    const confirmResult = await DialogPlugin.confirm({
      header: '确认删除',
      body: '确定要删除这个订单吗？此操作不可恢复。',
      confirmBtn: '确认删除',
      cancelBtn: '取消',
    })

    if (confirmResult) {
      if (typeof orderId === 'number') {
        // 有ID：从数据库删除
        try {
          await supabase.deleteOrder(orderId)
          orders.value = orders.value.filter((o) => o.id !== orderId)
          MessagePlugin.success('订单删除成功')
          emit('update:orders', orders.value)
        } catch (error) {
          MessagePlugin.error('删除订单失败：' + error.message)
        }
      } else {
        // 无ID：从临时列表删除
        orders.value = orders.value.filter((o) => o.tempId !== orderId)
        MessagePlugin.success('订单已删除')
        emit('update:orders', orders.value)
      }
    }
  }

  // 暴露方法供父组件调用
  defineExpose({
    getOrders: () => orders.value,
    saveAllOrders: async (clientId) => {
      // 保存所有临时订单到数据库
      const tempOrders = orders.value.filter((o) => !o.id)
      if (tempOrders.length > 0) {
        try {
          const ordersData = tempOrders.map((order) => ({
            ...order,
            client_id: clientId,
          }))
          const res = await supabase.createOrders(ordersData)
          if (res.data) {
            MessagePlugin.success(`成功保存 ${res.data.length} 个订单`)
            return true
          }
        } catch (error) {
          MessagePlugin.error('保存订单失败：' + error.message)
          return false
        }
      }
      return true
    },
  })
</script>

<style scoped lang="scss">
  .order-list-container {
    width: 100%;
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
    padding: var(--spacing-base) var(--spacing-lg);
    background: var(--color-bg-container);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);

    .header-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);

      .list-title {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
        margin: 0;
      }
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2xl) var(--spacing-lg);
    background: var(--color-bg-container);
    border-radius: var(--radius-lg);
    border: 2px dashed var(--color-border-base);

    .empty-icon {
      font-size: 48px;
      margin-bottom: var(--spacing-base);
      opacity: 0.5;
    }

    .empty-text {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-xs);
    }

    .empty-hint {
      font-size: var(--font-size-sm);
      color: var(--color-text-tertiary);
    }
  }

  .orders-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-base);
  }
</style>
