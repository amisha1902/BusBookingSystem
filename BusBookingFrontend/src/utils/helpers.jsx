export const formatError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message) {
    return error.message
  }
  return 'An unexpected error occurred'
}

export const getErrorMessage = (errors, fieldName) => {
  return errors[fieldName] || ''
}

export const hasError = (errors, fieldName) => {
  return !!errors[fieldName]
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

export const formatTime = (time) => {
  return new Date(`2024-01-01T${time}`).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}