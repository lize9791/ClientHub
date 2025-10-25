<template>
  <div>
    <img
      src="https://lz-clients1.oss-cn-beijing.aliyuncs.com/uploads/1761293323832_15x10m%20plan.png?Expires=1761293648&OSSAccessKeyId=TMP.3KniBHhT8zNZsvAyVyjHZytvr9LsreLsyRp8mE3MJZ2Qg15TjLnRseGhnBBuM8ySRtriXfyvcp3UsbdNrgntoDhBTPDU8a&Signature=2yIS8W2sGDajGh%2B6OvZUQvquETU%3D"
      alt=""
    />
  </div>
  <div>
    <input
      type="file"
      @change="handleFile"
    />
    <p v-if="fileUrl">
      上传成功：
      <a
        :href="fileUrl"
        target="_blank"
      >
        {{ fileUrl }}
      </a>
    </p>
  </div>
</template>

<script setup>
  import OSS from 'ali-oss'
  import { ref } from 'vue'
  import { createClient } from '@supabase/supabase-js'

  // Create a single supabase client for interacting with your database
  const supabase = createClient(
    'https://pqbneojpksizuigsglce.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxYm5lb2pwa3NpenVpZ3NnbGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyODcxMDgsImV4cCI6MjA3Njg2MzEwOH0.lr8G6dn2nTQy4pPQKb7HgVw8Imms71QjDEAPJjB-rjg'
  )
  const a = async () => {
    const res = await supabase.from('clients').select()
    console.log(res)
  }
  a()
  const fileUrl = ref('')
  // 初始化 OSS 客户端
  const client = new OSS({
    region: 'oss-cn-beijing', // 替换你的 Region
    accessKeyId: process.env.VUE_APP_ALIBABA_ACCESS_KEY_ID, // 替换你的 AccessKeyId
    accessKeySecret: process.env.VUE_APP_ALIBABA_ACCESS_KEY_SECRET, // 替换你的 AccessKeySecret
    bucket: 'lz-clients1', // 替换你的 Bucket 名称
  })
  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      // 生成文件名（避免重复）
      const fileName = `uploads/${Date.now()}_${file.name}`
      const result = await client.put(fileName, file)
      console.log('上传成功：', result.url)
      fileUrl.value = result.url
    } catch (err) {
      console.error('上传失败：', err)
    }
  }
</script>
