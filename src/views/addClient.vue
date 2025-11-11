<template>
  <div class="add-client-container">
    <ChildHeader :title="isEditMode ? '编辑客户' : '新增客户'" />
    <main class="main-container">
      <SimpleBar style="max-height: 100%">
        <div class="form-content">
          <t-form
            ref="form"
            :data="formData"
            :rules="rules"
            reset-type="initial"
            :disabled="formDisabled"
            colon
            @reset="onReset"
            @submit="onSubmit">
            <div class="form-sections">
              <!-- 左侧基本信息 -->
              <div class="form-section">
                <div class="section-header">
                  <span class="section-icon">👤</span>
                  <h3 class="section-title">基本信息</h3>
                </div>

                <t-form-item label="客户姓名" name="client_name">
                  <t-input v-model="formData.client_name" placeholder="请输入客户姓名" clearable />
                </t-form-item>

                <t-form-item label="国家" name="country">
                  <t-select
                    v-model="formData.country"
                    :options="COUNTRY_OPTIONS"
                    clearable
                    filterable
                    placeholder="请选择客户国家" />
                </t-form-item>

                <t-form-item label="客户语言" name="language">
                  <t-select
                    v-model="formData.language"
                    :options="LANGUAGE_OPTIONS"
                    clearable
                    filterable
                    placeholder="请选择客户语言" />
                </t-form-item>

                <t-form-item label="客户公司" name="client_company">
                  <t-input v-model="formData.client_company" placeholder="请输入客户公司名称" clearable />
                </t-form-item>

                <t-form-item label="邮箱" name="client_email">
                  <t-input v-model="formData.client_email" placeholder="请输入客户邮箱" clearable />
                </t-form-item>

                <t-form-item label="电话" name="client_phone">
                  <t-input v-model="formData.client_phone" placeholder="请输入客户电话" clearable />
                </t-form-item>

                <div class="section-divider"></div>

                <div class="section-header">
                  <span class="section-icon">📦</span>
                  <h3 class="section-title">产品信息</h3>
                </div>

                <t-form-item label="产品名称" name="product_name">
                  <t-input v-model="formData.product_name" placeholder="请输入产品名称" clearable />
                </t-form-item>

                <t-form-item label="产品规格" name="product_specifications">
                  <t-textarea
                    v-model="formData.product_specifications"
                    placeholder="请输入产品规格"
                    :autosize="{ minRows: 3, maxRows: 6 }"
                    clearable />
                </t-form-item>

                <div class="section-divider"></div>

                <div class="section-header">
                  <span class="section-icon">📋</span>
                  <h3 class="section-title">询盘信息</h3>
                </div>

                <t-form-item label="询盘日期" name="inquiry_date">
                  <t-date-picker
                    v-model="formData.inquiry_date"
                    mode="date"
                    enable-time-picker
                    allow-input
                    clearable
                    style="width: 100%" />
                </t-form-item>

                <t-form-item label="客户状态" name="state">
                  <t-select v-model="formData.state" :options="STATUS_OPTIONS" clearable />
                </t-form-item>

                <t-form-item label="询盘来源" name="origin">
                  <t-select v-model="formData.origin" :options="ORIGIN_OPTIONS" clearable />
                </t-form-item>

                <t-form-item label="是否转交" name="is_transfer">
                  <t-switch v-model="formData.is_transfer" :label="['是', '否']" />
                </t-form-item>

                <div class="section-divider"></div>

                <div class="section-header">
                  <span class="section-icon">🔄</span>
                  <h3 class="section-title">跟进信息</h3>
                </div>

                <t-form-item label="跟进方式" name="follow_up_method">
                  <t-checkbox-group v-model="formData.follow_up_method" :options="FOLLOW_UP_METHOD_OPTIONS" />
                </t-form-item>

                <t-form-item label="跟进日期" name="follow_up_date">
                  <t-date-picker
                    v-model="formData.follow_up_date"
                    mode="date"
                    enable-time-picker
                    allow-input
                    clearable
                    style="width: 100%" />
                </t-form-item>

                <t-form-item label="备注" name="remark">
                  <t-textarea
                    v-model="formData.remark"
                    placeholder="请输入备注信息"
                    :autosize="{ minRows: 4, maxRows: 8 }"
                    clearable />
                </t-form-item>

                <t-form-item label="相关文件" name="file">
                  <t-upload
                    v-model="formData.file"
                    action="/"
                    theme="image"
                    tips="请选择单张图片文件上传"
                    accept="image/*" />
                </t-form-item>
              </div>
            </div>

            <!-- 底部操作按钮 -->
            <div class="form-actions">
              <t-button theme="default" variant="outline" type="reset" class="action-btn reset-btn">
                <template #icon>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path
                      d="M8 3.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8z" />
                    <path
                      d="M8 4.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z" />
                  </svg>
                </template>
                重置表单
              </t-button>
              <t-button theme="primary" type="submit" class="action-btn submit-btn" :loading="formDisabled">
                <template #icon>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                  </svg>
                </template>
                {{ isEditMode ? '保存修改' : '提交新增' }}
              </t-button>
            </div>
          </t-form>
        </div>
      </SimpleBar>
    </main>
  </div>
</template>

<script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { MessagePlugin } from 'tdesign-vue-next'
  import CountryList from '@/utils/countryList.json'
  import { statusMap, originMap, followUpMethodMap, languageMap } from '@/utils/index.js'
  import supabase from '@/request/supabase.js'
  import dayjs from 'dayjs'
  import ChildHeader from '@/components/childHeader.vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  // 判断是编辑还是新增
  const isEditMode = computed(() => !!route.query.id)
  const clientId = computed(() => Number(route.query.id))

  const formDisabled = ref(false)

  const formData = reactive({
    client_name: '',
    is_transfer: true,
    client_email: '',
    client_phone: '',
    follow_up_method: [],
    country: '',
    remark: '',
    state: '',
    origin: '',
    inquiry_date: '',
    follow_up_date: '',
    file: [],
    language: '',
    client_company: '',
    product_name: '',
    product_specifications: '',
  })

  // 表单验证规则
  const rules = {
    client_name: [{ required: true, message: '请输入客户姓名', trigger: 'change' }],
    is_transfer: [{ required: true, message: '请选择是否为转接客户', trigger: 'change' }],
    client_email: [
      { required: false, message: '请输入邮箱地址', trigger: 'change' },
      {
        validator: (val) => {
          if (!val) return true
          return /^[\w.-]+@[\w.-]+\.\w+$/.test(val)
        },
        message: '邮箱格式不正确',
        trigger: 'blur',
      },
    ],
    client_phone: [
      { required: false, message: '请输入联系电话', trigger: 'change' },
      {
        validator: (val) => {
          if (!val) return true
          return /^\+?[1-9]\d{0,3}[-.\s]?\d{4,14}(?:[-.\s]\d{1,13})?$/.test(val)
        },
        message: '请输入正确的国际电话号码（示例：+86 13800138000）',
        trigger: 'blur',
      },
    ],
    follow_up_method: [{ required: true, message: '请选择跟进方式', trigger: 'change' }],
    country: [{ required: true, message: '请输入或选择国家', trigger: 'change' }],
    remark: [{ required: false }],
    state: [{ required: true, message: '请选择客户状态', trigger: 'change' }],
    origin: [{ required: true, message: '请选择客户来源', trigger: 'change' }],
    inquiry_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
    file: [{ required: false }],
    language: [{ required: true, message: '请选择客户语言', trigger: 'change' }],
    client_company: [{ required: false, message: '请输入客户公司名称', trigger: 'change' }],
    product_name: [{ required: true, message: '请输入产品名称', trigger: 'change' }],
    product_specifications: [{ required: true, message: '请输入产品规格', trigger: 'change' }],
  }

  const COUNTRY_OPTIONS = Object.entries(CountryList)
    .sort(([, nameA], [, nameB]) => nameA.localeCompare(nameB, 'zh-CN'))
    .map(([key, name]) => ({ label: name, value: key }))

  const STATUS_OPTIONS = []
  for (const key in statusMap) {
    STATUS_OPTIONS.push({ label: statusMap[key].label, value: key })
  }
  const ORIGIN_OPTIONS = []
  for (const key in originMap) {
    ORIGIN_OPTIONS.push({ label: originMap[key], value: key })
  }

  const FOLLOW_UP_METHOD_OPTIONS = []
  for (const key in followUpMethodMap) {
    FOLLOW_UP_METHOD_OPTIONS.push({ label: followUpMethodMap[key], value: key })
  }

  const LANGUAGE_OPTIONS = []
  for (const key in languageMap) {
    LANGUAGE_OPTIONS.push({ label: languageMap[key], value: key })
  }

  // 编辑模式：加载客户数据
  onMounted(async () => {
    if (isEditMode.value) {
      try {
        const res = await supabase.getClientInfo(clientId.value)
        if (res.status === 200 && res.data) {
          Object.assign(formData, {
            client_name: res.data.client_name || '',
            country: res.data.country_addrev || '',
            product_name: res.data.product_name || '',
            product_specifications: res.data.product_specifications || '',
            inquiry_date: res.data.inquiry_date
              ? dayjs(res.data.inquiry_date).format('YYYY-MM-DD HH:mm:ss')
              : '',
            language: res.data.language || '',
            client_company: res.data.client_company || '',
            client_email: res.data.client_email || '',
            client_phone: res.data.client_phone || '',
            state: res.data.state ? String(res.data.state) : '',
            origin: res.data.origin ? String(res.data.origin) : '',
            is_transfer: res.data.is_transfer ?? true,
            follow_up_method: res.data.follow_up_method ? res.data.follow_up_method.split(',') : [],
            follow_up_date: res.data.follow_up_date
              ? dayjs(res.data.follow_up_date).format('YYYY-MM-DD HH:mm:ss')
              : '',
            remark: res.data.remark || '',
            file: [],
          })
          MessagePlugin.success('客户信息加载成功')
        }
      } catch (error) {
        MessagePlugin.error('加载客户信息失败：' + error.message)
      }
    }
  })

  const onReset = () => {
    MessagePlugin.success('重置成功')
  }

  const onSubmit = async ({ validateResult, firstError }) => {
    if (validateResult === true) {
      const submitClientData = {
        ...formData,
        follow_up_method: formData.follow_up_method.join(','),
        country: CountryList[formData.country],
        country_addrev: formData.country,
        inquiry_date: formData.inquiry_date
          ? dayjs(formData.inquiry_date).format('YYYY-MM-DD HH:mm:ss') + '+08'
          : '',
        follow_up_date: formData.follow_up_date
          ? dayjs(formData.follow_up_date).format('YYYY-MM-DD HH:mm:ss') + '+08'
          : '',
      }

      if (!isEditMode.value) {
        submitClientData.created_at = dayjs().format('YYYY-MM-DD HH:mm:ss+08')
      }

      delete submitClientData.file
      formDisabled.value = true

      try {
        let res
        if (isEditMode.value) {
          // 编辑模式：更新客户信息
          res = await supabase.updateClient(clientId.value, submitClientData)
          if (res.status === 200) {
            await MessagePlugin.success('更新成功')
            sessionStorage.setItem('refresh', 1)
            router.back()
          }
        } else {
          // 新增模式：保存客户信息
          res = await supabase.insertClient(submitClientData)
          if (res.status === 201) {
            await MessagePlugin.success('客户添加成功')
            sessionStorage.setItem('refresh', 1)
            router.back()
          }
        }
      } catch (error) {
        await MessagePlugin.error(isEditMode.value ? '更新失败' : '添加失败')
        console.error('提交错误：', error)
      } finally {
        formDisabled.value = false
      }
    } else {
      console.log('Errors: ', validateResult)
      await MessagePlugin.warning(firstError)
    }
  }
</script>

<style scoped lang="scss">
  .add-client-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--color-bg-layout);
  }

  .main-container {
    flex: 1;
    overflow: hidden;
  }

  .form-content {
    padding: var(--spacing-lg);
  }

  .form-sections {
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-xl);
  }

  .form-section {
    width: 100%;
    max-width: 800px;
    background: var(--color-bg-container);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-base);
    transition: box-shadow var(--transition-base);

    &:hover {
      box-shadow: var(--shadow-md);
    }
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-sm);
    border-bottom: 2px solid var(--color-primary-light);

    &.small {
      margin-bottom: var(--spacing-base);
      border-bottom: 1px solid var(--color-border-light);

      .section-title {
        font-size: var(--font-size-lg);
      }

      .section-icon {
        font-size: var(--font-size-xl);
      }
    }

    .section-icon {
      font-size: var(--font-size-3xl);
      line-height: 1;
    }

    .section-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
      margin: 0;
      flex: 1;
    }
  }

  .section-divider {
    height: 1px;
    background: var(--color-border-light);
    margin: var(--spacing-lg) 0;
  }

  /* 表单项样式优化 */
  :deep(.t-form__item) {
    margin-bottom: var(--spacing-base);
  }

  :deep(.t-form__label) {
    font-weight: var(--font-weight-medium);
    color: var(--color-text-primary);
    padding-right: var(--spacing-xs);
  }

  :deep(.t-input),
  :deep(.t-textarea__inner),
  :deep(.t-select),
  :deep(.t-date-picker) {
    transition: all var(--transition-base);

    &:hover {
      border-color: var(--color-primary-light);
    }

    &:focus,
    &:focus-within {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px var(--color-primary-light);
    }
  }

  :deep(.t-checkbox-group) {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  :deep(.t-checkbox) {
    margin-right: 0;
  }

  /* 底部操作按钮 */
  .form-actions {
    position: sticky;
    bottom: 0;
    background: var(--color-bg-container);
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-base);
    z-index: 10;
  }

  .action-btn {
    height: 44px;
    padding: 0 var(--spacing-lg);
    border-radius: var(--radius-base);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    transition: all var(--transition-base);
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);

    &:hover {
      transform: translateY(-2px);
    }

    &.reset-btn {
      min-width: 120px;

      &:hover {
        border-color: var(--color-text-secondary);
        color: var(--color-text-secondary);
        box-shadow: var(--shadow-sm);
      }
    }

    &.submit-btn {
      min-width: 160px;
      background: var(--color-primary);
      border-color: var(--color-primary);

      &:hover {
        background: var(--color-primary-hover);
        border-color: var(--color-primary-hover);
        box-shadow: 0 4px 12px rgba(91, 141, 239, 0.3);
      }
    }
  }

  /* 响应式设计 */
  @media (max-width: 1400px) {
    .form-content {
      padding: var(--spacing-base);
    }
  }

  @media (max-width: 768px) {
    .form-content {
      padding: var(--spacing-sm);
    }

    .form-section {
      padding: var(--spacing-base);
    }

    .section-header .section-title {
      font-size: var(--font-size-xl);
    }

    .form-actions {
      flex-direction: column;

      .action-btn {
        width: 100%;
      }
    }
  }
</style>
