import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import supabase from '@/request/supabase.js'

export const useBaseInfoStore = defineStore(
  'baseInfo',
  () => {
    const ali_ak_info = ref({ id: '', key: '' })
    const clientList = ref([])
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
    return { ali_ak_info, clientList, getAliAkInfo, getClientList }
  },
  { persist: true }
)
