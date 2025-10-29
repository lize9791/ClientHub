import { createClient } from '@supabase/supabase-js'

const supabaseClient = createClient(
  'https://pqbneojpksizuigsglce.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxYm5lb2pwa3NpenVpZ3NnbGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyODcxMDgsImV4cCI6MjA3Njg2MzEwOH0.lr8G6dn2nTQy4pPQKb7HgVw8Imms71QjDEAPJjB-rjg'
)

// 获取所有客户列表
const getClientList = () => {
  return supabaseClient.from('clients').select()
}
// 插入一条新的客户数据并返回客户id
const insertClient = (client) => {
  return supabaseClient.from('clients').insert([client]).select('id').single()
}
// 根据id查询客户数据
const getClientInfo = (id) => {
  return supabaseClient.from('clients').select('*').eq('id', id).single()
}
export default {
  supabaseClient,
  getClientList,
  insertClient,
  getClientInfo,
}
