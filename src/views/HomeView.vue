<template>
  <div class="home-page">
    <!-- 顶部操作栏 -->
    <div class="top-action-bar">
      <div class="title-section">
        <h1 class="page-title">客户管理</h1>
        <p class="page-subtitle">
          {{ batchMode ? `已选择 ${selectedClients.length} 位客户` : `共 ${clientList.length} 位客户` }}
        </p>
      </div>
      <div class="action-buttons">
        <t-button
          v-if="!batchMode"
          variant="outline"
          class="action-btn"
          @click="handleImport">
          <template #icon><upload-icon /></template>
          导入客户
        </t-button>
        <t-button
          v-if="!batchMode"
          variant="outline"
          class="action-btn"
          @click="handleDownloadTemplate">
          <template #icon><download-icon /></template>
          下载示例
        </t-button>
        <t-button
          v-if="!batchMode"
          variant="outline"
          class="action-btn"
          @click="toggleBatchMode">
          <template #icon><check-circle-icon /></template>
          批量管理
        </t-button>
        <t-button
          v-if="batchMode"
          variant="outline"
          class="action-btn"
          @click="toggleBatchMode">
          <template #icon><close-icon /></template>
          取消
        </t-button>
        <t-button
          v-if="batchMode && selectedClients.length > 0"
          theme="danger"
          class="action-btn"
          @click="handleBatchDelete">
          <template #icon><delete-icon /></template>
          删除选中 ({{ selectedClients.length }})
        </t-button>
        <t-button
          v-if="!batchMode"
          theme="primary"
          class="action-btn action-btn-primary"
          @click="handleAddCustomer">
          <template #icon><add-icon /></template>
          新增客户
        </t-button>
      </div>

      <!-- 隐藏的文件上传input -->
      <input
        ref="fileInput"
        type="file"
        accept=".xlsx,.xls,.csv"
        style="display: none"
        @change="handleFileChange" />
    </div>

    <!-- 状态筛选栏 -->
    <div class="filter-bar">
      <div class="status-tags">
        <div
          v-for="(key, value) in statusMap"
          :key="value"
          :class="['status-tag', { active: isStatusSelected(value) }]"
          @click="handleStatusClick(value)">
          <span class="status-label">{{ key.label }}</span>
          <span class="status-count">{{ getStatusCount(value) }}</span>
        </div>
      </div>
      <t-button
        v-if="selectedStatus.length > 0"
        size="small"
        variant="outline"
        class="clear-filter-btn"
        @click="baseInfo.clearStatusFilter()">
        清空筛选
      </t-button>
    </div>

    <!-- 客户卡片网格 -->
    <div class="client-grid-container">
      <SimpleBar style="max-height: 100%">
        <div class="client-grid">
          <div
            v-for="client in filteredClientList"
            :key="client.id"
            :class="['client-card', { 'batch-mode': batchMode, selected: isClientSelected(client.id) }]"
            @click="handleCardClick(client)">
            <!-- 删除按钮 -->
            <div v-if="!batchMode" class="delete-btn" @click.stop="handleDeleteClient(client)">
              <delete-icon />
            </div>
            <div class="card-header">
              <div
                class="status-indicator"
                :style="{ background: statusMap[client.state]?.color }"></div>
              <h3 class="client-name">{{ client.client_name }}</h3>
            </div>

            <div class="card-body">
              <div class="info-row">
                <span class="info-icon">🌍</span>
                <span class="info-text">{{ client.country }}</span>
                <img
                  :src="getImageUrl(client.country_addrev)"
                  alt=""
                  class="country-flag"
                  width="20" />
              </div>
              <div class="info-row">
                <span class="info-icon">📦</span>
                <span class="info-text">{{ client.product_name }}</span>
              </div>
              <div class="info-row">
                <span class="info-icon">📅</span>
                <span class="info-text">{{ dayjs(client.inquiry_date).format('YYYY-MM-DD') }}</span>
              </div>
            </div>

            <div class="card-footer">
              <t-tag
                :theme="getStatusTheme(client.state)"
                variant="light"
                size="small"
                class="status-badge">
                {{ statusMap[client.state]?.label }}
              </t-tag>
            </div>
          </div>
        </div>
      </SimpleBar>
      <t-loading v-if="loading" class="loading-overlay" />
      <t-empty v-if="!loading && !filteredClientList.length" class="empty-state" />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onActivated, computed } from 'vue'
  import { statusMap } from '@/utils/index.js'
  import dayjs from 'dayjs'
  import {
    AddIcon,
    UploadIcon,
    DownloadIcon,
    DeleteIcon,
    CheckCircleIcon,
    CloseIcon,
  } from 'tdesign-icons-vue-next'
  import { useRouter } from 'vue-router'
  import { useBaseInfoStore } from '@/stores/baseInfo.js'
  import { storeToRefs } from 'pinia'
  import { MessagePlugin, DialogPlugin, LoadingPlugin } from 'tdesign-vue-next'
  import * as XLSX from 'xlsx'
  import CountryList from '@/utils/countryList.json'
  import supabase from '@/request/supabase.js'

  const router = useRouter()
  const loading = ref(true)
  const baseInfo = useBaseInfoStore()
  const { clientList, selectedStatus, filteredClientList } = storeToRefs(baseInfo)
  const fileInput = ref(null)
  // 批量管理相关状态
  const batchMode = ref(false)
  const selectedClients = ref([])

  onMounted(() => {
    refreshHome()
  })

  onActivated(() => {
    if (sessionStorage.getItem('refresh') === '1') {
      refreshHome()
      sessionStorage.removeItem('refresh')
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

  // 检查状态是否被选中
  const isStatusSelected = (statusId) => {
    return selectedStatus.value.includes(Number(statusId))
  }

  // 点击状态标签，切换筛选
  const handleStatusClick = (statusId) => {
    baseInfo.toggleStatusFilter(Number(statusId))
  }

  // 获取每个状态的客户数量
  const getStatusCount = (statusId) => {
    return clientList.value.filter((client) => client.state === Number(statusId)).length
  }

  // 获取状态主题色
  const getStatusTheme = (state) => {
    const themeMap = {
      1: 'success',
      2: 'warning',
      3: 'warning',
      4: 'success',
      5: 'primary',
      6: 'danger',
      7: 'default',
      8: 'warning',
      9: 'default',
      10: 'default',
      11: 'default',
    }
    return themeMap[state] || 'default'
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

  // 处理卡片点击（批量模式下切换选择，普通模式下跳转详情）
  const handleCardClick = (client) => {
    if (batchMode.value) {
      toggleClientSelection(client.id, !isClientSelected(client.id))
    } else {
      handleCustomerDetail(client)
    }
  }

  // 切换批量管理模式
  const toggleBatchMode = () => {
    batchMode.value = !batchMode.value
    if (!batchMode.value) {
      selectedClients.value = []
    }
  }

  // 检查客户是否被选中
  const isClientSelected = (clientId) => {
    return selectedClients.value.includes(clientId)
  }

  // 切换客户选择状态
  const toggleClientSelection = (clientId, checked) => {
    if (checked) {
      if (!selectedClients.value.includes(clientId)) {
        selectedClients.value.push(clientId)
      }
    } else {
      selectedClients.value = selectedClients.value.filter((id) => id !== clientId)
    }
  }

  // 删除单个客户
  const handleDeleteClient = async (client) => {
    const dialog = DialogPlugin.confirm({
      header: '确认删除',
      body: `确定要删除客户 "${client.client_name}" 吗？此操作将同时删除该客户的所有订单数据，且无法恢复！`,
      confirmBtn: {
        content: '确认删除',
        theme: 'danger',
      },
      cancelBtn: '取消',
      onConfirm: async () => {
        try {
          const { error } = await supabase.deleteClient(client.id)
          if (error) throw error

          MessagePlugin.success('客户删除成功！')
          await refreshHome()
          dialog.hide()
        } catch (error) {
          MessagePlugin.error(`删除失败：${error.message}`)
          console.error('删除客户失败：', error)
        }
      },
      onCancel: () => {
        dialog.hide()
      },
    })
  }

  // 批量删除客户
  const handleBatchDelete = async () => {
    if (selectedClients.value.length === 0) {
      MessagePlugin.warning('请先选择要删除的客户！')
      return
    }

    const dialog = DialogPlugin.confirm({
      header: '批量删除确认',
      body: `确定要删除选中的 ${selectedClients.value.length} 位客户吗？此操作将同时删除这些客户的所有订单数据，且无法恢复！`,
      confirmBtn: {
        content: '确认删除',
        theme: 'danger',
      },
      cancelBtn: '取消',
      onConfirm: async () => {
        const loadingInstance = LoadingPlugin({ text: '正在删除...' })
        try {
          const { error } = await supabase.deleteClients(selectedClients.value)
          if (error) throw error

          MessagePlugin.success(`成功删除 ${selectedClients.value.length} 位客户！`)
          selectedClients.value = []
          batchMode.value = false
          await refreshHome()
          dialog.hide()
        } catch (error) {
          MessagePlugin.error(`批量删除失败：${error.message}`)
          console.error('批量删除客户失败：', error)
        } finally {
          loadingInstance.hide()
        }
      },
      onCancel: () => {
        dialog.hide()
      },
    })
  }

  // 下载Excel导入模板
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        客户名称: 'John Doe',
        国家代码: 'US',
        国家: 'United States',
        产品名称: 'Widget A',
        产品规格: '10x20cm, 不锈钢材质',
        询盘日期: '2025-01-15',
        客户语言: 'english',
        客户公司: 'ABC Company',
        邮箱: 'john@example.com',
        电话: '+1 123-456-7890',
        状态: 2,
        询盘来源: 1,
        是否转交: '否',
        跟进方式: '1,2',
        跟进日期: '2025-01-16',
        备注: '重要客户，需要及时跟进',
      },
      {
        客户名称: 'Jane Smith',
        国家代码: 'CN',
        国家: 'China',
        产品名称: 'Product B',
        产品规格: '5x10cm, 塑料材质',
        询盘日期: '2025-01-16',
        客户语言: 'chinese',
        客户公司: 'XYZ有限公司',
        邮箱: 'jane@example.com',
        电话: '+86 138-0000-0000',
        状态: 3,
        询盘来源: 2,
        是否转交: '是',
        跟进方式: '2,6',
        跟进日期: '2025-01-17',
        备注: '已排产，注意交期',
      },
    ]

    const worksheet = XLSX.utils.json_to_sheet(templateData)
    const colWidths = [
      { wch: 15 },
      { wch: 10 },
      { wch: 20 },
      { wch: 15 },
      { wch: 25 },
      { wch: 12 },
      { wch: 12 },
      { wch: 20 },
      { wch: 25 },
      { wch: 18 },
      { wch: 8 },
      { wch: 10 },
      { wch: 10 },
      { wch: 12 },
      { wch: 12 },
      { wch: 30 },
    ]
    worksheet['!cols'] = colWidths

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, '客户数据')

    const fileName = `客户导入模板_${dayjs().format('YYYYMMDD')}.xlsx`
    XLSX.writeFile(workbook, fileName)

    MessagePlugin.success('模板下载成功！')
  }

  // 触发文件选择
  const handleImport = () => {
    fileInput.value.click()
  }

  // 处理文件上传
  const handleFileChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      if (jsonData.length === 0) {
        MessagePlugin.warning('文件中没有数据！')
        return
      }

      const dialog = DialogPlugin.confirm({
        header: '导入预览',
        body: `检测到 ${jsonData.length} 条客户数据，是否确认导入？`,
        confirmBtn: '确认导入',
        cancelBtn: '取消',
        onConfirm: async () => {
          // 用户点击确认后才开始导入
          await batchImportClients(jsonData)
          dialog.hide() // 导入完成后关闭弹窗
        },
        onCancel: () => {
          dialog.hide()
        },
      })
    } catch (error) {
      MessagePlugin.error('文件解析失败，请检查格式！')
      console.error('文件解析错误：', error)
    }

    event.target.value = ''
  }

  // 批量导入客户
  const batchImportClients = async (data) => {
    const loadingInstance = LoadingPlugin({ text: '正在导入...' })
    let successCount = 0
    let failCount = 0

    for (const row of data) {
      try {
        const clientData = {
          client_name: row['客户名称'] || '',
          country_addrev: row['国家代码'] || '',
          country: row['国家'] || CountryList[row['国家代码']],
          product_name: row['产品名称'] || '',
          product_specifications: row['产品规格'] || '',
          inquiry_date: row['询盘日期']
            ? dayjs(row['询盘日期']).format('YYYY-MM-DD HH:mm:ss+08')
            : dayjs().format('YYYY-MM-DD HH:mm:ss+08'),
          language: row['客户语言'] || '',
          client_company: row['客户公司'] || '',
          client_email: row['邮箱'] || '',
          client_phone: row['电话'] || '',
          state: Number(row['状态']) || 2,
          origin: Number(row['询盘来源']) || 1,
          is_transfer: row['是否转交'] === '是' || false,
          follow_up_method: row['跟进方式'] || '',
          follow_up_date: row['跟进日期']
            ? dayjs(row['跟进日期']).format('YYYY-MM-DD HH:mm:ss+08')
            : '',
          remark: row['备注'] || '',
          created_at: dayjs().format('YYYY-MM-DD HH:mm:ss+08'),
        }

        await supabase.insertClient(clientData)
        successCount++
      } catch (error) {
        failCount++
        console.error('导入失败:', row, error)
      }
    }

    loadingInstance.hide()
    MessagePlugin.success(`导入完成！成功 ${successCount} 条，失败 ${failCount} 条`)
    await refreshHome()
  }
</script>

<style scoped lang="scss">
  .home-page {
    width: 100%;
    height: 100%;
    padding: var(--spacing-lg);
    background: var(--color-bg-layout);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-base);
  }

  /* 顶部操作栏 */
  .top-action-bar {
    background: var(--color-bg-container);
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .page-title {
    font-size: var(--font-size-4xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin: 0;
    line-height: var(--line-height-tight);
  }

  .page-subtitle {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    margin: 0;
  }

  .action-buttons {
    display: flex;
    gap: var(--spacing-sm);
  }

  .action-btn {
    height: 36px;
    padding: 0 var(--spacing-base);
    border-radius: var(--radius-base);
    font-weight: var(--font-weight-medium);
    transition: all var(--transition-base);

    &:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
  }

  .action-btn-primary {
    background: var(--color-primary);
    border-color: var(--color-primary);

    &:hover {
      background: var(--color-primary-hover);
      border-color: var(--color-primary-hover);
      box-shadow: 0 4px 12px rgba(91, 141, 239, 0.3);
    }
  }

  /* 状态筛选栏 */
  .filter-bar {
    background: var(--color-bg-container);
    padding: var(--spacing-base) var(--spacing-md);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-base);
  }

  .status-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    flex: 1;
  }

  .status-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 var(--spacing-base);
    border-radius: 18px;
    background: var(--color-bg-layout);
    color: var(--color-text-secondary);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-base);
    user-select: none;

    &:hover {
      background: var(--color-primary-light);
      color: var(--color-primary);
      transform: translateY(-1px);
    }

    &.active {
      background: var(--color-primary);
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(91, 141, 239, 0.3);
    }
  }

  .status-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.2);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
  }

  .status-tag.active .status-count {
    background: rgba(255, 255, 255, 0.25);
  }

  .status-tag:not(.active) .status-count {
    background: rgba(0, 0, 0, 0.06);
  }

  .clear-filter-btn {
    flex-shrink: 0;
  }

  /* 客户卡片网格 */
  .client-grid-container {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: transparent;
  }

  .client-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-base);
    padding: 4px;
  }

  .client-card {
    background: var(--color-bg-container);
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
    box-shadow: var(--shadow-base);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-base);
    border: 2px solid transparent;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--color-primary);
      transform: scaleX(0);
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-hover);

      &::before {
        transform: scaleX(1);
      }

      .delete-btn {
        opacity: 1;
      }
    }

    &.batch-mode {
      cursor: pointer;
    }

    &.selected {
      border-color: var(--color-primary);
      background: rgba(91, 141, 239, 0.05);
    }
  }

  /* 删除按钮 */
  .delete-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 10;

    &:hover {
      background: var(--color-error);
      color: #ffffff;
      transform: scale(1.1);
    }

    :deep(.t-icon) {
      font-size: 16px;
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-bottom: var(--spacing-sm);
    border-bottom: 1px solid var(--color-border-light);
  }

  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(91, 141, 239, 0.15);
  }

  .client-name {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .info-icon {
    font-size: var(--font-size-lg);
    flex-shrink: 0;
  }

  .info-text {
    font-size: var(--font-size-base);
    color: var(--color-text-secondary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }

  .country-flag {
    flex-shrink: 0;
    border-radius: 2px;
    object-fit: contain;
  }

  .card-footer {
    display: flex;
    justify-content: flex-end;
  }

  .status-badge {
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-sm);
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .empty-state {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  /* 响应式设计 */
  @media (max-width: 1400px) {
    .client-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 1024px) {
    .client-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .top-action-bar {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-base);
    }

    .action-buttons {
      width: 100%;
      justify-content: flex-end;
    }
  }

  @media (max-width: 640px) {
    .home-page {
      padding: var(--spacing-sm);
    }

    .client-grid {
      grid-template-columns: 1fr;
    }

    .status-tags {
      overflow-x: auto;
      flex-wrap: nowrap;
    }

    .action-buttons {
      flex-direction: column;
      width: 100%;

      .action-btn {
        width: 100%;
      }
    }
  }
</style>
