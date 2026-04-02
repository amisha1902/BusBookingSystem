import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        company_name: userData.company_name || ''
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('/api/v1/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser.data));
        setUser(updatedUser.data);
        setIsEditing(false);
        alert('Profile updated successfully');
      } else {
        setError('Failed to update profile');
      }
    } catch (err) {
      setError('Error updating profile: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4" style={{ background: '#f5f6f8', minHeight: '100vh' }}>
        <div className="text-center py-5">
          <div className="spinner-border" />
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4" style={{ background: '#f5f6f8', minHeight: '100vh' }}>
      
      <div className="mb-4 d-flex align-items-center justify-content-between">
        <div>
          <h2 className="fw-bold mb-1">Profile Settings</h2>
          <p className="text-muted mb-0">Manage your account details</p>
        </div>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate('/operator/dashboard')}
        >
          ← Back
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {error}
          <button className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <div className="row">
        
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">

              <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{
                    width: '70px',
                    height: '70px',
                    backgroundColor: '#ffe5e5',
                    color: '#dc3545',
                    fontSize: '28px'
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'O'}
                </div>

                <div className="ms-3">
                  <h5 className="mb-1 fw-bold">{user?.name}</h5>
                  <span className="badge bg-light text-success border">Active</span>
                </div>
              </div>

              {!isEditing ? (
                <>
                  <div className="mb-3 border-bottom pb-2">
                    <small className="text-muted">Email</small>
                    <div className="fw-semibold">{user?.email || '-'}</div>
                  </div>

                  <div className="mb-3 border-bottom pb-2">
                    <small className="text-muted">Phone</small>
                    <div className="fw-semibold">{user?.phone || '-'}</div>
                  </div>

                  <div className="mb-4 border-bottom pb-2">
                    <small className="text-muted">Company</small>
                    <div className="fw-semibold">{user?.company_name || '-'}</div>
                  </div>

                  <button
                    className="btn"
                    style={{
                      background: '#ffe5e5',
                      color: '#dc3545',
                      border: '1px solid #f5c2c2'
                    }}
                    onClick={() => setIsEditing(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                </>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveProfile();
                }}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control bg-light"
                      name="email"
                      value={formData.email}
                      disabled
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Company Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <button
                      type="button"
                      className="btn btn-light border"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-danger"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>

        <div className="col-lg-4">

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h6 className="fw-bold mb-3">Account Info</h6>

              <div className="d-flex justify-content-between mb-2 small">
                <span className="text-muted">Created</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>

              <div className="d-flex justify-content-between small">
                <span className="text-muted">Status</span>
                <span className="badge bg-light text-success border">Active</span>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-bold mb-2 text-danger">Danger Zone</h6>
              <p className="text-muted small">
                This action is permanent and cannot be undone.
              </p>
              <button className="btn btn-outline-danger w-100">
                Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;