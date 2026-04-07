import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { usePassenger } from "../../hooks/usePassenger";
import LoadingSpinner from '../../components/Common/Spinner';
import TripSearchFilter from '../../components/Passenger/TripSearchFilter';

export default function PassengerSearchResults() {
    const location = useLocation();
    const navigate = useNavigate();

    const { trips, searchTrips, loading } = usePassenger();
    const filters = location.state;

    const [currentPage, setCurrentPage] = useState(1);
    const tripsPerPage = 10;

    const [busType, setBusType] = useState({
        ac: false,
        sleeper: false,
        seater: false,
    });

    const [operatorSearch, setOperatorSearch] = useState('');
    const [selectedOperator, setSelectedOperator] = useState('');

    useEffect(() => {
        if (filters) {
            searchTrips(filters);
        }
    }, [filters]);

    const operators = useMemo(() => {
        const set = new Set();
        trips.forEach(t => {
            if (t.operator?.company_name) {
                set.add(t.operator.company_name);
            }
        });
        return [...set];
    }, [trips]);

    const filteredOperators = operators.filter(op =>
        op.toLowerCase().includes(operatorSearch.toLowerCase())
    );

    const filteredTrips = useMemo(() => {
        let result = [...trips];
        if (busType.ac) result = result.filter(t => t.bus?.bus_type?.toLowerCase().includes('ac'));
        if (busType.sleeper) result = result.filter(t => t.bus?.bus_type?.toLowerCase().includes('sleeper'));
        if (busType.seater) result = result.filter(t => t.bus?.bus_type?.toLowerCase().includes('seater'));
        if (selectedOperator) result = result.filter(t => t.operator?.company_name === selectedOperator);
        return result;
    }, [trips, busType, selectedOperator]);

    const indexOfLast = currentPage * tripsPerPage;
    const indexOfFirst = indexOfLast - tripsPerPage;
    const currentTrips = filteredTrips.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);

    const getDuration = (start, end) => {
        const diff = new Date(end) - new Date(start);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        return `${hours}h ${minutes}m`;
    };

    const [activeFilters, setActiveFilters] = useState(location.state || {});

    const handleNewSearch = async (newFilters) => {
        setCurrentPage(1);
        setActiveFilters(newFilters);
        await searchTrips(newFilters);
    };

    const formatDate = (date) => date.toISOString().split('T')[0];

    const getShiftedDate = (days) => {
        const base = new Date(filters?.date);
        base.setDate(base.getDate() + days);
        return formatDate(base);
    };

    const handleDateSearch = (days) => {
        handleNewSearch({
            ...filters,
            date: getShiftedDate(days),
        });
    };

    const formatBusType = (busType) => {
        if (!busType) return '';
        return busType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    return (
        <div className="container mt-3">
            {/* Header */}
            <div className="bg-white p-3 border-bottom mb-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                        <strong>{filters?.source}</strong> → <strong>{filters?.destination}</strong>
                        <div className="text-muted small">{filteredTrips.length} buses found</div>
                    </div>
                </div>
                <TripSearchFilter
                    onSearch={handleNewSearch}
                    loading={loading}
                    initialValues={filters}
                />
                <div className="d-flex gap-2 mt-3 flex-wrap">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handleDateSearch(0)}>Today</button>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handleDateSearch(1)}>Tomorrow</button>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => handleDateSearch(2)}>Day After</button>
                </div>
            </div>

            <div className="row">
                {/* Filters Sidebar */}
                <div className="col-md-3 border-end">
                    <div className="card p-3 shadow-sm border-0">
                        <h6 className="fw-bold mb-3">Filter buses</h6>
                        <ul className="list-group list-group-flush mb-3">
                            {['ac', 'sleeper', 'seater'].map(type => (
                                <li
                                    key={type}
                                    className={`list-group-item ${busType[type] ? 'border border-danger bg-danger bg-opacity-10 shadow-sm rounded-4' : ''}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setBusType({ ...busType, [type]: !busType[type] })}
                                >
                                    {type.toUpperCase()}
                                </li>
                            ))}
                        </ul>
                        <h6 className="fw-bold mt-3">Bus Operator</h6>
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Search operator..."
                            value={operatorSearch}
                            onChange={(e) => setOperatorSearch(e.target.value)}
                        />
                        <select
                            className="form-select"
                            value={selectedOperator}
                            onChange={(e) => setSelectedOperator(e.target.value)}
                        >
                            <option value="">All Operators</option>
                            {filteredOperators.map((op, i) => (
                                <option key={i} value={op}>{op}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Trip Cards */}
                <div className="col-md-9">
                    {loading && <LoadingSpinner message="Loading buses..." />}

                    {!loading && filteredTrips.length === 0 && (
                        <div className="card shadow-sm text-center p-5 border-0">
                            <h5>No buses found</h5>
                            <p className="text-muted">Try a different date or route</p>
                        </div>
                    )}

                    {!loading && currentTrips.map((trip) => {
                        const minPrice = trip?.trip_seats?.length
                            ? Math.min(...trip.trip_seats.map(s => s.seat_price || 0))
                            : 0;
                        const seatsAvailable = trip.available_seats || 0;

                        return (
                            <div key={trip.id} className="card mb-3 border rounded-3 shadow-sm">
                                <div className="card-body py-3 px-4">
                                    <div className="row align-items-center">

                                        {/* Operator + Bus Info */}
                                        <div className="col-md-3">
                                            <div className="fw-bold text-dark" style={{ fontSize: '15px' }}>
                                                {trip.operator?.company_name}
                                            </div>
                                            <div className="text-muted small mt-1">
                                                {trip.bus?.bus_name}
                                            </div>
                                            <div className="text-muted small">
                                                {formatBusType(trip.bus?.bus_type)}
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <div className="col-md-1 text-center">
                                            <span
                                                className="badge text-white d-inline-flex align-items-center gap-1"
                                                style={{
                                                    backgroundColor: '#48a14d',
                                                    fontSize: '12px',
                                                    padding: '5px 8px',
                                                    borderRadius: '6px'
                                                }}
                                            >
                                                ★ 4.0
                                            </span>
                                        </div>

                                        {/* Time + Duration */}
                                        <div className="col-md-4 text-center">
                                            <div className="fw-semibold" style={{ fontSize: '16px' }}>
                                                {new Date(trip.departure_time).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                                <span className="text-muted mx-2">—</span>
                                                {new Date(trip.arrival_time).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                            <div className="text-muted small mt-1">
                                                {getDuration(trip.departure_time, trip.arrival_time)}
                                                {' • '}
                                                {seatsAvailable} Seats
                                                {trip.bus?.deck === 'double' && (
                                                    <span className="text-danger ms-1">
                                                        ({Math.ceil(seatsAvailable / 2)} Single)
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="col-md-2 text-end">
                                            <div className="fw-bold text-dark" style={{ fontSize: '17px' }}>
                                                ₹{minPrice.toFixed(0)}
                                            </div>
                                            <div className="text-muted small">Onwards</div>
                                        </div>

                                        {/* View Seats Button */}
                                        <div className="col-md-2 text-end">
                                            <button
                                                className="btn btn-danger btn-sm px-3 py-2"
                                                style={{ borderRadius: '6px', fontWeight: '600' }}
                                                onClick={() => navigate(`/passenger/trip/${trip.id}`, {
                                                    state: {
                                                        boardingCity: activeFilters?.source,
                                                        dropCity: activeFilters?.destination,
                                                        date: activeFilters?.date
                                                    }
                                                })}
                                            >
                                                View seats
                                            </button>
                                        </div>

                                    </div>

                                    {/* Amenities Row */}
                                    <hr className="my-2" />
                                    <div className="d-flex gap-3">
                                        <small className="text-muted">
                                            <i className="bi bi-snow me-1"></i>
                                            {trip.bus?.bus_type?.includes('ac') ? 'AC' : 'Non-AC'}
                                        </small>
                                        <small className="text-muted">
                                            <i className="bi bi-moon me-1"></i>
                                            {trip.bus?.bus_type?.includes('sleeper') ? 'Sleeper' : 'Seater'}
                                        </small>
                                        <small className="text-muted">
                                            <i className="bi bi-people me-1"></i>
                                            {seatsAvailable} seats left
                                        </small>
                                        <small className="text-muted">
                                            <i className="bi bi-clock me-1"></i>
                                            {getDuration(trip.departure_time, trip.arrival_time)}
                                        </small>
                                    </div>

                                </div>
                            </div>
                        );
                    })}

                    {/* Pagination */}
                    {!loading && filteredTrips.length > 0 && totalPages > 1 && (
                        <ul className="pagination justify-content-center mt-4">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    Previous
                                </button>
                            </li>
                            {[...Array(totalPages)].map((_, index) => (
                                <li
                                    key={index}
                                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}