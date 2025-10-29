export const statusMap = {
  1: { color: '#28a745', label: '样品已成交' },
  2: { color: '#ffc107', label: '洽谈中' },
  3: { color: '#fd7e14', label: '排产中' },
  4: { color: '#007bff', label: '已完成' },
  5: { color: '#6f42c1', label: '新一轮洽谈' },
  6: { color: '#dc3545', label: '已被他人成交' },
  7: { color: '#6c757d', label: '潜在客户' },
  8: { color: '#ffc107', label: '高价值客户' },
  9: { color: '#adb5bd', label: '无回复' },
  10: { color: '#343a40', label: '不可执行' },
  11: { color: '#17a2b8', label: '低优先级' },
}

export const originMap = {
  1: '阿里询盘',
  2: 'WhatsApp',
  3: 'FaceBook',
  4: 'Twitter',
  5: 'Instagram',
  6: '邮箱',
}

export const followUpMethodMap = {
  1: '阿里卖家',
  2: 'WhatsApp',
  3: 'FaceBook',
  4: 'Twitter',
  5: 'Instagram',
  6: '邮箱',
}

export const plateColorMap = {
  1: '#2F85F1',
  2: '#25D366',
  3: '#0866FF',
  4: '#000000',
  5: '#FE2D65',
  6: '#EA403D',
}

export const languageMap = {
  english: '英语',
  chinese: '汉语',
  spanish: '西班牙语',
  arabic: '阿拉伯语',
  french: '法语',
  german: '德语',
  russian: '俄语',
  japanese: '日语',
  portuguese: '葡萄牙语',
  hindi: '印地语',
  bengali: '孟加拉语',
  korean: '韩语',
  italian: '意大利语',
  turkish: '土耳其语',
  thai: '泰语',
  vietnamese: '越南语',
  polish: '波兰语',
  urdu: '乌尔都语',
  indonesian: '印尼语',
  dutch: '荷兰语',
}

export function numberToChinese(num) {
  const units = ['', '十', '百', '千', '万', '十', '百', '千', '亿']
  const chars = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']

  if (typeof num !== 'number' || isNaN(num)) return ''

  let str = num.toString()
  let result = ''
  let zero = false

  for (let i = 0; i < str.length; i++) {
    const digit = parseInt(str[str.length - 1 - i])
    const unit = units[i]

    if (digit === 0) {
      if (!zero && result !== '') {
        result = chars[0] + result
      }
      zero = true
    } else {
      result = chars[digit] + unit + result
      zero = false
    }
  }

  // 处理特殊情况
  result = result.replace(/^一十/, '十') // “一十”→“十”
  result = result.replace(/零+$/, '') // 去掉末尾多余的零
  result = result.replace(/零+/g, '零') // 连续零压缩

  return result
}
