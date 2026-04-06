import { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { usePassenger } from "../../hooks/usePassenger"

import SeatLayout from "../../components/Passenger/SeatLayout"
import TripSidebar from "../../components/Passenger/TripSidebar"

import "./tripDetails.css"

export default function TripDetails(){

  const { tripId } = useParams()
  const navigate = useNavigate()

  const { selectedTrip, getTripDetails, loading } = usePassenger()
  const location = useLocation();
  const { boardingCity, dropCity, date } = location.state || {};
  const [selectedSeats,setSelectedSeats] = useState([])

  useEffect(()=>{
    getTripDetails(tripId)
  },[tripId])

  const handleSelectPoints = () => {

    if(selectedSeats.length === 0){
      alert("Please select at least one seat")
      return
    }

    navigate("/select-points",{
      state:{
        trip: selectedTrip,
      selectedSeats: selectedSeats,
      boardingCity: boardingCity,   
      dropCity: dropCity  
      }
    })
  }

  if(loading || !selectedTrip){
    return <div className="container mt-5">Loading trip...</div>
  }

  return(

    <div className="trip-details-page">

      <div className="container-fluid">

        <div className="row">

          {/* LEFT SIDE - SEATS */}

          <div className="col-lg-5">

            <SeatLayout
              trip={selectedTrip}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
            />

          </div>

          {/* RIGHT SIDE - BUS DETAILS */}

          <div className="col-lg-7">

            <TripSidebar
              trip={selectedTrip}
              selectedSeats={selectedSeats}
              boardingCity={boardingCity}
                dropCity={dropCity}
            />

          </div>

        </div>

        {/* BUTTON SECTION */}

        <div className="text-center mt-4">

          <button
            className="btn btn-danger btn-lg"
            onClick={handleSelectPoints}
          >
            Select Boarding & Drop Points
          </button>

        </div>

      </div>

    </div>

  )
}