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
// 更新客户信息
const updateClient = (id, updatedData) => {
  return supabaseClient.from('clients').update(updatedData).eq('id', id).select().single()
}

// 删除单个客户
const deleteClient = (id) => {
  return supabaseClient.from('clients').delete().eq('id', id)
}

// 批量删除客户
const deleteClients = (ids) => {
  return supabaseClient.from('clients').delete().in('id', ids)
}

// ==================== 订单相关API ====================

// 获取指定客户的所有订单
const getClientOrders = (clientId) => {
  return supabaseClient
    .from('orders')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
}

// 创建新订单
const createOrder = (orderData) => {
  return supabaseClient.from('orders').insert([orderData]).select().single()
}

// 获取单个订单详情
const getOrderById = (orderId) => {
  return supabaseClient.from('orders').select('*').eq('id', orderId).single()
}

// 更新订单信息
const updateOrder = (orderId, updatedData) => {
  return supabaseClient.from('orders').update(updatedData).eq('id', orderId).select().single()
}

// 删除订单
const deleteOrder = (orderId) => {
  return supabaseClient.from('orders').delete().eq('id', orderId)
}

// 批量创建订单
const createOrders = (ordersData) => {
  return supabaseClient.from('orders').insert(ordersData).select()
}

// 批量删除订单
const deleteOrders = (orderIds) => {
  return supabaseClient.from('orders').delete().in('id', orderIds)
}

export default {
  supabaseClient,
  getClientList,
  insertClient,
  getClientInfo,
  updateClient,
  deleteClient,
  deleteClients,
  // 订单相关
  getClientOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  deleteOrders,
  createOrders,
}
