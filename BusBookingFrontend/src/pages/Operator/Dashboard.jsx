import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const dashboardStats = {
    totalBuses: 12,
    totalRevenue: 245000,
    totalBookings: 1250,
    averageRating: 4.5,
    totalRating: 890
  };

  const monthlyRevenue = [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 22000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 25000 },
    { month: 'May', revenue: 28000 },
    { month: 'Jun', revenue: 32000 },
    { month: 'Jul', revenue: 35000 },
    { month: 'Aug', revenue: 40000 },
    { month: 'Sep', revenue: 38000 },
    { month: 'Oct', revenue: 42000 },
    { month: 'Nov', revenue: 45000 },
    { month: 'Dec', revenue: 50000 }
  ];

  const ratingBreakdown = [
    { stars: 5, count: 450, percentage: 50 },
    { stars: 4, count: 270, percentage: 30 },
    { stars: 3, count: 108, percentage: 12 },
    { stars: 2, count: 36, percentage: 4 },
    { stars: 1, count: 26, percentage: 4 }
  ];

  const getMaxRevenue = () => Math.max(...monthlyRevenue.map(m => m.revenue));

  return (
    <div className="container-fluid p-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      
      <h2 className="mb-5 fw-bold" style={{ color: '#1e3c72', fontSize: '2rem' }}>Dashboard</h2>

      {/* STATS */}
      <div className="row mb-5 g-3">
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', color: 'white' }}>
            <div className="card-body p-4">
              <div style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '0.5rem' }}>Total Buses</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{dashboardStats.totalBuses}</div>
              <small style={{ opacity: 0.8 }}>Active operations</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <div className="card-body p-4">
              <div style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '0.5rem' }}>Total Revenue</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₹{(dashboardStats.totalRevenue / 100000).toFixed(1)}L</div>
              <small style={{ opacity: 0.8 }}>Year to date</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <div className="card-body p-4">
              <div style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '0.5rem' }}>Total Bookings</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{dashboardStats.totalBookings}</div>
              <small style={{ opacity: 0.8 }}>Active bookings</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <div className="card-body p-4">
              <div style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '0.5rem' }}>Avg Rating</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{dashboardStats.averageRating}★</div>
              <small style={{ opacity: 0.8 }}>({dashboardStats.totalRating} reviews)</small>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="row mb-5 g-3">
        
        {/* Revenue */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body">
              <h6 className="fw-bold mb-4" style={{ color: '#1e3c72', fontSize: '1.1rem' }}>Monthly Revenue</h6>

              <div className="d-flex" style={{ height: '300px', alignItems: 'flex-end', gap: '8px' }}>
                {monthlyRevenue.map((item, index) => {
                  const height = (item.revenue / getMaxRevenue()) * 100;
                  return (
                    <div key={index} className="d-flex flex-column align-items-center" style={{ flex: 1 }}>
                      <div
                        style={{
                          height: `${height}%`,
                          background: 'linear-gradient(to top, #667eea, #764ba2)',
                          borderRadius: '4px',
                          width: '100%',
                          opacity: 0.85,
                          transition: 'opacity 0.2s'
                        }}
                        title={`${item.month}: ₹${item.revenue}`}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.85'}
                      />
                      <small className="mt-2 text-muted">{item.month}</small>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-body">
              <h6 className="fw-bold mb-4" style={{ color: '#1e3c72', fontSize: '1.1rem' }}>Rating Distribution</h6>

              {ratingBreakdown.map((item, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="text-muted">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: i < item.stars ? '#667eea' : '#ddd', fontSize: '1.1rem' }}>★</span>
                      ))}
                    </span>
                    <span className="fw-semibold">{item.percentage}%</span>
                  </div>

                  <div className="progress" style={{ height: '6px', background: '#eee' }}>
                    <div
                      style={{
                        width: `${item.percentage}%`,
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="row g-3">
        {[
          {
            title: 'Performance Trend',
            text: 'Revenue increased by 25% over last quarter.',
            color: '#1e3c72',
            icon: '📈'
          },
          {
            title: 'Customer Satisfaction',
            text: 'Strong ratings indicate good service quality.',
            color: '#667eea',
            icon: '⭐'
          },
          {
            title: 'Next Steps',
            text: 'Add buses on high-demand routes to grow faster.',
            color: '#764ba2',
            icon: '🚀'
          }
        ].map((card, i) => (
          <div key={i} className="col-md-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', borderLeftWidth: '4px', borderLeftStyle: 'solid', borderLeftColor: card.color }}>
              <div className="card-body">
                <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{card.icon}</div>
                <h6 className="fw-bold mb-2" style={{ color: card.color }}>
                  {card.title}
                </h6>
                <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>{card.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;