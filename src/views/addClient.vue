<template>
  <div class="add-client-container">
    <header class="add-client-header">
      <span class="back">
        <ChevronLeftIcon size="26" />
        返回列表
      </span>
      <span class="line"></span>
      <span class="text">新增客户</span>
    </header>
    <main class="main-container">
      <div class="client-info-box">
        <t-form
          ref="form"
          :data="formData"
          reset-type="initial"
          :disabled="formDisabled"
          layout="inline"
          colon
          @reset="onReset"
          @submit="onSubmit"
        >
          <t-form-item
            label="姓名"
            name="name"
          >
            <t-input
              v-model="formData.name"
              placeholder="请输入客户姓名"
            ></t-input>
          </t-form-item>
          <t-form-item
            label="询盘日期"
            name="date"
          >
            <t-date-picker
              v-model="formData.date"
              mode="date"
              clearable
            />
          </t-form-item>
          <t-form-item
            label="国家"
            name="country"
          >
            <t-select
              v-model="formData.country"
              :options="country_OPTIONS"
              clearable
            ></t-select>
          </t-form-item>

          <t-form-item
            label="状态"
            name="state"
          >
            <t-tree-select
              v-model="formData.state"
              :data="ADDRESS_OPTIONS"
              clearable
            />
          </t-form-item>

          <t-form-item
            label="询盘来源"
            name="origin"
          >
            <t-cascader
              v-model="formData.origin"
              :options="ADDRESS_OPTIONS"
              clearable
            />
          </t-form-item>

          <t-form-item
            label="备注"
            name="remark"
          >
            <t-textarea
              v-model="formData.remark"
              placeholder="客户备注"
              clearable
            />
          </t-form-item>

          <t-form-item
            label="是否转交"
            name="transfer"
          >
            <t-switch
              v-model="formData.transfer"
              :label="['是', '否']"
            ></t-switch>
          </t-form-item>

          <t-form-item
            label="邮箱"
            name="email"
          >
            <t-input
              v-model="formData.email"
              placeholder="请输入客户邮箱"
            ></t-input>
          </t-form-item>

          <t-form-item
            label="电话"
            name="phone"
          >
            <t-input
              v-model="formData.phone"
              placeholder="请输入客户电话"
            ></t-input>
          </t-form-item>
          <t-form-item
            label="跟进方式"
            name="follow_up_method"
          >
            <t-checkbox-group
              v-model="formData.follow_up_method"
              :options="follow_up_methodOptions"
            />
          </t-form-item>

          <t-form-item
            label="利润(美金)"
            name="profit"
          >
            <t-input-number
              v-model="formData.profit"
              theme="normal"
              placeholder="请输入利润"
            />
          </t-form-item>

          <t-form-item
            label="头像"
            name="avatar"
          >
            <t-upload
              v-model="formData.avatar"
              action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
              theme="image"
              tips="请选择单张图片文件上传"
              accept="image/*"
            ></t-upload>
          </t-form-item>

          <t-form-item>
            <t-space size="small">
              <t-button
                theme="primary"
                type="submit"
              >
                提交
              </t-button>
              <t-button
                theme="default"
                variant="base"
                type="reset"
              >
                重置
              </t-button>
              <t-button
                theme="primary"
                variant="base"
                :disabled="false"
                @click="
                  () => {
                    formDisabled = !formDisabled
                  }
                "
              >
                {{ formDisabled ? '关闭' : '开启' }}禁用表单
              </t-button>
            </t-space>
          </t-form-item>
        </t-form>
      </div>
    </main>
  </div>
</template>

<script setup>
  import { ChevronLeftIcon } from 'tdesign-icons-vue-next'
  import { ref, reactive } from 'vue'
  import { MessagePlugin } from 'tdesign-vue-next'

  const formDisabled = ref(false)
  const formData = reactive({
    name: '',
    transfer: true,
    email: '',
    phone: '',
    follow_up_method: [],
    country: '',
    remark: '',
    state: undefined,
    origin: undefined,
    profit: undefined,
    date: '',
    avatar: [{ url: 'https://tdesign.gtimg.com/site/avatar.jpg' }],
  })

  const follow_up_methodOptions = [
    { label: '语文', value: '1' },
    { label: '数学', value: '2' },
    { label: '英语', value: '3' },
  ]

  const country_OPTIONS = [
    { label: '学院 A', value: 1 },
    { label: '学院 B', value: 2 },
    { label: '学院 C', value: 3 },
  ]

  const ADDRESS_OPTIONS = [
    { label: '江苏', value: 1, children: [{ label: '南京市', value: 300 }] },
    { label: '上海', value: 2, children: [{ label: '徐汇区', value: 400 }] },
    { label: '四川', value: 3, children: [{ label: '成都市', value: 500 }] },
  ]

  const onReset = () => {
    MessagePlugin.success('重置成功')
  }

  const onSubmit = ({ validateResult, firstError }) => {
    if (validateResult === true) {
      MessagePlugin.success('提交成功')
    } else {
      console.log('Errors: ', validateResult)
      MessagePlugin.warning(firstError)
    }
  }
</script>

<style lang="scss" scoped>
  .add-client-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .add-client-header {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #3899cc;
      padding: 0 12px;
      box-sizing: border-box;
      .back {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .line {
        height: 20px;
        width: 1px;
        background-color: #ccc;
        margin: 0 10px;
      }
    }
    .main-container {
      flex: 1;
      overflow: auto;
      .client-info-box {
        padding: 12px;
      }
    }
  }
</style>
