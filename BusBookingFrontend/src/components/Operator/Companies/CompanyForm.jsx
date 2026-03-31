import { useState } from 'react'

export default function CompanyForm({
  onSubmit,
  onCancel,
  initialData = {
    company_name: '',
    license_no: '',
    contact_email: '',
  },
  isEditing = false,
}) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})

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

    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Company name is required'
    }

    if (!formData.license_no.trim()) {
      newErrors.license_no = 'License number is required'
    }

    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Contact email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email format'
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
    <div className="company-form card mb-4 border-0 shadow-sm">
      <div className="card-body">
        <h5 className="mb-3">
          {isEditing ? '✏️ Edit Company' : '➕ Register New Company'}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-500">Company Name</label>
            <input
              type="text"
              className={`form-control ${errors.company_name ? 'is-invalid' : ''}`}
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="Enter company name"
            />
            {errors.company_name && (
              <div className="invalid-feedback d-block">{errors.company_name}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-500">License Number</label>
            <input
              type="text"
              className={`form-control ${errors.license_no ? 'is-invalid' : ''}`}
              name="license_no"
              value={formData.license_no}
              onChange={handleChange}
              placeholder="Enter license number"
            />
            {errors.license_no && (
              <div className="invalid-feedback d-block">{errors.license_no}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label fw-500">Contact Email</label>
            <input
              type="email"
              className={`form-control ${errors.contact_email ? 'is-invalid' : ''}`}
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              placeholder="Enter contact email"
            />
            {errors.contact_email && (
              <div className="invalid-feedback d-block">{errors.contact_email}</div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary flex-grow-1">
              {isEditing ? 'Update Company' : 'Create Company'}
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
