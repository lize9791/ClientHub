<template>
  <div class="order-form-card">
    <!-- 卡片头部 -->
    <div class="card-header" @click="toggleCollapse">
      <div class="header-left">
        <span class="order-icon">📦</span>
        <span class="order-title">{{ orderData.order_num || '新订单' }}</span>
        <t-tag v-if="orderData.id" theme="success" variant="light" size="small">
          {{ orderStatusMap[orderData.order_status] }}
        </t-tag>
        <t-tag v-else theme="primary" variant="light" size="small">待保存</t-tag>
      </div>
      <div class="header-right">
        <span v-if="orderData.profit" class="profit-badge">${{ orderData.profit }}</span>
        <t-icon :name="collapsed ? 'chevron-down' : 'chevron-up'" size="20px" />
      </div>
    </div>

    <!-- 卡片内容（可折叠） -->
    <div v-show="!collapsed" class="card-body">
      <t-form ref="formRef" :data="orderData" :rules="rules" colon>
        <!-- 基本信息 -->
        <div class="form-section">
          <h4 class="section-subtitle">基本信息</h4>

          <t-form-item label="订单编号" name="order_num">
            <t-input v-model="orderData.order_num" placeholder="请输入订单编号" clearable />
          </t-form-item>

          <t-form-item label="询盘日期" name="order_inquiry_date">
            <t-date-picker
              v-model="orderData.order_inquiry_date"
              placeholder="请选择询盘日期"
              style="width: 100%" />
          </t-form-item>

          <div class="profit-group">
            <t-form-item label="利润 (美元)" name="profit" class="profit-input">
              <t-input-number
                v-model="orderData.profit"
                theme="normal"
                placeholder="请输入利润"
                style="width: 100%" />
            </t-form-item>
            <div class="exchange-info">
              <div class="exchange-rate">汇率: 7</div>
              <div class="rmb-value">≈ ￥{{ Math.round((orderData.profit || 0) * 7 * 1000) / 1000 }}</div>
            </div>
          </div>
        </div>

        <!-- 收款信息 -->
        <div class="form-section">
          <h4 class="section-subtitle">💳 收款信息</h4>

          <t-form-item label="收款账号" name="payment_account">
            <t-input v-model="orderData.payment_account" placeholder="请输入收款账号" clearable />
          </t-form-item>

          <t-form-item label="收款比例 (%)" name="payment_ratio">
            <t-input-number
              v-model="orderData.payment_ratio"
              placeholder="请输入收款比例"
              min="0"
              max="100"
              theme="normal"
              style="width: 100%" />
          </t-form-item>

          <div class="date-group">
            <t-form-item label="收款日期" name="payment_date" class="date-item">
              <t-date-picker
                v-model="orderData.payment_date"
                placeholder="请选择收款日期"
                style="width: 100%" />
            </t-form-item>
            <t-form-item label="排产日期" name="production_date" class="date-item">
              <t-date-picker
                v-model="orderData.production_date"
                placeholder="请选择排产日期"
                style="width: 100%" />
            </t-form-item>
          </div>

          <t-form-item label="出口方式" name="export_method">
            <t-input v-model="orderData.export_method" placeholder="请输入出口方式" clearable />
          </t-form-item>
        </div>

        <!-- 产品信息 -->
        <div class="form-section">
          <h4 class="section-subtitle">📦 产品信息</h4>

          <t-form-item label="产品名称" name="product_name">
            <t-input v-model="orderData.product_name" placeholder="请输入产品名称" clearable />
          </t-form-item>

          <t-form-item label="产品型号" name="product_model">
            <t-input v-model="orderData.product_model" placeholder="请输入产品型号" clearable />
          </t-form-item>

          <div class="quantity-price-group">
            <t-form-item label="产品数量" name="product_quantity" class="quantity-item">
              <t-input-number
                v-model="orderData.product_quantity"
                placeholder="数量"
                min="0"
                theme="normal"
                style="width: 100%" />
            </t-form-item>
            <t-form-item label="产品单价" name="product_price" class="price-item">
              <t-input-number
                v-model="orderData.product_price"
                placeholder="单价"
                min="0"
                theme="normal"
                style="width: 100%" />
            </t-form-item>
          </div>

          <t-form-item label="产品单位" name="product_unit">
            <t-input v-model="orderData.product_unit" placeholder="请输入产品单位" clearable />
          </t-form-item>

          <t-form-item label="详细规格描述" name="product_spec">
            <t-textarea
              v-model="orderData.product_spec"
              placeholder="请输入规格的详细描述"
              :autosize="{ minRows: 3, maxRows: 6 }"
              clearable />
          </t-form-item>

          <t-form-item label="订单状态" name="order_status">
            <t-select v-model="orderData.order_status" :options="orderStatusOptions" />
          </t-form-item>
        </div>

        <!-- 操作按钮 -->
        <div class="form-actions">
          <t-button v-if="orderData.id" theme="danger" variant="outline" @click="handleDelete">
            删除订单
          </t-button>
          <t-space>
            <t-button theme="default" variant="outline" @click="handleCancel">取消</t-button>
            <t-button theme="primary" @click="handleSave">保存订单</t-button>
          </t-space>
        </div>
      </t-form>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, watch } from 'vue'
  import { MessagePlugin } from 'tdesign-vue-next'
  import dayjs from 'dayjs'

  const props = defineProps({
    // 订单数据（编辑模式传入）
    order: {
      type: Object,
      default: () => ({}),
    },
    // 是否默认展开
    defaultExpanded: {
      type: Boolean,
      default: true,
    },
  })

  const emit = defineEmits(['save', 'delete', 'cancel'])

  // 订单状态映射
  const orderStatusMap = {
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消',
  }

  const orderStatusOptions = [
    { label: '进行中', value: 'in_progress' },
    { label: '已完成', value: 'completed' },
    { label: '已取消', value: 'cancelled' },
  ]

  // 是否折叠
  const collapsed = ref(!props.defaultExpanded)

  // 表单引用
  const formRef = ref(null)

  // 订单数据
  const orderData = reactive({
    id: props.order.id || null,
    order_num: props.order.order_num || '',
    order_inquiry_date: props.order.order_inquiry_date || '',
    profit: props.order.profit || null,
    payment_account: props.order.payment_account || '',
    payment_ratio: props.order.payment_ratio || null,
    payment_date: props.order.payment_date || '',
    production_date: props.order.production_date || '',
    export_method: props.order.export_method || '',
    product_name: props.order.product_name || '',
    product_model: props.order.product_model || '',
    product_quantity: props.order.product_quantity || null,
    product_unit: props.order.product_unit || '',
    product_price: props.order.product_price || null,
    product_spec: props.order.product_spec || '',
    order_status: props.order.order_status || 'in_progress',
  })

  // 监听props变化
  watch(
    () => props.order,
    (newOrder) => {
      if (newOrder && newOrder.id) {
        Object.assign(orderData, newOrder)
      }
    },
    { deep: true }
  )

  // 表单验证规则
  const rules = {
    order_num: [{ required: true, message: '请输入订单编号', trigger: 'blur' }],
    product_name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  }

  // 切换折叠状态
  const toggleCollapse = () => {
    collapsed.value = !collapsed.value
  }

  // 保存订单
  const handleSave = async () => {
    const valid = await formRef.value.validate()
    if (valid === true) {
      emit('save', { ...orderData })
    } else {
      MessagePlugin.warning('请填写必填字段')
    }
  }

  // 删除订单
  const handleDelete = () => {
    emit('delete', orderData.id)
  }

  // 取消
  const handleCancel = () => {
    emit('cancel')
  }
</script>

<style scoped lang="scss">
  .order-form-card {
    background: var(--color-bg-container);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border-light);
    margin-bottom: var(--spacing-base);
    transition: all var(--transition-base);

    &:hover {
      border-color: var(--color-primary-light);
      box-shadow: var(--shadow-base);
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-base) var(--spacing-lg);
    cursor: pointer;
    user-select: none;
    transition: background var(--transition-base);

    &:hover {
      background: var(--color-bg-layout);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      flex: 1;

      .order-icon {
        font-size: var(--font-size-xl);
      }

      .order-title {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text-primary);
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);

      .profit-badge {
        padding: 4px 12px;
        background: var(--color-success-light);
        color: var(--color-success);
        border-radius: var(--radius-base);
        font-weight: var(--font-weight-semibold);
        font-size: var(--font-size-sm);
      }
    }
  }

  .card-body {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-border-light);
  }

  .form-section {
    margin-bottom: var(--spacing-lg);

    &:last-child {
      margin-bottom: 0;
    }

    .section-subtitle {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0 0 var(--spacing-base) 0;
      padding-bottom: var(--spacing-xs);
      border-bottom: 1px solid var(--color-border-light);
    }
  }

  .profit-group {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--spacing-base);
    align-items: start;

    .profit-input {
      margin-bottom: 0;
    }

    .exchange-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-top: 28px;
      min-width: 140px;

      .exchange-rate {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        font-weight: var(--font-weight-medium);
      }

      .rmb-value {
        font-size: var(--font-size-lg);
        color: var(--color-error);
        font-weight: var(--font-weight-semibold);
      }
    }
  }

  .date-group,
  .quantity-price-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-base);

    .date-item,
    .quantity-item,
    .price-item {
      margin-bottom: 0;
    }
  }

  .form-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--spacing-base);
    border-top: 1px solid var(--color-border-light);
    margin-top: var(--spacing-lg);
  }

  :deep(.t-form__item) {
    margin-bottom: var(--spacing-base);
  }

  :deep(.t-form__label) {
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
  }

  /* 响应式 */
  @media (max-width: 768px) {
    .profit-group,
    .date-group,
    .quantity-price-group {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column;
      gap: var(--spacing-sm);

      button {
        width: 100%;
      }
    }
  }
</style>
