import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useAxios } from '../../hooks/useAxios'
import { login } from '../../api/authApi'
import Alert from '../../components/Common/Alert'
import LoadingSpinner from '../../components/Common/Spinner'
import { validateEmail, validatePassword } from '../../utils/validators'
import { formatError } from '../../utils/helpers'
import './auth.css'

export default function Login() {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()
  const { execute, loading } = useAxios()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [alert, setAlert] = useState({ type: '', message: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const response = await execute(() =>
        login(formData.email, formData.password)
      )
      localStorage.setItem('token', response.token)

      localStorage.setItem('user', JSON.stringify(response.user))

      const userData = {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
        name: response.user.name || response.user.company_name,
      }

      authLogin(userData)

      setAlert({
        type: 'success',
        message: 'Login successful! Redirecting...',
      })

      setTimeout(() => {
        const redirectPath = userData.role === 'operator' ? '/operator/dashboard' : '/dashboard'
        navigate(redirectPath)
      }, 1500)
    } catch (error) {
      setAlert({
        type: 'danger',
        message: formatError(error),
      })
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg border-0 auth-card">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4 text-primary">
                Welcome Back
              </h2>

              {alert.message && (
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert({ type: '', message: '' })}
                />
              )}

              {loading && <LoadingSpinner message="Logging in..." />}

              {!loading && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-500">Email Address</label>
                    <input
                      type="email"
                      className={`form-control form-control-lg ${
                        errors.email ? 'is-invalid' : ''
                      }`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-500">Password</label>
                    <input
                      type="password"
                      className={`form-control form-control-lg ${
                        errors.password ? 'is-invalid' : ''
                      }`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                    />
                    {errors.password && (
                      <div className="invalid-feedback d-block">
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
              )}

              <hr />

              <p className="text-center text-muted mb-3">
                Don't have an account?
              </p>

              <div className="d-grid gap-2">
                <Link
                  to="/signup/passenger"
                  className="btn btn-outline-primary btn-sm"
                >
                  Sign Up as Passenger
                </Link>
                <Link
                  to="/signup/operator"
                  className="btn btn-outline-success btn-sm"
                >
                  Sign Up as Operator
                </Link>
              </div>

              <p className="text-center text-muted mt-3">
                <Link to="/" className="text-decoration-none">
                  Back to Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}