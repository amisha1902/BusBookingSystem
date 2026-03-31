import axiosInstance from './axiosConfig'

export const passengerRegister = async (passengerData) => {
  const response = await axiosInstance.post('/auth/passenger/register', {
    passenger: passengerData,
  })
  return response.data
}

export const operatorRegister = async (operatorData) => {
  const response = await axiosInstance.post('/auth/operator/register', {
    bus_operator: operatorData,
  })
  return response.data
}

export const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/sign_in', {
    email,
    password,
  })

  if (response.data.token) {
    localStorage.setItem('authToken', response.data.token)
  }

  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }

  return response.data
}

export const logout = async () => {
  try {
    await axiosInstance.delete('/auth/sign_out')
  } finally {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  return true
}

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me')
  return response.data
}