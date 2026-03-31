import { useLocation } from 'react-router-dom'
import '../styles/footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const location = useLocation()

  const authPages = ['/login', '/signup/passenger', '/signup/operator']
  if (authPages.includes(location.pathname)) {
    return null
  }

  return (
    <footer className="ourbus-footer">
      <div className="footer-main py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-2 col-md-4 col-sm-6">
              <h6 className="footer-title mb-3">About OurBus</h6>
              <ul className="footer-links">
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <a href="#mobile">Mobile App</a>
                </li>
                <li>
                  <a href="#blog">Blog</a>
                </li>
                <li>
                  <a href="#careers">Careers</a>
                </li>
                <li>
                  <a href="#investor">Investor Relations</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6">
              <h6 className="footer-title mb-3">Support</h6>
              <ul className="footer-links">
                <li>
                  <a href="#contact">Contact Us</a>
                </li>
                <li>
                  <a href="#faq">FAQs</a>
                </li>
                <li>
                  <a href="#help">Help Center</a>
                </li>
                <li>
                  <a href="#live-chat">Live Chat</a>
                </li>
                <li>
                  <a href="#report">Report Issue</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6">
              <h6 className="footer-title mb-3">Policies</h6>
              <ul className="footer-links">
                <li>
                  <a href="#privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="#terms">Terms & Conditions</a>
                </li>
                <li>
                  <a href="#refund">Refund Policy</a>
                </li>
                <li>
                  <a href="#cancellation">Cancellation Policy</a>
                </li>
                <li>
                  <a href="#disclaimer">Disclaimer</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6">
              <h6 className="footer-title mb-3">Popular Routes</h6>
              <ul className="footer-links">
                <li>
                  <a href="#delhi-bangalore">Delhi to Bangalore</a>
                </li>
                <li>
                  <a href="#mumbai-goa">Mumbai to Goa</a>
                </li>
                <li>
                  <a href="#bangalore-hyderabad">Bangalore to Hyderabad</a>
                </li>
                <li>
                  <a href="#delhi-manali">Delhi to Manali</a>
                </li>
                <li>
                  <a href="#pune-mumbai">Pune to Mumbai</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6">
              <h6 className="footer-title mb-3">For Partners</h6>
              <ul className="footer-links">
                <li>
                  <a href="#operator-register">Register as Operator</a>
                </li>
                <li>
                  <a href="#agent-register">Register as Agent</a>
                </li>
                <li>
                  <a href="#api">API Documentation</a>
                </li>
                <li>
                  <a href="#integration">Integration Guide</a>
                </li>
                <li>
                  <a href="#partner-support">Partner Support</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-4 col-sm-6">
              <h6 className="footer-title mb-3">Download App</h6>
              <div className="app-downloads mb-3">
                <a href="#play-store" className="app-link mb-2 d-block">
                  <span>🔵</span> Google Play
                </a>
                <a href="#app-store" className="app-link d-block">
                  <span>🍎</span> App Store
                </a>
              </div>
              <p className="text-muted small">
                Get 10% off on app downloads with code <strong>APP10</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="social-links">
                <a href="#facebook" className="social-link" title="Facebook">
                  <span>f</span>
                </a>
                <a href="#twitter" className="social-link" title="Twitter">
                  <span>𝕏</span>
                </a>
                <a href="#instagram" className="social-link" title="Instagram">
                  <span>📷</span>
                </a>
                <a href="#linkedin" className="social-link" title="LinkedIn">
                  <span>in</span>
                </a>
                <a href="#youtube" className="social-link" title="YouTube">
                  <span>▶️</span>
                </a>
              </div>
            </div>
            <div className="col-md-6 text-md-end text-center">
              <p className="copyright mb-0">
                © {currentYear} <strong>OurBus</strong>. India's No. 1 online bus ticket booking
                platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}