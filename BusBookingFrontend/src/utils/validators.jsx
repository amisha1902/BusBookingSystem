export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validatePasswordMatch = (password, confirmation) => {
  return password === confirmation
}

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

export const validateForm = (formData, requiredFields) => {
  const errors = {}

  requiredFields.forEach((field) => {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = `${field.replace(/_/g, ' ')} is required`
    }
  })

  return errors
}