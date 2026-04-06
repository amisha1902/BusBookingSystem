
import { useLocation } from "react-router-dom"
import logo from '../assets/logo.png'
export default function Footer() {

  const currentYear = new Date().getFullYear()
  const location = useLocation()

   const hideRoutes = [
    '/login',
    '/signup/passenger',
    '/signup/operator',
    '/operator/dashboard',
    '/operator/bus-operators',
    '/operator/buses',
    '/operator/profile',
    '/operator/setting',
    '/operator/buses/all',
  ]

  const hideNavbar =
    hideRoutes.includes(location.pathname) ||
    /^\/operator\/bus-operators\/\d+\/buses$/.test(location.pathname)

  if (hideNavbar) return null

  return (
    <footer className="bg-light border-top mt-5">

      <div className="container py-5">

        {/* Collapsible Sections */}

        <div className="border-bottom py-3 d-flex justify-content-between">
          <span>Popular Bus Routes</span>
          <span>⌄</span>
        </div>

        <div className="border-bottom py-3 d-flex justify-content-between">
          <span>Popular Cities</span>
          <span>⌄</span>
        </div>

        <div className="border-bottom py-3 d-flex justify-content-between mb-4">
          <span>Popular Bus Operators</span>
          <span>⌄</span>
        </div>


        {/* Footer Links */}

        <div className="row gy-4">

          <div className="col-md-3">
            <h6>About OurBus</h6>
            <ul className="list-unstyled small">
              <li><a href="#">Contact us</a></li>
              <li><a href="#">Sitemap</a></li>
              <li><a href="#">Offers</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6>Info</h6>
            <ul className="list-unstyled small">
              <li><a href="#">T&C</a></li>
              <li><a href="#">Privacy policy</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Bus operator registration</a></li>
              <li><a href="#">Agent registration</a></li>
              <li><a href="#">Insurance partner</a></li>
              <li><a href="#">User agreement</a></li>
              <li><a href="#">Primo Bus</a></li>
              <li><a href="#">Bus Timetable</a></li>
              <li><a href="#">Report Security Issues</a></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6>Global Sites</h6>
            <ul className="list-unstyled small">
              <li><a href="#">India</a></li>
              <li><a href="#">Singapore</a></li>
              <li><a href="#">Malaysia</a></li>
              <li><a href="#">Indonesia</a></li>
              <li><a href="#">Peru</a></li>
              <li><a href="#">Colombia</a></li>
              <li><a href="#">Cambodia</a></li>
              <li><a href="#">Vietnam</a></li>
            </ul>
          </div>

          <div className="col-md-3">
            <h6>Our Partners</h6>
            <ul className="list-unstyled small">
              <li><a href="#">Goibibo Bus</a></li>
              <li><a href="#">Goibibo Hotels</a></li>
              <li><a href="#">Makemytrip Hotels</a></li>
            </ul>
          </div>

        </div>


        {/* Brand Description */}

        <div className="d-flex align-items-center gap-3 mt-5">

          <img
            src={logo}
            alt="logo"
            style={{ width: "350px", height: "100px" }}
          />

          <p className="small text-muted mb-0">
            OurBus is the world's largest online bus ticket booking service trusted by over
            56+ million happy customers globally. OurBus offers bus ticket booking through
            its website, iOS and Android mobile apps for all major routes.
          </p>

        </div>


        <hr className="my-4"/>


        {/* Bottom Row */}

        <div className="d-flex justify-content-between align-items-center flex-wrap">

          <p className="small text-muted mb-0">
            © {currentYear} MAKEMYTRIP (INDIA) PRIVATE LIMITED. All rights reserved
          </p>

          <div className="fs-5 d-flex gap-3">
            <i className="bi bi-facebook"></i>
            <i className="bi bi-linkedin"></i>
            <i className="bi bi-twitter-x"></i>
            <i className="bi bi-instagram"></i>
          </div>

        </div>

      </div>
    </footer>
  )
}