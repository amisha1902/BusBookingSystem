import { useState, useCallback } from 'react'
import adminApi from '../api/adminApi'
import { formatError } from '../utils/helpers'

export const useAdmin = () => {
  // ==================== STATE ====================
  const [users, setUsers] = useState([])
  const [operators, setOperators] = useState([])
  const [routes, setRoutes] = useState([])
  const [trips, setTrips] = useState([])
  const [routeStops, setRouteStops] = useState([])

  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedOperator, setSelectedOperator] = useState(null)
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [selectedTrip, setSelectedTrip] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
  })

  // ==================== USERS ====================

  const fetchAllUsers = useCallback(async (page = 1, filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.getAllUsers(page, filters)
      setUsers(response.passengers || response.data || [])
      setPagination({
        currentPage: response.page || page,
        totalPages: response.total_pages || 1,
        totalRecords: response.total || 0,
      })
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Fetch users error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getUserDetails = useCallback(async (userId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.getUserDetails(userId)
      setSelectedUser(response.user || response.data || response)
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Get user details error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUserStatus = useCallback(async (userId, isActive) => {
    setLoading(true)
    setError(null)

    try {
      const response = await adminApi.updateUserStatus(userId, isActive)

      setUsers(users.map(u =>
        u.id === userId ? { ...u, is_active: isActive } : u
      ))

      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Update user status error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [users])

  const deleteUser = useCallback(async (userId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.deleteUser(userId)
      setUsers(users.filter(u => u.id !== userId))
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Delete user error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [users])

  const searchUsers = useCallback(async (filters) => {
    setLoading(true)
    setError(null)

    try {
      const response = await adminApi.searchUsers(filters)

      setUsers(response.users || response.data || [])

      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Search users error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }

  }, [])

  // ==================== BUS OPERATORS ====================

  const fetchAllOperators = useCallback(async (page = 1, filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.getAllOperators(page, filters)
      setOperators(response.operators || response.data || [])
      setPagination({
        currentPage: response.page || page,
        totalPages: response.total_pages || 1,
        totalRecords: response.total || 0,
      })
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Fetch operators error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getOperatorDetails = useCallback(async (operatorId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.getOperatorDetails(operatorId)
      setSelectedOperator(response.operator || response.data || response)
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Get operator details error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const verifyOperator = useCallback(async (operatorId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.verifyOperator(operatorId)
      setOperators(operators.map(o =>
        o.id === operatorId ? { ...o, is_verified: true } : o
      ))
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Verify operator error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [operators])

  const updateOperator = useCallback(async (operatorId, data) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.updateOperator(operatorId, data)
      setOperators(operators.map(o =>
        o.id === operatorId ? { ...o, ...data } : o
      ))
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Update operator error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [operators])

  const deleteOperator = useCallback(async (operatorId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.deleteOperator(operatorId)
      setOperators(operators.filter(o => o.id !== operatorId))
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Delete operator error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [operators])

  const searchOperators = useCallback(async (searchQuery, status = '') => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.searchOperators(searchQuery, status)
      setOperators(response.operators || response.data || [])
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Search operators error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ==================== ROUTES ====================

  const fetchAllRoutes = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const res = await adminApi.getAllRoutes(page)
      setRoutes(res.data || [])
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }, [])


  const getRouteDetails = useCallback(async (routeId) => {
    setLoading(true)
    try {
      const res = await adminApi.getRouteDetails(routeId)
      setSelectedRoute(res.data)
      setRouteStops(res.data?.stops || [])
    } catch (err) {
      setError(formatError(err))
    } finally {
      setLoading(false)
    }
  }, [])


  const createRoute = useCallback(async (data) => {
    const res = await adminApi.createRoute(data)
    setRoutes(prev => [...prev, res.data])
  }, [])


  const updateRoute = useCallback(async (id, data) => {
    const res = await adminApi.updateRoute(id, data)
    setRoutes(prev =>
      prev.map(r => r.id === id ? res.data : r)
    )
  }, [])


  const deleteRoute = useCallback(async (id) => {
    await adminApi.deleteRoute(id)
    setRoutes(prev => prev.filter(r => r.id !== id))
  }, [])


  const searchRoutes = useCallback(async (query) => {
    const res = await adminApi.searchRoutes(query)
    setRoutes(res.data || [])
  }, [])



  // ROUTE STOPS

  const fetchRouteStops = useCallback(async (routeId) => {
    const res = await adminApi.getRouteStops(routeId)
    setRouteStops(res.data || [])
  }, [])


  const addRouteStop = useCallback(async (routeId, data) => {
    const res = await adminApi.addRouteStop(routeId, data)
    setRouteStops(prev => [...prev, res.data])
  }, [])

  const updateRouteStop = useCallback(async (routeId, stopId, stopData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.updateRouteStop(routeId, stopId, stopData)
      setRouteStops(prev =>
        prev.map(stop => (stop.id === stopId ? { ...stop, ...stopData } : stop))
      )
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteRouteStop = useCallback(async (routeId, stopId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.deleteRouteStop(routeId, stopId)
      setRouteStops(prev => prev.filter(stop => stop.id !== stopId))
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ==================== TRIPS ====================

  const fetchAllTrips = useCallback(async (page = 1, filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.getAllTrips(page, filters)
      setTrips(response.trips || response.data || [])
      setPagination({
        currentPage: response.page || page,
        totalPages: response.total_pages || 1,
        totalRecords: response.total || 0,
      })
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Fetch trips error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getTripDetails = useCallback(async (tripId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.getTripDetails(tripId)
      setSelectedTrip(response.trip || response.data || response)
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Get trip details error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createTrip = useCallback(async (tripData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.createTrip(tripData)
      setTrips([...trips, response.trip || response.data || response])
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Create trip error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [trips])

  const cancelTrip = useCallback(async (tripId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.cancelTrip(tripId)
      setTrips(trips.map(t =>
        t.id === tripId ? { ...t, status: 'cancelled' } : t
      ))
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Cancel trip error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [trips])

  const deleteTrip = useCallback(async (tripId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.deleteTrip(tripId)
      setTrips(trips.filter(t => t.id !== tripId))
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Delete trip error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [trips])

  const searchTrips = useCallback(async (searchQuery, filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.searchTrips(searchQuery, filters)
      setTrips(response.trips || response.data || [])
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Search trips error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getTripsByStatus = useCallback(async (status, page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.getTripsByStatus(status, page)
      setTrips(response.trips || response.data || [])
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Get trips by status error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getTripsByDateRange = useCallback(async (fromDate, toDate, page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const response = await adminApi.getTripsByDateRange(fromDate, toDate, page)
      setTrips(response.trips || response.data || [])
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Get trips by date range error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ==================== UTILITIES ====================

  const clearError = useCallback(() => setError(null), [])

  const resetState = useCallback(() => {
    setUsers([])
    setOperators([])
    setRoutes([])
    setTrips([])
    setRouteStops([])
    setSelectedUser(null)
    setSelectedOperator(null)
    setSelectedRoute(null)
    setSelectedTrip(null)
    setError(null)
  }, [])

  return {
    // State
    users,
    operators,
    routes,
    trips,
    routeStops,
    selectedUser,
    selectedOperator,
    selectedRoute,
    selectedTrip,
    loading,
    error,
    pagination,

    // Users
    fetchAllUsers,
    getUserDetails,
    updateUserStatus,
    deleteUser,
    searchUsers,

    // Operators
    fetchAllOperators,
    getOperatorDetails,
    verifyOperator,
    updateOperator,
    deleteOperator,
    searchOperators,

    // Routes
    fetchAllRoutes,
    getRouteDetails,
    createRoute,
    updateRoute,
    deleteRoute,
    searchRoutes,

    // Route Stops
    fetchRouteStops,
    addRouteStop,
    updateRouteStop,
    deleteRouteStop,

    // Trips
    fetchAllTrips,
    getTripDetails,
    createTrip,
    cancelTrip,
    deleteTrip,
    searchTrips,
    getTripsByStatus,
    getTripsByDateRange,

    // Utilities
    clearError,
    resetState,
  }
}

export default useAdmin