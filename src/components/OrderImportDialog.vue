<template>
  <t-dialog
    v-model:visible="dialogVisible"
    header="导入订单"
    width="1000px"
    :confirm-btn="null"
    :cancel-btn="null"
    @close="handleClose">
    <div class="import-dialog-content">
      <!-- 上传区域 -->
      <div v-if="!parsedData.length" class="upload-section">
        <div class="upload-tips">
          <div class="tip-item">
            <span class="tip-icon">📄</span>
            <span class="tip-text">支持上传 .xlsx 或 .csv 格式的订单文件</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon">⬇️</span>
            <span class="tip-text">
              请先下载
              <t-link theme="primary" @click="downloadTemplate">订单模板</t-link>
              ，按照模板格式填写订单信息
            </span>
          </div>
          <div class="tip-item">
            <span class="tip-icon">✅</span>
            <span class="tip-text">订单编号和产品名称为必填项</span>
          </div>
        </div>

        <t-upload
          v-model="fileList"
          theme="file"
          accept=".xlsx,.xls,.csv"
          :auto-upload="false"
          :max="1"
          :size-limit="{ size: 5, unit: 'MB' }"
          @change="handleFileChange">
          <template #file-list-display>
            <div></div>
          </template>
        </t-upload>

        <div v-if="fileList.length > 0" class="file-info">
          <div class="file-name">
            <span class="file-icon">📎</span>
            {{ fileList[0].name }}
          </div>
          <t-button theme="primary" @click="parseFile" :loading="parsing">
            开始解析
          </t-button>
        </div>
      </div>

      <!-- 预览区域 -->
      <div v-else class="preview-section">
        <div class="preview-header">
          <div class="preview-info">
            <span class="info-label">共解析到</span>
            <span class="info-value">{{ parsedData.length }}</span>
            <span class="info-label">条订单数据</span>
            <span v-if="errorData.length > 0" class="error-count">
              （{{ errorData.length }} 条数据有错误）
            </span>
          </div>
          <t-button theme="default" variant="outline" size="small" @click="resetImport">
            重新上传
          </t-button>
        </div>

        <!-- 错误提示 -->
        <div v-if="errorData.length > 0" class="error-alert">
          <t-alert theme="warning" :message="`以下 ${errorData.length} 条数据验证失败，将不会被导入`" />
          <div class="error-list">
            <div v-for="(error, index) in errorData" :key="index" class="error-item">
              <span class="error-row">第 {{ error.row }} 行：</span>
              <span class="error-msg">{{ error.message }}</span>
            </div>
          </div>
        </div>

        <!-- 数据预览表格 -->
        <div class="preview-table">
          <t-table
            :data="validData"
            :columns="previewColumns"
            row-key="index"
            :max-height="400"
            size="small"
            bordered
            stripe>
            <template #order_status="{ row }">
              <t-tag :theme="getStatusTheme(row.order_status)" size="small">
                {{ orderStatusMap[row.order_status] || '进行中' }}
              </t-tag>
            </template>
            <template #profit="{ row }">
              <span class="profit-value">${{ row.profit || 0 }}</span>
            </template>
          </t-table>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <t-button theme="default" variant="outline" @click="handleClose">取消</t-button>
        <t-button
          v-if="parsedData.length > 0"
          theme="primary"
          @click="handleImport"
          :loading="importing"
          :disabled="validData.length === 0">
          导入 {{ validData.length }} 条订单
        </t-button>
      </div>
    </template>
  </t-dialog>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { MessagePlugin } from 'tdesign-vue-next'
  import * as XLSX from 'xlsx'
  import supabase from '@/request/supabase.js'
  import dayjs from 'dayjs'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    clientId: {
      type: Number,
      required: true,
    },
  })

  const emit = defineEmits(['update:visible', 'success'])

  const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
  })

  // 订单状态映射
  const orderStatusMap = {
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消',
    进行中: 'in_progress',
    已完成: 'completed',
    已取消: 'cancelled',
  }

  // 文件列表
  const fileList = ref([])
  // 解析中
  const parsing = ref(false)
  // 导入中
  const importing = ref(false)
  // 解析后的数据
  const parsedData = ref([])
  // 验证错误数据
  const errorData = ref([])

  // 有效数据
  const validData = computed(() => {
    return parsedData.value.filter((item) => !item._error)
  })

  // 预览表格列
  const previewColumns = [
    { colKey: 'index', title: '序号', width: 60, align: 'center' },
    { colKey: 'order_num', title: '订单编号', width: 150 },
    { colKey: 'product_name', title: '产品名称', width: 150 },
    { colKey: 'product_quantity', title: '数量', width: 80 },
    { colKey: 'product_price', title: '单价', width: 80 },
    { colKey: 'profit', title: '利润', width: 100 },
    { colKey: 'order_status', title: '状态', width: 100 },
    { colKey: 'payment_account', title: '收款账号', width: 120 },
  ]

  // 下载模板
  const downloadTemplate = () => {
    const template = [
      {
        订单编号: 'ORDER-001',
        询盘日期: '2024-01-01',
        利润: '1000',
        收款账号: 'ACC-001',
        收款比例: '30',
        收款日期: '2024-01-05',
        排产日期: '2024-01-10',
        出口方式: 'FOB',
        产品名称: '示例产品',
        产品型号: 'MODEL-001',
        产品数量: '100',
        产品单位: 'PCS',
        产品单价: '50',
        产品规格描述: '这是产品规格的详细描述',
        订单状态: '进行中',
      },
    ]

    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '订单模板')

    // 设置列宽
    const colWidths = [
      { wch: 15 }, // 订单编号
      { wch: 12 }, // 询盘日期
      { wch: 10 }, // 利润
      { wch: 15 }, // 收款账号
      { wch: 10 }, // 收款比例
      { wch: 12 }, // 收款日期
      { wch: 12 }, // 排产日期
      { wch: 12 }, // 出口方式
      { wch: 20 }, // 产品名称
      { wch: 15 }, // 产品型号
      { wch: 10 }, // 产品数量
      { wch: 10 }, // 产品单位
      { wch: 10 }, // 产品单价
      { wch: 30 }, // 产品规格描述
      { wch: 10 }, // 订单状态
    ]
    ws['!cols'] = colWidths

    XLSX.writeFile(wb, '订单导入模板.xlsx')
    MessagePlugin.success('模板下载成功')
  }

  // 文件选择变化
  const handleFileChange = (files) => {
    fileList.value = files
  }

  // 解析文件
  const parseFile = async () => {
    if (!fileList.value || fileList.value.length === 0) {
      MessagePlugin.warning('请先选择文件')
      return
    }

    parsing.value = true
    try {
      const file = fileList.value[0].raw
      const data = await readFile(file)
      const workbook = XLSX.read(data, { type: 'binary' })
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(firstSheet)

      if (jsonData.length === 0) {
        MessagePlugin.warning('文件中没有数据')
        return
      }

      // 验证并转换数据
      const errors = []
      const parsed = jsonData.map((row, index) => {
        const rowNumber = index + 2 // Excel 行号（从2开始，因为第1行是表头）
        const orderData = {
          index: index + 1,
          order_num: row['订单编号'] || '',
          order_inquiry_date: parseDate(row['询盘日期']),
          profit: parseFloat(row['利润']) || null,
          payment_account: row['收款账号'] || '',
          payment_ratio: parseFloat(row['收款比例']) || null,
          payment_date: parseDate(row['收款日期']),
          production_date: parseDate(row['排产日期']),
          export_method: row['出口方式'] || '',
          product_name: row['产品名称'] || '',
          product_model: row['产品型号'] || '',
          product_quantity: parseFloat(row['产品数量']) || null,
          product_unit: row['产品单位'] || '',
          product_price: parseFloat(row['产品单价']) || null,
          product_spec: row['产品规格描述'] || '',
          order_status: orderStatusMap[row['订单状态']] || 'in_progress',
        }

        // 验证必填字段
        const validationErrors = []
        if (!orderData.order_num) {
          validationErrors.push('订单编号不能为空')
        }
        if (!orderData.product_name) {
          validationErrors.push('产品名称不能为空')
        }

        if (validationErrors.length > 0) {
          orderData._error = true
          errors.push({
            row: rowNumber,
            message: validationErrors.join('；'),
          })
        }

        return orderData
      })

      parsedData.value = parsed
      errorData.value = errors

      if (errors.length > 0) {
        MessagePlugin.warning(`解析完成，发现 ${errors.length} 条错误数据`)
      } else {
        MessagePlugin.success(`解析成功，共 ${parsed.length} 条订单数据`)
      }
    } catch (error) {
      MessagePlugin.error('文件解析失败：' + error.message)
      console.error('解析错误：', error)
    } finally {
      parsing.value = false
    }
  }

  // 读取文件
  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsBinaryString(file)
    })
  }

  // 解析日期
  const parseDate = (dateStr) => {
    if (!dateStr) return ''

    // 如果是 Excel 日期序列号
    if (typeof dateStr === 'number') {
      const excelEpoch = new Date(1899, 11, 30)
      const date = new Date(excelEpoch.getTime() + dateStr * 86400000)
      return dayjs(date).format('YYYY-MM-DD')
    }

    // 如果是字符串日期
    const date = dayjs(dateStr)
    return date.isValid() ? date.format('YYYY-MM-DD') : ''
  }

  // 获取状态主题
  const getStatusTheme = (status) => {
    const themeMap = {
      in_progress: 'primary',
      completed: 'success',
      cancelled: 'danger',
    }
    return themeMap[status] || 'primary'
  }

  // 导入订单
  const handleImport = async () => {
    if (validData.value.length === 0) {
      MessagePlugin.warning('没有可导入的数据')
      return
    }

    importing.value = true
    try {
      // 准备订单数据
      const ordersData = validData.value.map((order) => {
        const data = { ...order }
        delete data.index
        delete data._error
        data.client_id = props.clientId
        return data
      })

      // 先查询该客户已存在的订单编号
      const { data: existingOrders, error: queryError } = await supabase.supabaseClient
        .from('orders')
        .select('order_num')
        .eq('client_id', props.clientId)

      if (queryError) {
        throw queryError
      }

      // 提取已存在的订单编号集合
      const existingOrderNums = new Set(existingOrders.map((o) => o.order_num))

      // 过滤出不重复的订单
      const newOrders = ordersData.filter((order) => !existingOrderNums.has(order.order_num))
      const duplicateCount = ordersData.length - newOrders.length

      // 如果全部重复
      if (newOrders.length === 0) {
        MessagePlugin.warning('所有订单编号都已存在，没有新订单需要导入')
        importing.value = false
        return
      }

      // 如果有重复，给出提示
      if (duplicateCount > 0) {
        MessagePlugin.warning(`检测到 ${duplicateCount} 个重复订单编号，将跳过这些订单`)
      }

      // 批量创建新订单
      const res = await supabase.createOrders(newOrders)
      if (res.data) {
        const successMsg = duplicateCount > 0
          ? `成功导入 ${res.data.length} 条订单（跳过 ${duplicateCount} 条重复订单）`
          : `成功导入 ${res.data.length} 条订单`
        MessagePlugin.success(successMsg)
        emit('success')
        handleClose()
      }
    } catch (error) {
      MessagePlugin.error('导入失败：' + error.message)
      console.error('导入错误：', error)
    } finally {
      importing.value = false
    }
  }

  // 重置导入
  const resetImport = () => {
    fileList.value = []
    parsedData.value = []
    errorData.value = []
  }

  // 关闭对话框
  const handleClose = () => {
    resetImport()
    dialogVisible.value = false
  }
</script>

<style scoped lang="scss">
  .import-dialog-content {
    min-height: 300px;
  }

  .upload-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .upload-tips {
    background: var(--color-bg-layout);
    border-radius: var(--radius-base);
    padding: var(--spacing-base);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);

    .tip-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);

      .tip-icon {
        font-size: var(--font-size-lg);
      }

      .tip-text {
        flex: 1;
      }
    }
  }

  .file-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-base);
    background: var(--color-bg-layout);
    border-radius: var(--radius-base);
    border: 1px solid var(--color-border-light);

    .file-name {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: var(--font-size-base);
      color: var(--color-text-primary);

      .file-icon {
        font-size: var(--font-size-lg);
      }
    }
  }

  .preview-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-base);
  }

  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-base);
    background: var(--color-bg-layout);
    border-radius: var(--radius-base);

    .preview-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);

      .info-label {
        font-size: var(--font-size-base);
        color: var(--color-text-secondary);
      }

      .info-value {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-semibold);
        color: var(--color-primary);
      }

      .error-count {
        font-size: var(--font-size-sm);
        color: var(--color-warning);
        font-weight: var(--font-weight-medium);
      }
    }
  }

  .error-alert {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);

    .error-list {
      max-height: 150px;
      overflow-y: auto;
      background: var(--color-bg-container);
      border-radius: var(--radius-base);
      padding: var(--spacing-sm);

      .error-item {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        padding: 4px 0;

        .error-row {
          color: var(--color-warning);
          font-weight: var(--font-weight-medium);
        }

        .error-msg {
          color: var(--color-text-primary);
        }
      }
    }
  }

  .preview-table {
    border-radius: var(--radius-base);
    overflow: hidden;

    .profit-value {
      color: var(--color-success);
      font-weight: var(--font-weight-semibold);
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
  }
</style>
