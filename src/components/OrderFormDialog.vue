<template>
  <t-dialog
    v-model:visible="dialogVisible"
    :header="dialogTitle"
    width="800px"
    :confirm-btn="null"
    :cancel-btn="null"
    @close="handleClose">
    <div class="order-form-dialog-content">
      <t-form ref="formRef" :data="orderData" :rules="rules" colon label-width="120px">
        <!-- 基本信息 -->
        <div class="form-section">
          <h4 class="section-title">📦 基本信息</h4>

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

          <t-form-item label="订单状态" name="order_status">
            <t-select v-model="orderData.order_status" :options="orderStatusOptions" />
          </t-form-item>
        </div>

        <!-- 收款信息 -->
        <div class="form-section">
          <h4 class="section-title">💳 收款信息</h4>

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
            <t-form-item label="收款日期" name="payment_date" style="width: 48%">
              <t-date-picker
                v-model="orderData.payment_date"
                placeholder="请选择收款日期"
                style="width: 100%" />
            </t-form-item>
            <t-form-item label="排产日期" name="production_date" style="width: 48%">
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
          <h4 class="section-title">📦 产品信息</h4>

          <t-form-item label="产品名称" name="product_name">
            <t-input v-model="orderData.product_name" placeholder="请输入产品名称" clearable />
          </t-form-item>

          <t-form-item label="产品型号" name="product_model">
            <t-input v-model="orderData.product_model" placeholder="请输入产品型号" clearable />
          </t-form-item>

          <div class="quantity-price-group">
            <t-form-item label="产品数量" name="product_quantity" style="width: 48%">
              <t-input-number
                v-model="orderData.product_quantity"
                placeholder="数量"
                min="0"
                theme="normal"
                style="width: 100%" />
            </t-form-item>
            <t-form-item label="产品单价" name="product_price" style="width: 48%">
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
        </div>
      </t-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <t-button theme="default" variant="outline" @click="handleClose">取消</t-button>
        <t-button theme="primary" @click="handleSave" :loading="saving">保存订单</t-button>
      </div>
    </template>
  </t-dialog>
</template>

<script setup>
  import { ref, reactive, computed, watch } from 'vue'
  import { MessagePlugin } from 'tdesign-vue-next'
  import supabase from '@/request/supabase.js'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    clientId: {
      type: Number,
      required: true,
    },
    order: {
      type: Object,
      default: null,
    },
  })

  const emit = defineEmits(['update:visible', 'success'])

  const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
  })

  const dialogTitle = computed(() => (props.order ? '编辑订单' : '新增订单'))

  const formRef = ref(null)
  const saving = ref(false)

  const orderStatusOptions = [
    { label: '进行中', value: 'in_progress' },
    { label: '已完成', value: 'completed' },
    { label: '已取消', value: 'cancelled' },
  ]

  const orderData = reactive({
    id: null,
    order_num: '',
    order_inquiry_date: '',
    profit: null,
    payment_account: '',
    payment_ratio: null,
    payment_date: '',
    production_date: '',
    export_method: '',
    product_name: '',
    product_model: '',
    product_quantity: null,
    product_unit: '',
    product_price: null,
    product_spec: '',
    order_status: 'in_progress',
  })

  // 表单验证规则
  const rules = {
    order_num: [{ required: true, message: '请输入订单编号', trigger: 'blur' }],
    product_name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  }

  // 监听订单数据变化，填充表单
  watch(
    () => props.order,
    (newOrder) => {
      if (newOrder) {
        Object.assign(orderData, {
          id: newOrder.id,
          order_num: newOrder.order_num || '',
          order_inquiry_date: newOrder.order_inquiry_date || '',
          profit: newOrder.profit || null,
          payment_account: newOrder.payment_account || '',
          payment_ratio: newOrder.payment_ratio || null,
          payment_date: newOrder.payment_date || '',
          production_date: newOrder.production_date || '',
          export_method: newOrder.export_method || '',
          product_name: newOrder.product_name || '',
          product_model: newOrder.product_model || '',
          product_quantity: newOrder.product_quantity || null,
          product_unit: newOrder.product_unit || '',
          product_price: newOrder.product_price || null,
          product_spec: newOrder.product_spec || '',
          order_status: newOrder.order_status || 'in_progress',
        })
      }
    },
    { immediate: true }
  )

  // 监听对话框打开，清空表单（新增模式）
  watch(dialogVisible, (val) => {
    if (val && !props.order) {
      // 新增模式，重置表单
      Object.assign(orderData, {
        id: null,
        order_num: '',
        order_inquiry_date: '',
        profit: null,
        payment_account: '',
        payment_ratio: null,
        payment_date: '',
        production_date: '',
        export_method: '',
        product_name: '',
        product_model: '',
        product_quantity: null,
        product_unit: '',
        product_price: null,
        product_spec: '',
        order_status: 'in_progress',
      })
    }
  })

  const handleClose = () => {
    dialogVisible.value = false
  }

  const handleSave = async () => {
    const valid = await formRef.value.validate()
    if (valid !== true) {
      MessagePlugin.warning('请填写必填字段')
      return
    }

    saving.value = true
    try {
      // 处理数据：空字符串转null（避免数据库date类型报错）
      const processedData = { ...orderData }
      const dateFields = ['order_inquiry_date', 'payment_date', 'production_date']
      dateFields.forEach((field) => {
        if (processedData[field] === '') {
          processedData[field] = null
        }
      })

      if (orderData.id) {
        // 更新订单
        const res = await supabase.updateOrder(orderData.id, processedData)
        if (res.data) {
          MessagePlugin.success('订单更新成功')
          emit('success')
          dialogVisible.value = false
        }
      } else {
        // 创建订单 - 排除id字段，让数据库自动生成
        const { id, ...orderDataWithoutId } = processedData
        const res = await supabase.createOrder({
          ...orderDataWithoutId,
          client_id: props.clientId,
        })
        if (res.data) {
          MessagePlugin.success('订单创建成功')
          emit('success')
          dialogVisible.value = false
        }
      }
    } catch (error) {
      MessagePlugin.error('保存订单失败：' + error.message)
    } finally {
      saving.value = false
    }
  }
</script>

<style scoped lang="scss">
  .order-form-dialog-content {
    max-height: 70vh;
    overflow-y: auto;
    padding: var(--spacing-base);
  }

  .form-section {
    margin-bottom: var(--spacing-lg);

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0 0 var(--spacing-base) 0;
      padding-bottom: var(--spacing-xs);
      border-bottom: 2px solid var(--color-primary-light);
    }
  }

  .profit-group {
    display: flex;
    gap: var(--spacing-base);
    align-items: flex-start;

    .profit-input {
      flex: 1;
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
    display: flex;
    justify-content: space-between;
    gap: var(--spacing-base);
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
  }

  :deep(.t-form__item) {
    margin-bottom: var(--spacing-base);
  }

  :deep(.t-form__label) {
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
  }
</style>
