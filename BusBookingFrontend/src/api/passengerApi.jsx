import axiosConfig from './axiosConfig'

const passengerApi = {
    //trip search
    /**
     * Search trips by source, destination, and date
     * GET /api/v1/trips?source=X&destination=Y&date=Z
     */
    searchTrips: async (filters) => {
        const { source, destination, date } = filters
        const response = await axiosConfig.get('/trips/search', {
            params: { source, destination, date },
        })
        return response.data
    },

    /**
     * Get all available trips
     * GET /api/v1/trips
     */
    getAllTrips: async () => {
        const response = await axiosConfig.get('/trips')
        return response.data
    },

    /**
     * Get single trip details with seat layout
     * GET /api/v1/trips/:id
     */
    getTripDetails: async (tripId) => {
        const response = await axiosConfig.get(`/trips/${tripId}`)
        return response.data
    },
    /**
       * Cancel a trip
       * PATCH /api/v1/trips/:id/cancel
       */
    cancelTrip: async (tripId) => {
        const response = await axiosConfig.patch(`/trips/${tripId}/cancel`)
        return response.data
    },

    //boarding point and droppoints
    /**
   * Get boarding points for a trip
   * GET /api/v1/trips/:id/boarding_points
   */
 getBoardingPoints: async (tripId, city) => {
  const response = await axiosConfig.get(`/trips/${tripId}/boarding_points`, {
    params: { city }
  })
  return response.data
},

getDropPoints: async (tripId, city) => {
  const response = await axiosConfig.get(`/trips/${tripId}/drop_points`, {
    params: { city }
  })
  return response.data
},
    /**
     * Get all stops for a specific trip route
     * GET /api/v1/trips/:tripId/stops
     */
    getTripStops: async (tripId) => {
        const response = await axiosConfig.get(`/trips/${tripId}/stops`)
        return response.data
    },

    //======booking===
    /**
     * Create new booking
     * POST /api/v1/bookings
     */
    createBooking: async (bookingData) => {
        const response = await axiosConfig.post('/bookings', bookingData)
        return response.data
    },

    /**
     * Get all bookings for logged-in passenger
     * GET /api/v1/bookings
     */
    getMyBookings: async () => {
        const response = await axiosConfig.get('/bookings')
        return response.data
    },

    /**
     * Get single booking details
     * GET /api/v1/bookings/:id
     */
    getBookingDetails: async (bookingId) => {
        const response = await axiosConfig.get(`/bookings/${bookingId}`)
        return response.data
    },

    /**
     * Cancel booking
     * DELETE /api/v1/bookings/:id/cancel
     */
    cancelBooking: async (bookingId) => {
        const response = await axiosConfig.delete(`/bookings/${bookingId}/cancel`)
        return response.data
    },

    // ======payments ==========

    /**
     * Process payment for a booking
     * POST /api/v1/payments
     */
    processPayment: async (bookingId) => {
        const response = await axiosConfig.post('/payments', {
            booking_id: bookingId,
        })
        return response.data
    },

    /**
     * Get payment status
     * GET /api/v1/payments/:bookingId
     */
    getPaymentStatus: async (bookingId) => {
        const response = await axiosConfig.get(`/payments/${bookingId}`)
        return response.data
    },
}

export default passengerApi