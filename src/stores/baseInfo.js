import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import supabase from '@/request/supabase.js'

export const useBaseInfoStore = defineStore('baseInfo', () => {
  const ali_ak_info = ref({ id: '', key: '' })
  const clientList = ref([])
  // 状态筛选：存储选中的状态ID数组
  const selectedStatus = ref([])

  const getAliAkInfo = async () => {
    const res = await supabase.supabaseClient.from('ALI_OSS_ACCESS_KEY').select()
    if (res.status === 200) {
      ali_ak_info.value.id = res.data[0].ACCESS_KEY_ID
      ali_ak_info.value.key = res.data[0].ACCESS_KEY_SECRET
    }
  }

  const getClientList = async () => {
    const res = await supabase.getClientList()
    if (res.status === 200) {
      clientList.value = res.data
    }
  }

  // 计算属性：根据筛选条件返回过滤后的客户列表
  const filteredClientList = computed(() => {
    if (selectedStatus.value.length === 0) {
      return clientList.value // 没有筛选条件，返回全部客户
    }
    return clientList.value.filter((client) => selectedStatus.value.includes(client.state))
  })

  // 切换状态筛选（支持多选）
  const toggleStatusFilter = (statusId) => {
    const index = selectedStatus.value.indexOf(statusId)
    if (index > -1) {
      selectedStatus.value.splice(index, 1) // 取消选中
    } else {
      selectedStatus.value.push(statusId) // 选中
    }
  }

  // 清空所有筛选条件
  const clearStatusFilter = () => {
    selectedStatus.value = []
  }

  return {
    ali_ak_info,
    clientList,
    selectedStatus,
    filteredClientList,
    getAliAkInfo,
    getClientList,
    toggleStatusFilter,
    clearStatusFilter,
  }
})
