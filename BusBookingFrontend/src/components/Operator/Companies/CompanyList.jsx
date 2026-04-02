import { useState } from 'react';

export default function CompanyList({
  companies,
  onSelectCompany,
  onEditCompany,
  onDeleteCompany,
}) {
  const [selectedComp, setSelectedComp] = useState(null);

  return (
    <div className="row">
      {companies.map((company) => (
        <div key={company.id} className="col-md-4 mb-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              cursor: 'pointer',
              borderRadius: '12px',
              transition: '0.2s'
            }}
            onClick={() => onSelectCompany(company)}
          >
            <div className="card-body">
              
              <div className="d-flex justify-content-between">
                <h6 className="fw-bold">{company.company_name}</h6>

                <div>
                  <button
                    className="btn btn-sm btn-light me-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCompany(company);
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    className="btn btn-sm btn-light text-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCompany(company.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <p className="text-muted small mt-2">
                License: {company.license_no}
              </p>

              <p className="text-muted small">
                Click to manage buses →
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}