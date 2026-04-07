import { useState, useCallback } from 'react'
import passengerApi from '../api/passengerApi'
import { formatError } from '../utils/helpers'

export const usePassenger = () => {
  const [trips, setTrips] = useState([])
  const [bookings, setBookings] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [boardingPoints, setBoardingPoints] = useState([])
  const [dropPoints, setDropPoints] = useState([])
  const [tripStops, setTripStops] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [searchFilters, setSearchFilters] = useState({
    source: '',
    destination: '',
    date: '',
  })

  // ==================== TRIPS ====================

  const searchTrips = useCallback(async (filters) => {
    setLoading(true)
    setError(null)
    try {
      const response = await passengerApi.searchTrips(filters)
      setTrips(response.trips || response.data || [])
      setSearchFilters(filters)
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

  const getAllTrips = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await passengerApi.getAllTrips()
      setTrips(response.trips || response.data || [])
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Get all trips error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getTripDetails = useCallback(async (tripId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await passengerApi.getTripDetails(tripId)
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

  const cancelTrip = useCallback(async (tripId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await passengerApi.cancelTrip(tripId)
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Cancel trip error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getTripStops = useCallback(async (tripId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await passengerApi.getTripStops(tripId)
      setTripStops(response.stops || response.data || [])
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Get trip stops error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ==================== BOARDING & DROP POINTS ====================

 // usePassenger.jsx

const fetchBoardingPoints = useCallback(async (tripId, city) => {
  setLoading(true)
  setError(null)
  try {
    const response = await passengerApi.getBoardingPoints(tripId, city)
    setBoardingPoints(response.data || [])
    return response
  } catch (err) {
    const errorMsg = formatError(err)
    setError(errorMsg)
    console.error('Fetch boarding points error:', errorMsg)
    throw err
  } finally {
    setLoading(false)
  }
}, [])

const fetchDropPoints = useCallback(async (tripId, city) => {
  setLoading(true)
  setError(null)
  try {
    const response = await passengerApi.getDropPoints(tripId, city)
    setDropPoints(response.data || [])
    return response
  } catch (err) {
    const errorMsg = formatError(err)
    setError(errorMsg)
    console.error('Fetch drop points error:', errorMsg)
    throw err
  } finally {
    setLoading(false)
  }
}, [])


  // ==================== BOOKINGS ====================

  /**
   * @param {Object} bookingData 
   * @throws {Error} 
   */
  const validateBookingData = (bookingData) => {
    if (!bookingData.trip_id) {
      throw new Error('Trip ID is required')
    }

    if (!bookingData.seat_ids || !Array.isArray(bookingData.seat_ids) || bookingData.seat_ids.length === 0) {
      throw new Error('At least one seat must be selected')
    }

    if (!bookingData.boarding_stop_id) {
      throw new Error('Boarding point is required')
    }

    if (!bookingData.drop_stop_id) {
      throw new Error('Drop point is required')
    }
    if (!bookingData.passengers || !Array.isArray(bookingData.passengers) || bookingData.passengers.length === 0) {
      throw new Error('At least one passenger is required')
    }
    bookingData.passengers.forEach((passenger, index) => {
      if (!passenger.name || typeof passenger.name !== 'string' || !passenger.name.trim()) {
        throw new Error(`Passenger ${index + 1}: Name is required and must be valid`)
      }

      if (passenger.age === null || passenger.age === undefined || passenger.age < 1 || passenger.age > 120) {
        throw new Error(`Passenger ${index + 1}: Age must be between 1 and 120`)
      }

      if (!['male', 'female', 'other'].includes(passenger.gender?.toLowerCase())) {
  throw new Error(`Passenger ${index+1}: Gender must be selected`);
}
    })
    if (bookingData.seat_ids.length !== bookingData.passengers.length) {
      throw new Error(`Number of seats (${bookingData.seat_ids.length}) must match number of passengers (${bookingData.passengers.length})`)
    }
  }

  const createBooking = useCallback(async (bookingData) => {
    setLoading(true)
    setError(null)

    try {
      console.log('Creating booking with payload:', JSON.stringify(bookingData, null, 2))
      validateBookingData(bookingData)
      const response = await passengerApi.createBooking(bookingData)

      console.log('Booking created successfully:', response)
      if (!response.booking_id && !response.id) {
  console.log('Booking created but no ID returned', response)
}
      await fetchMyBookings()

      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Create booking error:', errorMsg, err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMyBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await passengerApi.getMyBookings()
      console.log(response)
      setBookings(response ||response.bookings || response.data || [] )
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Fetch bookings error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getBookingDetails = useCallback(async (bookingId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await passengerApi.getBookingDetails(bookingId)
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Get booking details error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const cancelBooking = useCallback(async (bookingId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await passengerApi.cancelBooking(bookingId)
      await fetchMyBookings()
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Cancel booking error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ==================== PAYMENTS ====================

  const processPayment = useCallback(async (bookingId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await passengerApi.processPayment(bookingId)
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Process payment error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getPaymentStatus = useCallback(async (bookingId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await passengerApi.getPaymentStatus(bookingId)
      return response
    } catch (err) {
      const errorMsg = formatError(err)
      setError(errorMsg)
      console.error('Get payment status error:', errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // ==================== UTILITIES ====================

  const clearError = useCallback(() => setError(null), [])
  const resetSearch = useCallback(() => {
    setTrips([])
    setSearchFilters({ source: '', destination: '', date: '' })
    setError(null)
  }, [])

  return {
    trips,
    bookings,
    selectedTrip,
    boardingPoints,
    dropPoints,
    tripStops,
    loading,
    error,
    searchFilters,

    searchTrips,
    getAllTrips,
    getTripDetails,
    cancelTrip,
    getTripStops,

    fetchBoardingPoints,
    fetchDropPoints,

    createBooking,
    fetchMyBookings,
    getBookingDetails,
    cancelBooking,

    processPayment,
    getPaymentStatus,

    clearError,
    resetSearch,
  }
}