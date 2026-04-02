import { useState } from 'react'

const BusTypeLabel = ({ busType }) => {
  const labels = {
    ac_seater: { label: 'AC Seater', bg: '#eef2ff', color: '#4a6cf7' },
    non_ac_seater: { label: 'Non-AC Seater', bg: '#fff3cd', color: '#856404' },
    ac_sleeper: { label: 'AC Sleeper', bg: '#e7f5ff', color: '#0c5460' },
    non_ac_sleeper: { label: 'Non-AC Sleeper', bg: '#f8d7da', color: '#721c24' }
  }

  const info = labels[busType] || { label: busType, bg: '#f1f3f5', color: '#495057' }

  return (
    <span
      className="me-2"
      style={{
        background: info.bg,
        color: info.color,
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 500
      }}
    >
      {info.label}
    </span>
  )
}

const DeckLabel = ({ deck }) => {
  return (
    <span
      style={{
        background: '#e9f7ef',
        color: '#1e7e34',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 500
      }}
    >
      {deck === 1 ? 'Single Deck' : `Double Deck (${deck})`}
    </span>
  )
}

export default function BusList({
  buses,
  selectedCompany,
  onEditBus,
  onDeleteBus,
  onAddBus,
}) {
  const [showModal, setShowModal] = useState(false)
  const [selectedBus, setSelectedBus] = useState(null)
  const busesList = Array.isArray(buses) ? buses : []

  const handleOptionsClick = (bus) => {
    setSelectedBus(bus)
    setShowModal(true)
  }

  const handleEdit = () => {
    if (selectedBus) {
      onEditBus(selectedBus)
      setShowModal(false)
      setSelectedBus(null)
    }
  }

  const handleDelete = () => {
    if (selectedBus) {
      onDeleteBus(selectedBus.id)
      setShowModal(false)
      setSelectedBus(null)
    }
  }

  if (!selectedCompany) {
    return (
      <div className="mt-4">
        <div
          className="text-center p-5 rounded"
          style={{ background: '#f8f9fb', border: '1px solid #eee' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚌</div>
          <p className="text-muted fs-5">
            Select a company to view and manage buses
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0" style={{ color: '#2c3e50' }}>
          🚌 Buses • {selectedCompany.company_name}
        </h4>

        <button
          className="btn"
          style={{
            background: '#4a6cf7',
            color: '#fff',
            borderRadius: '8px'
          }}
          onClick={onAddBus}
        >
          ➕ Add Bus
        </button>
      </div>

      {busesList.length === 0 ? (
        <div
          className="text-center p-5 rounded"
          style={{ background: '#f8f9fb', border: '1px solid #eee' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚌</div>
          <p className="text-muted fs-5">
            No buses registered for this company yet.
          </p>
          <button
            className="btn mt-3"
            style={{
              background: '#4a6cf7',
              color: '#fff',
              borderRadius: '8px'
            }}
            onClick={onAddBus}
          >
            ➕ Add Your First Bus
          </button>
        </div>
      ) : (
        <>
          <p className="text-muted mb-3">
            {busesList.length} {busesList.length === 1 ? 'bus' : 'buses'} registered
          </p>

          <div className="row g-3">
            {busesList.map((bus) => (
              <div key={bus.id} className="col-lg-4 col-md-6">

                <div
                  className="card h-100 border-0"
                  style={{
                    borderRadius: '12px',
                    background: '#fff',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                    transition: '0.2s'
                  }}
                >
                  <div className="card-body">

                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h6 className="mb-2" style={{ color: '#34495e' }}>
                          {bus.bus_name}
                        </h6>

                        <div className="d-flex gap-2 flex-wrap">
                          <BusTypeLabel busType={bus.bus_type} />
                          <DeckLabel deck={bus.deck} />
                        </div>
                      </div>

                      <button
                        className="btn border-0"
                        onClick={() => handleOptionsClick(bus)}
                        title="Options"
                        style={{
                          fontSize: '1.5rem',
                          background: '#f1f3f5',
                          borderRadius: '6px'
                        }}
                      >
                        ⋮
                      </button>
                    </div>

                    <hr />

                    <div className="small text-muted">
                      <p className="mb-2">
                        <strong style={{ color: '#555' }}>Bus Registration:</strong>
                        <br />
                        <code
                          style={{
                            background: '#f1f3f5',
                            padding: '3px 6px',
                            borderRadius: '6px'
                          }}
                        >
                          {bus.bus_no}
                        </code>
                      </p>

                      <p className="mb-2">
                        <strong style={{ color: '#555' }}>Total Seats:</strong>{' '}
                        {bus.total_seats}
                      </p>

                      {bus.is_active !== undefined && (
                        <p className="mb-0">
                          <strong style={{ color: '#555' }}>Status:</strong>{' '}
                          <span
                            style={{
                              background: bus.is_active ? '#e9f7ef' : '#f1f3f5',
                              color: bus.is_active ? '#1e7e34' : '#6c757d',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '12px'
                            }}
                          >
                            {bus.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </p>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && selectedBus && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content" style={{ borderRadius: '12px' }}>
              <div className="modal-header">
                <h5 className="modal-title">{selectedBus.bus_name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p className="text-muted">What would you like to do?</p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-light"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>

                <button
                  className="btn"
                  style={{ background: '#4a6cf7', color: '#fff' }}
                  onClick={handleEdit}
                >
                  ✏️ Update
                </button>

                <button
                  className="btn"
                  style={{ background: '#f8d7da', color: '#721c24' }}
                  onClick={handleDelete}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}