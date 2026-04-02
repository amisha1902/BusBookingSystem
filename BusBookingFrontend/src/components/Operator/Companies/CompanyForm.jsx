import { useState } from 'react'

export default function CompanyForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.company_name) newErrors.company_name = 'Required'
    if (!formData.license_no) newErrors.license_no = 'Required'
    if (!formData.contact_email) newErrors.contact_email = 'Required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) onSubmit(formData)
  }

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <h5 className="fw-semibold mb-3">
          {isEditing ? 'Edit Company' : 'Add Company'}
        </h5>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            placeholder="Company Name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            placeholder="License No"
            name="license_no"
            value={formData.license_no}
            onChange={handleChange}
          />

          <input
            className="form-control mb-3"
            placeholder="Email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
          />

          <div className="d-flex gap-2">
            <button className="btn btn-primary w-100">
              {isEditing ? 'Update' : 'Create'}
            </button>
            <button type="button" className="btn btn-light" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}