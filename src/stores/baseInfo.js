import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://pqbneojpksizuigsglce.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxYm5lb2pwa3NpenVpZ3NnbGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyODcxMDgsImV4cCI6MjA3Njg2MzEwOH0.lr8G6dn2nTQy4pPQKb7HgVw8Imms71QjDEAPJjB-rjg'
)

export const useBaseInfoStore = defineStore('baseInfo', () => {
  const ali_ak_info = ref({
    id: '',
    key: '',
  })
  const getAliAkInfo = async () => {
    const res = await supabase.from('ALI_OSS_ACCESS_KEY').select()
    if (res.status === 200) {
      ali_ak_info.value.id = res.data[0].ACCESS_KEY_ID
      ali_ak_info.value.key = res.data[0].ACCESS_KEY_SECRET
    }
  }
  return { ali_ak_info, getAliAkInfo }
})
