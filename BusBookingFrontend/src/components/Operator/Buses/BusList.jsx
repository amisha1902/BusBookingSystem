export default function BusList({
  buses,
  selectedCompany,
  onEditBus,
  onDeleteBus,
  onAddBus,
}) {
  if (!selectedCompany) {
    return (
      <div className="buses-section">
        <div className="empty-state">
          <p>Select a company to view and manage buses</p>
        </div>
      </div>
    )
  }

  if (buses.length === 0) {
    return (
      <div className="buses-section">
        <div className="section-header d-flex justify-content-between align-items-center mb-4">
          <h2>🚌 Buses • {selectedCompany.company_name}</h2>
          <button className="btn btn-primary btn-sm" onClick={onAddBus}>
            + Add Bus
          </button>
        </div>
        <div className="empty-state">
          <p>No buses registered for this company. Add your first bus!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="buses-section">
      <div className="section-header d-flex justify-content-between align-items-center mb-4">
        <h2>🚌 Buses • {selectedCompany.company_name}</h2>
        <button className="btn btn-primary btn-sm" onClick={onAddBus}>
          + Add Bus
        </button>
      </div>

      <div className="buses-grid">
        {buses.map((bus) => (
          <div key={bus.id} className="bus-card card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h6 className="mb-1">{bus.bus_name}</h6>
                  <span className="badge bg-danger">{bus.bus_type}</span>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-sm"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    ⋮
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => onEditBus(bus)}
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
                        onClick={() => onDeleteBus(bus.id)}
                      >
                        🗑️ Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bus-details">
                <p className="mb-1 small">
                  <strong>Bus No:</strong> {bus.bus_no}
                </p>
                <p className="mb-0 small">
                  <strong>Seats:</strong> {bus.total_seats}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
