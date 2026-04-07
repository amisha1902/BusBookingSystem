import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { usePassenger } from "../../hooks/usePassenger"
import Alert from "../../components/Common/Alert"
import LoadingSpinner from "../../components/Common/Spinner"

export default function BookingDetails() {

    const { bookingId } = useParams()
    const navigate = useNavigate()

    const { loading, getBookingDetails, processPayment, cancelBooking } = usePassenger()

    const [booking, setBooking] = useState(null)
    const [alert, setAlert] = useState({ type: "", message: "" })
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        loadBookingDetails()
    }, [bookingId])

    const loadBookingDetails = async () => {
        try {
            const response = await getBookingDetails(bookingId)
            console.log(response)
            setBooking(response)
        } catch (err) {
            setAlert({
                type: "danger",
                message: "Failed to load booking details",
            })
        }
    }

    const handlePayment = async () => {

        setIsProcessing(true)

        try {

            await processPayment(bookingId)

            setAlert({
                type: "success",
                message: "Payment successful!",
            })

            setTimeout(() => {
                navigate("/passenger/dashboard")
            }, 2000)

        } catch (err) {

            setAlert({
                type: "danger",
                message: "Payment failed. Please try again.",
            })

        } finally {
            setIsProcessing(false)
        }
    }

    const handleCancel = async () => {

        if (confirm("Are you sure you want to cancel this booking?")) {

            try {

                await cancelBooking(bookingId)

                setAlert({
                    type: "success",
                    message: "Booking cancelled successfully",
                })

                setTimeout(() => {
                    navigate("/passenger/dashboard")
                }, 2000)

            } catch (err) {

                setAlert({
                    type: "danger",
                    message: "Failed to cancel booking",
                })
            }
        }
    }

    if (loading) return <LoadingSpinner message="Loading booking details..." />

    if (!booking) {
        return (
            <div className="container py-5">
                <Alert
                    type="danger"
                    message="Booking not found"
                    onClose={() => navigate("/passenger/dashboard")}
                />
            </div>
        )
    }

    const ticketNumber = `TKT-${booking.id}-${new Date(booking.created_at).getFullYear()}`

    return (

        <div className="py-5" style={{ background: "#f5f5f5" }}>

            <div className="container">

                {alert.message && (
                    <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert({ type: "", message: "" })}
                    />
                )}

                <div className="row g-4">

                    {/* LEFT SIDE - TICKET */}

                    <div className="col-lg-8">

                        <div className="card shadow-sm border-0">

                            <div className="card-body">

                                {/* SOURCE → DESTINATION */}

                                <div className="d-flex justify-content-between align-items-center mb-4">

                                    <div>

                                        <h4 className="fw-bold">
                                            {booking.trip?.route?.source_city} → {booking.trip?.route?.destination_city}
                                        </h4>

                                        <small className="text-muted">

                                            {new Date(booking.trip?.departure_time).toLocaleDateString()} |{" "}
                                            {new Date(booking.trip?.departure_time).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}

                                        </small>

                                    </div>

                                    <span className="badge bg-success">

                                        {booking.status}

                                    </span>

                                </div>

                                <hr />

                                {/* ROUTE */}

                                <div className="row mb-4">

                                    <div className="col-md-6">

                                        <p className="text-muted small mb-1">Boarding Point</p>

                                        <strong>{booking.boarding_stop?.stop_name}</strong>

                                    </div>

                                    <div className="col-md-6">

                                        <p className="text-muted small mb-1">Drop Point</p>

                                        <strong>{booking.drop_stop?.stop_name}</strong>

                                    </div>

                                </div>

                                <hr />

                                {/* DATE + SEAT */}

                                <div className="row mb-4">

                                    <div className="col-md-6">

                                        <p>
                                            Seats: <br></br>{booking.booking_seats
                                                ?.map(bs => bs.trip_seat?.seat?.seat_number)
                                                .join(", ")}
                                        </p>
                                    </div>

                                    <div className="col-md-6">

                                        <p className="text-muted small mb-1">Ticket Number</p>

                                        <strong>{ticketNumber}</strong>

                                    </div>

                                </div>

                                <hr />

                                {/* ROUTE STOPS */}


                                <div>
                                    <strong>Route:</strong>{" "}
                                    {[...new Map(
                                        booking.trip?.route?.route_stops
                                            ?.sort((a, b) => a.stop_order - b.stop_order)
                                            .map(stop => [stop.city_name, stop])
                                    ).values()]
                                        .map(stop => stop.city_name)
                                        .join(" → ")}
                                </div>

                                <hr className="my-4" />

                                {/* TRAVEL INFO */}

                                <div className="bg-light p-3 rounded">

                                    <h6 className="mb-2">Travel Instructions</h6>

                                    <ul className="small mb-0">

                                        <li>Reach boarding point 15 minutes before departure</li>
                                        <li>Carry valid ID proof</li>
                                        <li>Keep your ticket number for verification</li>

                                    </ul>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT SIDE - FARE */}

                    <div className="col-lg-4">

                        <div className="card shadow-sm border-0">

                            <div className="card-body">

                                <h6 className="fw-bold mb-3">Fare Summary</h6>

                                <div className="d-flex justify-content-between mb-2">

                                    <span className="text-muted">Seat Fare</span>

                                    <span>₹{booking.total_price}</span>

                                </div>

                                <hr />

                                <div className="d-flex justify-content-between fw-bold">

                                    <span>Total Amount</span>

                                    <span>₹{booking.total_price}</span>

                                </div>

                                <hr />

                                {booking.status !== "paid" && (

                                    <button
                                        className="btn w-100 text-white"
                                        style={{ background: "#d84e55" }}
                                        onClick={handlePayment}
                                        disabled={isProcessing}
                                    >

                                        {isProcessing ? "Processing..." : "Proceed to Payment"}

                                    </button>

                                )}

                                {booking.status === "paid" && (

                                    <div className="alert alert-success text-center mb-0">

                                        Payment Completed

                                    </div>

                                )}

                            </div>

                        </div>

                        <button
                            className="btn btn-outline-danger w-100 mt-3"
                            onClick={handleCancel}
                        >

                            Cancel Booking

                        </button>

                    </div>

                </div>

            </div>

        </div>

    )
}