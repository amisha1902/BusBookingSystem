import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAxios } from '../../hooks/useAxios'
import { passengerRegister } from '../../api/authApi'
import Alert from '../../components/Common/Alert'
import LoadingSpinner from '../../components/Common/Spinner'
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validatePhoneNumber,
  validateForm,
} from '../../utils/validators'
import { formatError, hasError } from '../../utils/helpers'
import './auth.css'

export default function PassengerSignup() {
  const navigate = useNavigate()
  const { execute, loading } = useAxios()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    dob: '',
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

  const validateFormData = () => {
    const newErrors = {}
    const requiredFields = ['name', 'email', 'phone', 'password', 'password_confirmation', 'dob']

    const requiredErrors = validateForm(formData, requiredFields)
    Object.assign(newErrors, requiredErrors)

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (formData.password && !validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (
      formData.password &&
      formData.password_confirmation &&
      !validatePasswordMatch(formData.password, formData.password_confirmation)
    ) {
      newErrors.password_confirmation = 'Passwords do not match'
    }

    if (formData.phone && !validatePhoneNumber(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateFormData()) {
      return
    }

    try {
      await execute(() =>
        passengerRegister({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          dob: formData.dob,
        })
      )

      setAlert({
        type: 'success',
        message: 'Signup successful! Redirecting to login...',
      })

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      setAlert({
        type: 'danger',
        message: formatError(error),
      })
    }
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg border-0 auth-card">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4 text-success">
                Passenger Signup
              </h2>

              {alert.message && (
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={() => setAlert({ type: '', message: '' })}
                />
              )}

              {loading && <LoadingSpinner message="Creating your account..." />}

              {!loading && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-500">Full Name</label>
                    <input
                      type="text"
                      className={`form-control ${
                        hasError(errors, 'name') ? 'is-invalid' : ''
                      }`}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                    {hasError(errors, 'name') && (
                      <div className="invalid-feedback d-block">
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-500">Email</label>
                    <input
                      type="email"
                      className={`form-control ${
                        hasError(errors, 'email') ? 'is-invalid' : ''
                      }`}
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                    {hasError(errors, 'email') && (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-500">Phone Number</label>
                    <input
                      type="tel"
                      className={`form-control ${
                        hasError(errors, 'phone') ? 'is-invalid' : ''
                      }`}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit phone number"
                    />
                    {hasError(errors, 'phone') && (
                      <div className="invalid-feedback d-block">
                        {errors.phone}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-500">Date of Birth</label>
                    <input
                      type="date"
                      className={`form-control ${
                        hasError(errors, 'dob') ? 'is-invalid' : ''
                      }`}
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                    {hasError(errors, 'dob') && (
                      <div className="invalid-feedback d-block">
                        {errors.dob}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-500">Password</label>
                    <input
                      type="password"
                      className={`form-control ${
                        hasError(errors, 'password') ? 'is-invalid' : ''
                      }`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                    />
                    {hasError(errors, 'password') && (
                      <div className="invalid-feedback d-block">
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-500">Confirm Password</label>
                    <input
                      type="password"
                      className={`form-control ${
                        hasError(errors, 'password_confirmation')
                          ? 'is-invalid'
                          : ''
                      }`}
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                    />
                    {hasError(errors, 'password_confirmation') && (
                      <div className="invalid-feedback d-block">
                        {errors.password_confirmation}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </button>
                </form>
              )}

              <hr />

              <p className="text-center text-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-decoration-none">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}