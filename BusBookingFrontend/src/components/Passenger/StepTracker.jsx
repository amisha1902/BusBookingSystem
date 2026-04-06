export default function StepTracker({step}){

  return(

    <div className="step-tracker">

      <div className={`step ${step>=1 ? "active":""}`}>
        1. Select seats
      </div>

      <div className={`step ${step>=2 ? "active":""}`}>
        2. Board/Drop point
      </div>

      <div className={`step ${step>=3 ? "active":""}`}>
        3. Passenger Info
      </div>

    </div>

  )
}