import { useState, useMemo } from 'react'

export default function BusForm({ onSubmit, onCancel, initialData, isEditing }) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})

  const seatLayouts = {
    ac_seater: { rows: 10, cols: 3 },
    non_ac_seater: { rows: 10, cols: 3 },
    ac_sleeper: { rows: 5, cols: 3 },
    non_ac_sleeper: { rows: 5, cols: 3 }
  }

  const calculatedSeats = useMemo(() => {
    const layout = seatLayouts[formData.bus_type]
    return layout ? layout.rows * layout.cols * (formData.deck || 1) : 0
  }, [formData])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">

        <h5 className="fw-semibold mb-3">
          {isEditing ? 'Edit Bus' : 'Add Bus'}
        </h5>

        <form onSubmit={handleSubmit}>
          <input className="form-control mb-3"
            placeholder="Bus Name"
            value={formData.bus_name}
            onChange={(e) => setFormData({ ...formData, bus_name: e.target.value })}
          />

          <input className="form-control mb-3"
            placeholder="Bus Number"
            value={formData.bus_no}
            onChange={(e) => setFormData({ ...formData, bus_no: e.target.value })}
          />

          <select className="form-select mb-3"
            value={formData.bus_type}
            onChange={(e) => setFormData({ ...formData, bus_type: e.target.value })}
          >
            <option value="ac_seater">AC Seater</option>
            <option value="non_ac_seater">Non-AC Seater</option>
            <option value="ac_sleeper">AC Sleeper</option>
            <option value="non_ac_sleeper">Non-AC Sleeper</option>
          </select>

          <select className="form-select mb-3"
            value={formData.deck}
            onChange={(e) => setFormData({ ...formData, deck: Number(e.target.value) })}
          >
            <option value="1">Single Deck</option>
            <option value="2">Double Deck</option>
          </select>

          <input className="form-control mb-3" value={calculatedSeats} disabled />

          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-light" onClick={onCancel}>Cancel</button>
            <button className="btn btn-primary">
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}