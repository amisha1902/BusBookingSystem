import axiosInstance from './axiosConfig'

export const getAllOperators = async () => {
  const response = await axiosInstance.get('/bus_operators')
  return response.data
}

export const getOperator = async (id) => {
  const response = await axiosInstance.get(`/bus_operators/${id}`)
  return response.data
}

export const createOperator = async (operatorData) => {
  const response = await axiosInstance.post('/bus_operators', {
    bus_operator: operatorData,
  })
  return response.data
}

export const updateOperator = async (id, operatorData) => {
  const response = await axiosInstance.put(`/bus_operators/${id}`, {
    bus_operator: operatorData,
  })
  return response.data
}

export const deleteOperator = async (id) => {
  const response = await axiosInstance.delete(`/bus_operators/${id}`)
  return response.data
}