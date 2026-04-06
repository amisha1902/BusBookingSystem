import { useState } from "react";

export default function TripSearchFilter({ onSearch, loading }) {
  const [filters, setFilters] = useState({
    source: "",
    destination: "",
    date: "",
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const swapLocations = () => {
    setFilters({
      ...filters,
      source: filters.destination,
      destination: filters.source,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">

      {/* Main Search Box */}
      <div className="bg-light border rounded-4 shadow-sm  p-2 d-flex align-items-center justify-content-between">

        {/* FROM */}
        <div className="px-3 ">
          <small className="text-muted">From</small>
          <input
            type="text"
            name="source"
            className="form-control border-1 p-0"
            value={filters.source}
            onChange={handleChange}
          />
        </div>

        {/* SWAP */}
        <button
          type="button"
          onClick={swapLocations}
          className="btn btn-secondary rounded-circle me-4"
          style={{ width: "38px", height: "38px" }}
        >
          ⇄
        </button>

        {/* TO */}
        <div className="px-2 border-end">
          <small className="text-muted">To</small>
          <input
            type="text"
            name="destination"
            className="form-control border-1 p-0"
            value={filters.destination}
            onChange={handleChange}
          />
        </div>

        {/* DATE */}
        <div className="px-2 border-end">
          <small className="text-muted">Date of Journey</small>
          <input
            type="date"
            name="date"
            className="form-control border-0 p-0"
            value={filters.date}
            onChange={handleChange}
          />
        </div>
 {/* SEARCH BUTTON */}
      <div className="text-center mt-2 ms-2">
        <button
          className="btn btn-danger rounded-pill"
          disabled={loading}
        >
          🔍 Search buses
        </button>
      </div>
      </div>

     

    </form>
  );
}