import { useState } from "react"

export default function BusInfoTabs({trip,boardingPoints,dropPoints,stops}){

  const [tab,setTab] = useState("highlights")

  return(

    <div className="bus-info">

      <h5>{trip.bus.bus_name}</h5>

      <p>
        {trip.departure_time} - {trip.arrival_time}
      </p>

      <div className="tabs">

        <button onClick={()=>setTab("highlights")}>Highlights</button>
        <button onClick={()=>setTab("boarding")}>Boarding point</button>
        <button onClick={()=>setTab("dropping")}>Dropping point</button>
        <button onClick={()=>setTab("route")}>Bus route</button>

      </div>


      <div className="tab-content">

        {tab==="highlights" && (

          <div>
            <p>Top 5% buses on this route</p>
          </div>

        )}


        {tab==="boarding" && (

          <ul>

            {boardingPoints.map(point => (

              <li key={point.id}>

                <b>{point.time}</b> {point.location}

              </li>

            ))}

          </ul>

        )}


        {tab==="dropping" && (

          <ul>

            {dropPoints.map(point => (

              <li key={point.id}>

                <b>{point.time}</b> {point.location}

              </li>

            ))}

          </ul>

        )}


        {tab==="route" && (

          <div>

            {stops.map(stop => (

              <span key={stop.id}>
                {stop.city} →
              </span>

            ))}

          </div>

        )}

      </div>

    </div>

  )
}