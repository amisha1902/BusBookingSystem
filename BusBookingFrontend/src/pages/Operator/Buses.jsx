import React, { useState, useEffect } from 'react';

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedBus, setSelectedBus] = useState(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  useEffect(() => {
    let filtered = buses;

    if (filterType !== 'all') {
      filtered = filtered.filter(bus => bus.bus_type === filterType);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(bus =>
        bus.bus_name?.toLowerCase().includes(term) ||
        bus.bus_no?.toLowerCase().includes(term) ||
        bus.bus_operator?.name?.toLowerCase().includes(term)
      );
    }

    setFilteredBuses(filtered);
  }, [buses, searchTerm, filterType]);

  const fetchBuses = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:3000/api/v1/buses/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to fetch buses');
      }

      const text = await response.text();
      let parsedData;
      try {
        parsedData = JSON.parse(text);
      } catch (err) {
        console.error("Invalid JSON response:", text);
        throw new Error('Server error. Please check backend.');
      }

      const busesData = parsedData.data || parsedData;
      setBuses(busesData);

    } catch (err) {
      console.error('Error fetching buses:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBusTypeLabel = (type) => {
    const types = {
      ac_seater: 'AC Seater',
      non_ac_seater: 'Non-AC Seater',
      ac_sleeper: 'AC Sleeper',
      non_ac_sleeper: 'Non-AC Sleeper'
    };
    return types[type] || type;
  };

  const getSeatLayoutInfo = (bus) => {
    if (bus.bus_type?.includes('seater')) {
      return `${bus.total_seats} Seats`;
    } else if (bus.bus_type?.includes('sleeper')) {
      return `${bus.total_seats} Berths`;
    }
    return `${bus.total_seats}`;
  };

  return (
    <div style={{ background: '#f6f7fb', minHeight: '100vh' }}>
      <div className="container-fluid p-4">

        <div className="mb-4">
          <h3 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>
            🚌 All Buses
          </h3>
          <p className="text-muted">Manage buses across operators</p>
        </div>

        {error && (
          <div className="alert d-flex justify-content-between align-items-center"
            style={{ background: '#fdecea', color: '#b71c1c', border: '1px solid #f5c6cb' }}>
            <span>⚠️ {error}</span>
            <button className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        <div className="row mb-4">
          <div className="col-md-8 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search buses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </div>

          <div className="col-md-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-select"
              style={{ borderRadius: '8px' }}
            >
              <option value="all">All Types</option>
              <option value="ac_seater">AC Seater</option>
              <option value="non_ac_seater">Non-AC Seater</option>
              <option value="ac_sleeper">AC Sleeper</option>
              <option value="non_ac_sleeper">Non-AC Sleeper</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#4a6cf7' }} />
            <p className="text-muted mt-2">Loading buses...</p>
          </div>
        ) : filteredBuses.length === 0 ? (
          <div className="text-center py-5">
            <h5 className="text-muted">
              {buses.length === 0 ? 'No buses available' : 'No results found'}
            </h5>
          </div>
        ) : (
          <>
            <div className="mb-3 text-muted">
              Showing <strong>{filteredBuses.length}</strong> of {buses.length}
            </div>

            <div className="row">
              {filteredBuses.map(bus => (
                <div key={bus.id} className="col-md-6 col-lg-4 mb-4">
                  
                  <div className="card border-0 h-100"
                    style={{
                      borderRadius: '12px',
                      background: '#ffffff',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                      transition: '0.2s'
                    }}>

                    <div className="card-body">

                      <h5 className="fw-semibold mb-2" style={{ color: '#34495e' }}>
                        {bus.bus_name}
                      </h5>

                      <p className="mb-1 text-muted small">
                        Bus No: <strong style={{ color: '#2c3e50' }}>{bus.bus_no}</strong>
                      </p>

                      {bus.bus_operator && (
                        <p className="mb-2 text-muted small">
                          Operator:<br />
                          <span style={{ color: '#555' }}>
                            {bus.bus_operator.company_name}
                          </span>
                        </p>
                      )}

                      <span
                        className="badge mb-3"
                        style={{
                          background: '#eef2ff',
                          color: '#4a6cf7',
                          borderRadius: '6px',
                          padding: '5px 10px',
                          fontWeight: 500
                        }}
                      >
                        {getBusTypeLabel(bus.bus_type)}
                      </span>

                      <div className="d-flex justify-content-between text-muted small">
                        <span>{getSeatLayoutInfo(bus)}</span>
                        <span>{bus.deck == 2 ? 'Double' : 'Single'} Deck</span>
                      </div>

                      {bus.seats?.length > 0 && (
                        <div className="mt-3">
                          <button
                            className="btn btn-sm w-100"
                            style={{
                              border: '1px solid #dee2e6',
                              borderRadius: '6px'
                            }}
                            onClick={() =>
                              setSelectedBus(selectedBus?.id === bus.id ? null : bus)
                            }
                          >
                            {selectedBus?.id === bus.id ? 'Hide Layout' : 'Show Layout'}
                          </button>

                          {selectedBus?.id === bus.id && (
                            <div className="mt-2 p-2 border rounded bg-light">
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(6, 1fr)',
                                gap: '4px'
                              }}>
                                {bus.seats.map(seat => (
                                  <div
                                    key={seat.id}
                                    className="text-center small border rounded"
                                    style={{ padding: '4px', background: '#fff' }}
                                  >
                                    {seat.seat_number}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    </div>

                    <div
                      className="card-footer"
                      style={{
                        background: '#f8f9fa',
                        borderTop: '1px solid #eee',
                        fontSize: '0.85rem'
                      }}
                    >
                      {bus.total_seats} seats
                    </div>

                  </div>

                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Buses;