<template>
  <div class="add-client-container">
    <ChildHeader title="新增客户" />
    <main class="main-container">
      <SimpleBar style="max-height: 100%">
        <div class="client-info-box">
          <t-form
            ref="form"
            :data="formData"
            :rules="rules"
            reset-type="initial"
            :disabled="formDisabled"
            colon
            @reset="onReset"
            @submit="onSubmit">
            <div class="left-box">
              <t-form-item label="姓名" name="client_name">
                <t-input v-model="formData.client_name" placeholder="请输入客户姓名"></t-input>
              </t-form-item>

              <t-form-item label="国家" name="country">
                <t-select
                  v-model="formData.country"
                  :options="COUNTRY_OPTIONS"
                  clearable
                  filterable
                  placeholder="请选择客户国家"></t-select>
              </t-form-item>

              <t-form-item label="产品名称" name="product_name">
                <t-input v-model="formData.product_name" placeholder="请输入产品名称" />
              </t-form-item>

              <t-form-item label="产品规格" name="product_specifications">
                <t-textarea
                  v-model="formData.product_specifications"
                  placeholder="请输入产品规格"
                  clearable />
              </t-form-item>

              <div class="inline-box">
                <t-form-item label="询盘日期" name="inquiry_date">
                  <t-date-picker
                    v-model="formData.inquiry_date"
                    mode="date"
                    enable-time-picker
                    allow-input
                    clearable />
                </t-form-item>
                <t-form-item label="客户语言" name="language">
                  <t-select
                    v-model="formData.language"
                    :options="LANGUAGE_OPTIONS"
                    clearable
                    filterable
                    placeholder="请选择客户语言"></t-select>
                </t-form-item>
              </div>

              <t-form-item label="客户公司" name="client_company">
                <t-input
                  v-model="formData.client_company"
                  placeholder="请输入客户公司名称"></t-input>
              </t-form-item>

              <t-form-item label="邮箱" name="client_email">
                <t-input v-model="formData.client_email" placeholder="请输入客户邮箱"></t-input>
              </t-form-item>

              <t-form-item label="电话" name="client_phone">
                <t-input v-model="formData.client_phone" placeholder="请输入客户电话"></t-input>
              </t-form-item>

              <t-form-item label="状态" name="state">
                <t-select v-model="formData.state" :options="STATUS_OPTIONS" clearable />
              </t-form-item>

              <t-form-item label="询盘来源" name="origin">
                <t-select v-model="formData.origin" :options="ORIGIN_OPTIONS" clearable />
              </t-form-item>

              <t-form-item label="是否转交" name="is_transfer">
                <t-switch v-model="formData.is_transfer" :label="['是', '否']"></t-switch>
              </t-form-item>

              <t-form-item label="跟进方式" name="follow_up_method">
                <t-checkbox-group
                  v-model="formData.follow_up_method"
                  :options="FOLLOW_UP_METHOD_OPTIONS" />
              </t-form-item>

              <t-form-item label="跟进日期" name="follow_up_date">
                <t-date-picker
                  v-model="formData.follow_up_date"
                  mode="date"
                  enable-time-picker
                  allow-input
                  clearable />
              </t-form-item>

              <t-form-item label="备注" name="remark">
                <t-textarea v-model="formData.remark" placeholder="客户备注" clearable />
              </t-form-item>

              <t-form-item label="相关文件" name="file">
                <t-upload
                  v-model="formData.file"
                  action="/"
                  theme="image"
                  tips="请选择单张图片文件上传"
                  accept="image/*"></t-upload>
              </t-form-item>

              <t-form-item class="btn-box">
                <t-space size="small" class="form-btn-space">
                  <t-button theme="default" variant="base" type="reset" style="width: 100px">
                    重置
                  </t-button>
                  <t-button theme="primary" type="submit" style="width: 100%">提交</t-button>
                </t-space>
              </t-form-item>
            </div>
            <div v-if="[3, 4].includes(Number(formData.state))" class="right-box">
              <t-form-item label="单号" name="order_num">
                <t-input v-model="formData.order_num" placeholder="请输入单号"></t-input>
              </t-form-item>

              <div class="inline-box">
                <t-form-item label="利润(美金)" name="profit">
                  <t-input-number
                    v-model="formData.profit"
                    theme="normal"
                    placeholder="请输入利润" />
                </t-form-item>
                <div class="exchange-rate">汇率: 7</div>
                <div class="rmb">￥{{ Math.round((formData.profit || 0) * 7 * 1000) / 1000 }}</div>
              </div>
              <!-- 询盘日期 -->
              <t-form-item label="询盘日期" name="order_inquiry_date">
                <t-date-picker v-model="formData.order_inquiry_date" placeholder="请选择询盘日期" />
              </t-form-item>

              <!-- 收款账号 -->
              <t-form-item label="收款账号" name="payment_account">
                <t-input v-model="formData.payment_account" placeholder="请输入收款账号" />
              </t-form-item>

              <!-- 收款比例 -->
              <t-form-item label="收款比例" name="payment_ratio">
                <t-input-number
                  v-model="formData.payment_ratio"
                  placeholder="请输入收款比例"
                  min="0"
                  max="100"
                  theme="normal" />
              </t-form-item>

              <div class="inline-box">
                <!-- 收款日期 -->
                <t-form-item label="收款日期" name="payment_date">
                  <t-date-picker v-model="formData.payment_date" placeholder="请选择收款日期" />
                </t-form-item>

                <!-- 排产日期 -->
                <t-form-item label="排产日期" name="production_date">
                  <t-date-picker v-model="formData.production_date" placeholder="请选择排产日期" />
                </t-form-item>
              </div>

              <!-- 出口方式 -->
              <t-form-item label="出口方式" name="export_method">
                <t-input v-model="formData.export_method" placeholder="请输入出口方式" />
              </t-form-item>

              <!-- 产品名称 -->
              <t-form-item label="产品名称" name="order_product_name">
                <t-input v-model="formData.order_product_name" placeholder="请输入产品名称" />
              </t-form-item>

              <!-- 产品型号 -->
              <t-form-item label="产品型号" name="product_model">
                <t-input v-model="formData.product_model" placeholder="请输入产品型号" />
              </t-form-item>

              <div class="inline-box">
                <!-- 产品数量 -->
                <t-form-item label="产品数量" name="product_quantity">
                  <t-input-number
                    v-model="formData.product_quantity"
                    placeholder="请输入产品数量"
                    min="0"
                    theme="normal" />
                </t-form-item>

                <!-- 产品单价 -->
                <t-form-item label="产品单价" name="product_price">
                  <t-input-number
                    v-model="formData.product_price"
                    placeholder="请输入产品单价"
                    min="0"
                    theme="normal" />
                </t-form-item>
              </div>

              <!-- 产品单位 -->
              <t-form-item label="产品单位" name="product_unit">
                <t-input v-model="formData.product_unit" placeholder="请输入产品单位" />
              </t-form-item>

              <!-- 产品详细规格描述 -->
              <t-form-item label="详细描述" name="product_spec">
                <t-textarea
                  v-model="formData.product_spec"
                  placeholder="请输入规格的详细描述"
                  clearable />
              </t-form-item>
            </div>
          </t-form>
        </div>
      </SimpleBar>
    </main>
  </div>
</template>

<script setup>
  // import OSS from 'ali-oss'
  // import { useBaseInfoStore } from '@/stores/baseInfo.js'
  // import { storeToRefs } from 'pinia'
  import { ref, reactive } from 'vue'
  import { MessagePlugin } from 'tdesign-vue-next'
  import CountryList from '@/utils/countryList.json'
  import { statusMap, originMap, followUpMethodMap, languageMap } from '@/utils/index.js'
  import supabase from '@/request/supabase.js'
  import dayjs from 'dayjs'
  import ChildHeader from '@/components/childHeader.vue'

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
    profit: '',
    inquiry_date: '',
    follow_up_date: '',
    file: [],
    order_num: '',
    language: '',
    client_company: '',
    product_name: '',
    product_specifications: '',
    order_inquiry_date: '',
    payment_account: '',
    payment_ratio: null,
    payment_date: '',
    production_date: '',
    export_method: '',
    order_product_name: '',
    product_model: '',
    product_quantity: null,
    product_unit: '',
    product_price: null,
    product_spec: '',
  })
  const orderData = reactive({
    order_inquiry_date: '',
    order_num: '',
    payment_account: '',
    payment_ratio: null,
    payment_date: '',
    production_date: '',
    export_method: '',
    order_product_name: '',
    product_model: '',
    product_quantity: null,
    product_unit: '',
    product_price: null,
    product_spec: '',
    profit: null,
  })
  const rules = {
    client_name: [{ required: true, message: '请输入客户姓名', trigger: 'change' }],
    is_transfer: [{ required: true, message: '请选择是否为转接客户', trigger: 'change' }],
    client_email: [
      { required: false, message: '请输入邮箱地址', trigger: 'change' },
      {
        validator: (val) => {
          if (!val) return true // 如果为空，不校验格式
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
          if (!val) return true // 如果为空，不校验格式
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
    profit: [
      {
        validator: (val) => val === undefined || val === '' || /^\d+(\.\d+)?$/.test(val),
        message: '利润必须为数字',
        trigger: 'blur',
      },
    ],
    inquiry_date: [{ required: true, message: '请选择日期', trigger: 'change' }],
    file: [{ required: false }],
    order_num: [{ required: true, message: '请输入单号', trigger: 'change' }],
    language: [{ required: true, message: '请选择客户语言', trigger: 'change' }],
    client_company: [{ required: false, message: '请输入客户公司名称', trigger: 'change' }],
    product_name: [{ required: true, message: '请输入产品名称', trigger: 'change' }],
    product_specifications: [{ required: true, message: '请输入产品规格', trigger: 'change' }],
    order_inquiry_date: [{ required: true, message: '请输入询盘日期', trigger: 'change' }],
    payment_account: [{ required: true, message: '请输入收款账号', trigger: 'change' }],
    payment_ratio: [{ required: true, message: '请输入收款比例', trigger: 'change' }],
    payment_date: [{ required: true, message: '请输入收款日期', trigger: 'change' }],
    production_date: [{ required: true, message: '请输入排产日期', trigger: 'change' }],
    export_method: [{ required: true, message: '请输入出口方式', trigger: 'change' }],
    order_product_name: [{ required: true, message: '请输入产品名称', trigger: 'change' }],
    product_model: [{ required: true, message: '请输入产品型号', trigger: 'change' }],
    product_quantity: [{ required: true, message: '请输入产品数量', trigger: 'change' }],
    product_unit: [{ required: true, message: '请输入产品单位', trigger: 'change' }],
    product_price: [{ required: true, message: '请输入产品单价', trigger: 'change' }],
    product_spec: [{ required: true, message: '请输入详细规格描述', trigger: 'change' }],
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

  const onReset = () => {
    MessagePlugin.success('重置成功')
  }

  const handleChange = (e) => {
    console.log(e)
    console.log(formData)
  }

  const onSubmit = async ({ validateResult, firstError }) => {
    if (validateResult === true) {
      const orderKeys = Object.keys(orderData)
      // 过滤掉 formData 中那些与 orderData 重复的键
      const uniqueFormEntries = Object.entries(formData).filter(([key]) => !orderKeys.includes(key))
      // 转换为对象
      const filteredFormData = Object.fromEntries(uniqueFormEntries)
      const submitClientData = {
        ...filteredFormData,
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss+08'),
        follow_up_method: formData.follow_up_method.join(','),
        country: CountryList[formData.country],
        country_addrev: formData.country,
        inquiry_date: formData.inquiry_date + '+08',
        follow_up_date: formData.follow_up_date + '+08',
      }
      delete submitClientData.file
      formDisabled.value = true
      const res = await supabase.insertClient(submitClientData)
      formDisabled.value = false
      sessionStorage.setItem('refresh', 1)
      if (res.status === 201) {
        await MessagePlugin.success('添加成功')
      }
    } else {
      console.log('Errors: ', validateResult)
      await MessagePlugin.warning(firstError)
    }
  }
  // let client = null
  // const baseInfo = useBaseInfoStore()
  // const { ali_ak_info } = storeToRefs(baseInfo)
  // await baseInfo.getAliAkInfo()
  // 初始化 OSS 客户端
  // client = new OSS({
  //   region: 'oss-cn-beijing',
  //   accessKeyId: ali_ak_info.value.id,
  //   accessKeySecret: ali_ak_info.value.key,
  //   bucket: 'lz-clients1',
  // })
  // const handleFile = async (e) => {
  //   const file = e.target.files[0]
  //   if (!file) return
  //
  //   try {
  //     const fileName = `uploads/${Date.now()}_${file.name}`
  //     const result = await client.put(fileName, file)
  //     console.log('上传成功：', result.url)
  //     fileUrl.value = result.url
  //   } catch (err) {
  //     console.error('上传失败：', err)
  //   }
  // }
</script>

<style lang="scss" scoped>
  .add-client-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .main-container {
      flex: 1;
      overflow: hidden;
      .client-info-box {
        padding: 12px;
        .t-form {
          display: flex;
          column-gap: 12px;
          .left-box,
          .right-box {
            flex: 1;
            max-width: calc((100% - 12px) / 2);
          }
          .right-box {
            border-left: 1px solid #ccc;
          }
          .inline-box {
            width: 100%;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            .exchange-rate {
              width: 100px;
              line-height: 32px;
            }
            .rmb {
              width: 200px;
              line-height: 32px;
              color: red;
            }
          }
          .btn-box {
            position: sticky;
            bottom: 0;
            padding-bottom: 10px;
            background-color: #fff;
          }
          :deep(.t-form__label) {
            padding-right: 5px;
          }
          //.form-btn-space {
          //  width: 100%;
          //  display: flex;
          //  align-items: center;
          //  :deep(.t-space-item:first-child) {
          //    flex: 1;
          //  }
          //}
        }
      }
    }
  }
</style>
