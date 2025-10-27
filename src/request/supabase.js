import { createClient } from '@supabase/supabase-js'

const supabaseClient = createClient(
  'https://pqbneojpksizuigsglce.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxYm5lb2pwa3NpenVpZ3NnbGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyODcxMDgsImV4cCI6MjA3Njg2MzEwOH0.lr8G6dn2nTQy4pPQKb7HgVw8Imms71QjDEAPJjB-rjg'
)

const getClientList = () => {
  return supabaseClient.from('clients').select()
}

const insertClient = (client) => {
  return supabaseClient.from('clients').insert([client])
}

export default {
  supabaseClient,
  getClientList,
  insertClient,
}
