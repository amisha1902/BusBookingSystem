import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import './Home.css'
import BusChase from '../../components/BusChase.jsx'

export default function Home() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="home-page">
      <section className="hero-section text-white py-5" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
        <div className="container text-center py-5">
          <h1 className="display-3 fw-bold mb-3" style={{ color: '#fff' }}>
            🚌 OurBus
          </h1>
          <p className="lead mb-5" style={{ color: '#e8f0fe', fontSize: '1.3rem' }}>
            Easy Bus Booking, Trusted Operators
          </p>
          <BusChase/>
          {!isAuthenticated ? (
            <div className="d-flex gap-3 justify-content-center flex-wrap mt-4">
              <Link to="/login" className="btn btn-light btn-lg fw-600" style={{ minWidth: '150px' }}>
                Login
              </Link>
              <Link to="/signup/passenger" className="btn btn-outline-light btn-lg fw-600" style={{ minWidth: '150px' }}>
                Book Tickets
              </Link>
            </div>
          ) : (
            <div>
              <p className="mb-4" style={{ color: '#e8f0fe', fontSize: '1.1rem' }}>Welcome back, <strong>{user?.name}</strong>!</p>
              <Link to="operator/dashboard" className="btn btn-warning btn-lg fw-600" style={{ minWidth: '200px' }}>
                Go to Dashboard →
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="features-section py-5" style={{ background: '#f8f9fa' }}>
        <div className="container">
          <h2 className="text-center mb-5 fw-bold" style={{ color: '#1e3c72', fontSize: '2.2rem' }}>Why Choose OurBus</h2>
          <div className="row g-4">
            <div className="col-md-4 col-sm-6">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>⚡</div>
                  <h5 className="fw-bold" style={{ color: '#1e3c72' }}>Fast Booking</h5>
                  <p className="text-muted" style={{ fontSize: '0.95rem' }}>
                    Book your tickets in seconds with our simple interface.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>🔒</div>
                  <h5 className="fw-bold" style={{ color: '#1e3c72' }}>Secure & Safe</h5>
                  <p className="text-muted" style={{ fontSize: '0.95rem' }}>
                    Encrypted payments and secure transactions guaranteed.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-body text-center p-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>⭐</div>
                  <h5 className="fw-bold" style={{ color: '#1e3c72' }}>Best Operators</h5>
                  <p className="text-muted" style={{ fontSize: '0.95rem' }}>
                    Travel with trusted and top-rated bus operators.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="operator-section py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="container text-center">
          <h2 className="mb-4 fw-bold text-white" style={{ fontSize: '2.2rem' }}>Partner with OurBus</h2>
          <p className="lead mb-5 text-white" style={{ opacity: 0.9, fontSize: '1.1rem' }}>
            🚌 Register your bus company and grow your business with our platform
          </p>
          <Link to="/signup/operator" className="btn btn-light btn-lg fw-600" style={{ minWidth: '200px' }}>
            Become an Operator →
          </Link>
        </div>
      </section>
    </div>
  )
}