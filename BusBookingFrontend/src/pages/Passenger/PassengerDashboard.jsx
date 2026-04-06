import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePassenger } from '../../hooks/usePassenger'
import Alert from '../../components/Common/Alert'
import LoadingSpinner from '../../components/Common/Spinner'
import TripCard from '../../components/Passenger/TripCard'
import TripSearchFilter from '../../components/Passenger/TripSearchFilter'
import busBanner from '../../assets/bus_banner.jpg';

export default function PassengerDashboard() {
    const navigate = useNavigate()

    const {
        trips,
        bookings,
        loading,
        error,
        searchFilters,
        searchTrips,
        fetchMyBookings,
        clearError,
    } = usePassenger()

    const [alert, setAlert] = useState({ type: '', message: '' })

    useEffect(() => {
        fetchMyBookings().catch(() => {
            setAlert({
                type: 'danger',
                message: 'Failed to load bookings',
            })
        })
    }, [])

    const handleSearch = async (filters) => {
        navigate('/passenger/search', { state: filters })
    }

    const handleViewTripDetails = (tripId) => {
        navigate(`/passenger/trip/${tripId}`)
    }

    return (
        <div>

            {/* 🔴 HERO SECTION */}
  <div
  className="position-relative text-white d-flex"
  style={{
    height: "420px",
    backgroundImage: `linear-gradient(rgba(216, 78, 85, 0.45), rgba(0, 0, 0, 0.45)), url(${busBanner})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderBottomLeftRadius: "40px",
    borderBottomRightRadius: "40px",
    overflow: "visible",
    padding: "60px 80px",
    alignItems: "flex-start",
  }}
>
  
  {/* TOP TEXT */}
  <div
    className="position-relative"
    style={{
      zIndex: 2,
      maxWidth: "600px",
    }}
  >
    {/* <h1
      className="fw-bold"
      style={{
        fontSize: "2.5rem",
        lineHeight: "1.2",
        letterSpacing: "-1px",
        textShadow: "0 3px 10px rgba(0,0,0,0.5)",
      }}
    >
      India's No. 1 online <br />
      bus ticket booking site
    </h1> */}
  </div>

  {/* FLOATING SEARCH BOX */}
  <div
    className="position-absolute start-50 translate-middle-x"
    style={{
      bottom: "-45px",
      width: "100%",
      maxWidth: "900px",
      zIndex: 5,
    }}
  >
    <div
      className="pt-5"

    >
      <TripSearchFilter onSearch={handleSearch} loading={loading} />
    </div>
  </div>

</div>

            {/* ALERT */}
            <div className="container mt-3">
                {alert.message && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert({ type: '', message: '' })}
                    />
                )}
            </div>
            {/* 🚌 SEARCH RESULTS */}


            <div className="container mb-5">
                {loading && <LoadingSpinner message="Searching trips..." />}

                {!loading && trips.length > 0 && (
                    <>
                        <h4 className="fw-bold mb-3">Available Buses</h4>
                        <div className="row g-3">
                            {trips.map((trip) => (
                                <div key={trip.id} className="col-md-6 col-lg-4">
                                    <TripCard
                                        trip={trip}
                                        onViewDetails={() =>
                                            handleViewTripDetails(trip.id)
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {!loading && trips.length === 0 && searchFilters?.source && (
                    <div className="alert alert-info">
                        No trips found. Try different search criteria.
                    </div>
                )}

                {!loading && trips.length === 0 && !searchFilters?.source && (
                     <h1
      className="fw-sm mt-5 pt-5"
      style={{
        fontSize: "2.5rem",
        lineHeight: "1.2",
        letterSpacing: "-1px"
      }}
    >
      India's No. 1 online <br />
      bus ticket booking site
    </h1>
                )}
            </div>

            {/* 🎁 OFFERS SECTION */}
            <div className="container my-5">
                <h4 className="fw-bold mb-4">Offers for you</h4>

                <div className="row g-3">
                    <div className="col-md-4">
                        <div
                            className="p-4 shadow-sm"
                            style={{
                                borderRadius: '15px',
                                background: 'linear-gradient(135deg, #ffe0c3, #ffcba4)',
                            }}
                        >
                            <h6 className="fw-bold">Save up to ₹300</h6>
                            <p className="mb-0">Use code FESTIVE300</p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div
                            className="p-4 shadow-sm"
                            style={{
                                borderRadius: '15px',
                                background: 'linear-gradient(135deg, #e0ecff, #c3d7ff)',
                            }}
                        >
                            <h6 className="fw-bold">₹500 off with HDFC</h6>
                            <p className="mb-0">On credit cards</p>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div
                            className="p-4 shadow-sm"
                            style={{
                                borderRadius: '15px',
                                background: 'linear-gradient(135deg, #f3e0ff, #e0c3ff)',
                            }}
                        >
                            <h6 className="fw-bold">₹200 off with AU Bank</h6>
                            <p className="mb-0">Limited offer</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mb-5">
                <h5 className="fw-bold mb-3">What's new</h5>

                <div className="d-flex gap-3 overflow-auto pb-2">

                    {/* CARD 1 */}
                    <div
                        className="text-white p-3 flex-shrink-0"
                        style={{
                            minWidth: "260px",
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #b31242, #dd8ba9)"
                        }}
                    >
                        <h6 className="fw-bold">Free Cancellation</h6>
                        <p className="mb-2" style={{ fontSize: "14px" }}>
                            Get 100% refund on cancellation
                        </p>
                        <small>Know more →</small>
                    </div>

                    {/* CARD 2 */}
                    <div
                        className="text-white shadow-sm p-3 flex-shrink-0"
                        style={{
                            minWidth: "260px",
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #6882e2, #d0688e)"

                        }}
                    >
                        <h6 className="fw-bold">Bus Timetable</h6>
                        <p className="mb-2 text-muted" style={{ fontSize: "14px" }}>
                            Get local bus timings between cities
                        </p>
                        <small className="text-primary">Know more →</small>
                    </div>

                    {/* CARD 3 */}
                    <div
                        className="text-white shadow-sm p-3 flex-shrink-0"
                        style={{
                            minWidth: "260px",
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #c3cc89, #d26522)"
                        }}
                    >
                        <h6 className="fw-bold text-white">FlexiTicket</h6>
                        <p className="mb-2 text-muted" style={{ fontSize: "14px" }}>
                            Free date change & cancellation
                        </p>
                        <small className="text-primary">Know more →</small>
                    </div>

                    {/* CARD 4 */}
                    <div
                        className="text-white shadow-sm p-3 flex-shrink-0"
                        style={{
                            minWidth: "260px",
                            borderRadius: "16px",
                            background: "linear-gradient(135deg, #eaece1, #7a2765)"

                        }}
                    >
                        <h6 className="fw-bold text-white">Assurance Program</h6>
                        <p className="mb-2 text-muted" style={{ fontSize: "14px" }}>
                            Insurance against delays & cancellations
                        </p>
                        <small className="text-primary">Know more →</small>
                    </div>

                </div>
            </div>
        </div>
    )
}