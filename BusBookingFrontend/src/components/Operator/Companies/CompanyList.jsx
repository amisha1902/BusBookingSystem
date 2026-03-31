export default function CompanyList({
  companies,
  selectedCompany,
  onSelectCompany,
  onEditCompany,
  onDeleteCompany,
  onAddCompany,
}) {
  if (companies.length === 0) {
    return (
      <div className="companies-section">
        <div className="section-header d-flex justify-content-between align-items-center mb-4">
          <h2>🏢 My Companies</h2>
          <button
            className="btn btn-primary btn-sm"
            onClick={onAddCompany}
          >
            + Add Company
          </button>
        </div>
        <div className="empty-state">
          <p>No companies registered yet. Create one to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="companies-section">
      <div className="section-header d-flex justify-content-between align-items-center mb-4">
        <h2>🏢 My Companies ({companies.length})</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={onAddCompany}
        >
          + Add Company
        </button>
      </div>

      <div className="companies-list">
        {companies.map((company) => (
          <div
            key={company.id}
            className={`company-card card mb-3 border-0 shadow-sm p-3 ${
              selectedCompany?.id === company.id ? 'active' : ''
            }`}
            onClick={() => onSelectCompany(company)}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <h6 className="mb-1">{company.company_name}</h6>
                <p className="mb-1 text-muted small">
                  <strong>License:</strong> {company.license_no}
                </p>
                <p className="mb-0 text-muted small">
                  <strong>Email:</strong> {company.contact_email}
                </p>
                {company.is_verified && (
                  <div className="mt-2">
                    <span className="badge bg-success">✓ Verified</span>
                  </div>
                )}
              </div>
              <div className="dropdown ms-2">
                <button
                  className="btn btn-sm "
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.stopPropagation()}
                >
                  ⋮
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditCompany(company)
                      }}
                    >
                      ✏️ Edit
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteCompany(company.id)
                      }}
                    >
                      🗑️ Delete
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
