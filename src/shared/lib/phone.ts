// GREEN-API checkAccount supports only Russian (7) and Belarusian (375) numbers
const RU_PHONE = /^7\d{10}$/
const BY_PHONE = /^375\d{9}$/

export const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, '')

  // 8 900 ... is a common local format for Russian numbers
  if (digits.length === 11 && digits.startsWith('8')) {
    return `7${digits.slice(1)}`
  }

  return digits
}

export const isSupportedPhone = (digits: string) => RU_PHONE.test(digits) || BY_PHONE.test(digits)

export const formatPhone = (digits: string) => {
  if (RU_PHONE.test(digits)) {
    return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`
  }

  if (BY_PHONE.test(digits)) {
    return `+375 ${digits.slice(3, 5)} ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10)}`
  }

  return `+${digits}`
}
