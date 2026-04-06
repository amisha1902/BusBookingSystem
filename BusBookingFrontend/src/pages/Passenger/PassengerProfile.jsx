import { useState } from 'react'
// import './passenger.css'

export default function PassengerProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    dob: '1990-05-15',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
    // API call to update profile
  }

  return (
    <div className="passenger-profile py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">My Profile</h5>
                  {!isEditing && (
                    <button
                      className="btn btn-sm btn-light"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="card-body">
                {isEditing ? (
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    handleSave()
                  }}>
                    <div className="mb-3">
                      <label className="form-label fw-600">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-600">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        disabled
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-600">Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-600">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        name="dob"
                        value={profile.dob}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="mb-3 pb-3 border-bottom">
                      <p className="text-muted mb-1">Full Name</p>
                      <h6>{profile.name}</h6>
                    </div>

                    <div className="mb-3 pb-3 border-bottom">
                      <p className="text-muted mb-1">Email</p>
                      <h6>{profile.email}</h6>
                    </div>

                    <div className="mb-3 pb-3 border-bottom">
                      <p className="text-muted mb-1">Phone</p>
                      <h6>{profile.phone}</h6>
                    </div>

                    <div className="mb-3">
                      <p className="text-muted mb-1">Date of Birth</p>
                      <h6>{new Date(profile.dob).toLocaleDateString()}</h6>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}