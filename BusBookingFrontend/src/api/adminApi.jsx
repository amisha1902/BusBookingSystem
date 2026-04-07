import axiosConfig from './axiosConfig'

const adminApi = {
    // ==================== Users ====================

    /**
     * Get all users with optional filters
     * GET /api/v1/admin/users
     */
    getAllUsers: async (page = 1, filters = {}) => {
        const response = await axiosConfig.get('/admin/users', {
            params: { page, ...filters },
        })
        return response.data
    },

    /**
     * Get single user details
     * GET /api/v1/admin/users/:id
     */
    getUserDetails: async (userId) => {
        const response = await axiosConfig.get(`/admin/users/${userId}`)
        return response.data
    },

    /**
     * Update user status (active/inactive)
     * PATCH /api/v1/admin/users/:id
     */
    updateUserStatus: async (id, isActive) => {
        const response = await axiosConfig.patch(`/admin/users/${id}/update_status`, {
            is_active: isActive
        })

        return response.data
    }
    ,
    /**
     * Delete user
     * DELETE /api/v1/admin/users/:id
     */
    deleteUser: async (userId) => {
        const response = await axiosConfig.delete(`/admin/users/${userId}`)
        return response.data
    },

    /**
     * Search users by name or email
     * GET /api/v1/admin/users?search=query
     */
    searchUsers: async (filters) => {
        const response = await axiosConfig.get('/admin/users', {
            params: filters
        })
        return response.data
    },
    // ==================== BUS OPERATORS ====================

    /**
     * Get all bus operators
     * GET /api/v1/admin/bus_operators
     */
    getAllOperators: async (page = 1, filters = {}) => {
        const response = await axiosConfig.get('/admin/bus_operators', {
            params: { page, ...filters },
        })
        return response.data
    },

    /**
     * Get single operator details
     * GET /api/v1/admin/bus_operators/:id
     */
    getOperatorDetails: async (operatorId) => {
        const response = await axiosConfig.get(`/admin/bus_operators/${operatorId}`)
        return response.data
    },

    /**
     * Verify a pending operator
     * PATCH /api/v1/admin/bus_operators/:id/verify
     */
    verifyOperator: async (operatorId) => {
        const response = await axiosConfig.patch(`/admin/bus_operators/${operatorId}/verify`)
        return response.data
    },

    /**
     * Update operator details
     * PATCH /api/v1/admin/bus_operators/:id
     */
    updateOperator: async (operatorId, data) => {
        const response = await axiosConfig.patch(`/admin/bus_operators/${operatorId}`, {
            bus_operator: data,
        })
        return response.data
    },

    /**
     * Delete operator
     * DELETE /api/v1/admin/bus_operators/:id
     */
    deleteOperator: async (operatorId) => {
        const response = await axiosConfig.delete(`/admin/bus_operators/${operatorId}`)
        return response.data
    },

    /**
     * Search operators by name or email
     * GET /api/v1/admin/bus_operators?search=query
     */
    searchOperators: async (searchQuery, status = '') => {
        const response = await axiosConfig.get('/admin/bus_operators', {
            params: { search: searchQuery, status },
        })
        return response.data
    },

    // ======= ROUTES ========

    getAllRoutes: async (page = 1, filters = {}) => {
        const res = await axiosConfig.get("/admin/routes", {
            params: { page, ...filters }
        })
        return res.data
    },

    getRouteDetails: async (routeId) => {
        const res = await axiosConfig.get(`/admin/routes/${routeId}`)
        return res.data
    },

    createRoute: async (routeData) => {
        const res = await axiosConfig.post("/admin/routes", {
            route: routeData
        })
        return res.data
    },

    updateRoute: async (routeId, routeData) => {
        const res = await axiosConfig.patch(`/admin/routes/${routeId}`, {
            route: routeData
        })
        return res.data
    },

    deleteRoute: async (routeId) => {
        const res = await axiosConfig.delete(`/admin/routes/${routeId}`)
        return res.data
    },

    searchRoutes: async (searchQuery) => {
        const res = await axiosConfig.get("/admin/routes", {
            params: { search: searchQuery }
        })
        return res.data
    },


    // ROUTE STOPS

    getRouteStops: async (routeId) => {
        const res = await axiosConfig.get(`/admin/routes/${routeId}/route_stops`)
        return res.data
    },

    addRouteStop: async (routeId, stopData) => {
        const res = await axiosConfig.post(
            `/admin/routes/${routeId}/route_stops`,
            { route_stop: stopData }
        )
        return res.data
    },

    updateRouteStop: async (routeId, stopId, stopData) => {
        const res = await axiosConfig.patch(
            `/admin/routes/${routeId}/route_stops/${stopId}`,
            { route_stop: stopData }
        )
        return res.data
    },

    deleteRouteStop: async (routeId, stopId) => {
        const res = await axiosConfig.delete(
            `/admin/routes/${routeId}/route_stops/${stopId}`
        )
        return res.data
    },

    // ==================== TRIPS ====================

    /**
     * Get all trips 
     * GET /api/v1/admin/trips
     */
    getAllTrips: async (page = 1, filters = {}) => {
        const response = await axiosConfig.get('/admin/trips', {
            params: { page, ...filters },
        })
      console.log("Fetched trips:", response.data)
        return response.data
    },

    /**
     * Get single trip details
     * GET /api/v1/admin/trips/:id
     */
    getTripDetails: async (tripId) => {
        const response = await axiosConfig.get(`/admin/trips/${tripId}`)
        return response.data
    },

    /**
     * Create new trip
     * POST /api/v1/admin/trips
     */
    createTrip: async (tripData) => {
        const response = await axiosConfig.post('/admin/trips', {
            trip: tripData,
        })
        return response.data
    },

    /**
     * Cancel trip
     * PATCH /api/v1/admin/trips/:id/cancel
     */
    cancelTrip: async (tripId) => {
        const response = await axiosConfig.patch(`/admin/trips/${tripId}/cancel`)
        return response.data
    },

    /**
     * Delete trip
     * DELETE /api/v1/admin/trips/:id
     */
    deleteTrip: async (tripId) => {
        const response = await axiosConfig.delete(`/admin/trips/${tripId}`)
        return response.data
    },

    /**
     * Search trips by route or date
     * GET /api/v1/admin/trips?search=query
     */
    searchTrips: async (searchQuery, filters = {}) => {
        const response = await axiosConfig.get('/admin/trips', {
            params: { search: searchQuery, ...filters },
        })
        return response.data
    },

    /**
     * Filter trips by status
     * GET /api/v1/admin/trips?status=scheduled
     */
    getTripsByStatus: async (status, page = 1) => {
        const response = await axiosConfig.get('/admin/trips', {
            params: { status, page },
        })
        return response.data
    },

    /**
     * Get trips by date range
     * GET /api/v1/admin/trips?from_date=X&to_date=Y
     */
    getTripsByDateRange: async (fromDate, toDate, page = 1) => {
        const response = await axiosConfig.get('/admin/trips', {
            params: { from_date: fromDate, to_date: toDate, page },
        })
        return response.data
    },
}

export default adminApi