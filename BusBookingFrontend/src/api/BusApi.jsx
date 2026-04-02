import axiosInstance from './axiosConfig'

export const getBuses = async (operatorId) => {
  const response = await axiosInstance.get(
    `/bus_operators/${operatorId}/buses`
  )
  return response.data
}

export const getBus = async (operatorId, busId) => {
  const response = await axiosInstance.get(
    `/bus_operators/${operatorId}/buses/${busId}`
  )
  return response.data
}

export const createBus = async (operatorId, busData) => {
  const response = await axiosInstance.post(
    `/bus_operators/${operatorId}/buses`,
    { bus: busData }
  )
  return response.data
}

export const updateBus = async (operatorId, busId, busData) => {
  const response = await axiosInstance.put(
    `/bus_operators/${operatorId}/buses/${busId}`,
    { bus: busData }
  )
  return response.data
}

export const deleteBus = async (operatorId, busId) => {
  const response = await axiosInstance.delete(
    `/bus_operators/${operatorId}/buses/${busId}`
  )
  return response.data
}