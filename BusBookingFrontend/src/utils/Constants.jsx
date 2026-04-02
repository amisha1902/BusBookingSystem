export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

export const USER_TYPES = {
  PASSENGER: 'Passenger',
  OPERATOR: 'BusOperator',
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PASSENGER_SIGNUP: '/signup/passenger',
  OPERATOR_SIGNUP: '/signup/operator',
  DASHBOARD: '/dashboard',
  NOT_FOUND: '/404',
}

export const MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  ERROR: 'An error occurred',
  LOADING: 'Loading...',
}