import { useState } from 'react'

export default function PassengerDetailsForm({
  seatNumber,
  passengerIndex,
  onChange,
}) {
  const [details, setDetails] = useState({
    name: '',
    age: '',
    gender: 'male',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedDetails = {
      ...details,
      [name]: value,
    }
    setDetails(updatedDetails)

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }

    // Notify parent
    onChange(updatedDetails)

    // Validate
    validateField(name, value)
  }

  const validateField = (name, value) => {
    const newErrors = { ...errors }

    if (name === 'name' && !value.trim()) {
      newErrors.name = 'Name is required'
    } else if (name === 'name' && value.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else {
      delete newErrors.name
    }

    if (name === 'age') {
      if (!value) {
        newErrors.age = 'Age is required'
      } else if (value < 1 || value > 120) {
        newErrors.age = 'Enter a valid age'
      } else {
        delete newErrors.age
      }
    }

    setErrors(newErrors)
  }

  return (
    <div className="passenger-form">
      <h6 className="mb-3 fw-bold">
        Passenger {passengerIndex + 1} (Seat {seatNumber})
      </h6>

      <div className="row g-3">
        {/* Name */}
        <div className="col-md-6">
          <label className="form-label fw-600">Full Name *</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            name="name"
            value={details.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />
          {errors.name && (
            <div className="invalid-feedback d-block">{errors.name}</div>
          )}
        </div>

        {/* Age */}
        <div className="col-md-3">
          <label className="form-label fw-600">Age *</label>
          <input
            type="number"
            className={`form-control ${errors.age ? 'is-invalid' : ''}`}
            name="age"
            value={details.age}
            onChange={handleChange}
            placeholder="Age"
            min="1"
            max="120"
          />
          {errors.age && (
            <div className="invalid-feedback d-block">{errors.age}</div>
          )}
        </div>

        {/* Gender */}
        <div className="col-md-3">
          <label className="form-label fw-600">Gender *</label>
          <select
            className="form-select"
            name="gender"
            value={details.gender}
            onChange={handleChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  )
}