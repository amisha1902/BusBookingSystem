import { useState } from 'react'

export default function BusForm({
  onSubmit,
  onCancel,
  initialData = {
    bus_name: '',
    bus_no: '',
    bus_type: 'ac_seater',
    total_seats: 40,
  },
  isEditing = false,
}) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})

  const busTypes = [
    { value: 'ac_seater', label: 'AC Seater' },
    { value: 'non_ac_seater', label: 'Non-AC Seater' },
    { value: 'ac_sleeper', label: ' AC Sleeper' },
    { value: 'non_ac_sleeper', label: ' Non-AC Sleeper' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'total_seats' ? parseInt(value) : value,
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

    if (!formData.bus_name.trim()) {
      newErrors.bus_name = 'Bus name is required'
    }

    if (!formData.bus_no.trim()) {
      newErrors.bus_no = 'Bus number is required'
    }

    if (!formData.bus_type) {
      newErrors.bus_type = 'Bus type is required'
    }

    if (!formData.total_seats || formData.total_seats < 10) {
      newErrors.total_seats = 'Total seats must be at least 10'
    }

    if (formData.total_seats > 100) {
      newErrors.total_seats = 'Total seats cannot exceed 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="bus-form card mb-4 border-0 shadow-sm">
      <div className="card-body">
        <h5 className="mb-3">
          {isEditing ? '✏️ Edit Bus' : '➕ Add Bus'}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-500">Bus Name</label>
            <input
              type="text"
              className={`form-control ${errors.bus_name ? 'is-invalid' : ''}`}
              name="bus_name"
              value={formData.bus_name}
              onChange={handleChange}
              placeholder="e.g., Premium Express"
            />
            {errors.bus_name && (
              <div className="invalid-feedback d-block">{errors.bus_name}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-500">Bus Number</label>
            <input
              type="text"
              className={`form-control ${errors.bus_no ? 'is-invalid' : ''}`}
              name="bus_no"
              value={formData.bus_no}
              onChange={handleChange}
              placeholder="e.g., MH02AB1234"
            />
            {errors.bus_no && (
              <div className="invalid-feedback d-block">{errors.bus_no}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-500">Bus Type</label>
            <select
              className={`form-select ${errors.bus_type ? 'is-invalid' : ''}`}
              name="bus_type"
              value={formData.bus_type}
              onChange={handleChange}
            >
              <option value="">-- Select Bus Type --</option>
              {busTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.bus_type && (
              <div className="invalid-feedback d-block">{errors.bus_type}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-500">Total Seats</label>
            <input
              type="number"
              className={`form-control ${errors.total_seats ? 'is-invalid' : ''}`}
              name="total_seats"
              value={formData.total_seats}
              onChange={handleChange}
              min="10"
              max="100"
              placeholder="Enter number of seats"
            />
            {errors.total_seats && (
              <div className="invalid-feedback d-block">{errors.total_seats}</div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary flex-grow-1">
              {isEditing ? 'Update Bus' : 'Create Bus'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
