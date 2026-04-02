import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBuses, createBus, updateBus, deleteBus } from '../../api/BusApi';
import BusForm from '../../components/Operator/Buses/BusForm'
import BusList from '../../components/Operator/Buses/BusList';

const OperatorBuses = () => {
  const { operatorId } = useParams();
  const navigate = useNavigate();

  const [buses, setBuses] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    fetchBuses();
  }, [operatorId]);

  const fetchBuses = async () => {
    try {
      const response = await getBuses(operatorId);
      const busesArray = Array.isArray(response.data) ? response.data : response.data || [];
      setBuses(busesArray);
      setSelectedCompany({ id: operatorId, company_name: 'Bus Operator' });
    } catch (err) {
      if (err.status === 403 || err.status === 401) {
        setIsAuthorized(false);
        setError('Unauthorized access');
        setTimeout(() => navigate('/operator/bus-operators'), 2000);
      } else {
        setError(err.message || 'Failed to fetch buses');
      }
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingBus) {
        await updateBus(operatorId, editingBus.id, formData);
        setSuccess('Bus updated');
      } else {
        await createBus(operatorId, formData);
        setSuccess('Bus created');
      }

      setShowForm(false);
      setEditingBus(null);
      fetchBuses();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this bus?')) {
      try {
        await deleteBus(operatorId, id);
        setSuccess('Bus deleted');
        fetchBuses();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div style={{ background: '#f5f6f8', minHeight: '100vh', padding: '24px' }}>

      <h4 className="fw-bold mb-4" style={{ color: '#2c3e50' }}>
        🚌 Buses
      </h4>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <BusForm
          initialData={editingBus || undefined}
          isEditing={!!editingBus}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <BusList
        buses={buses}
        selectedCompany={selectedCompany}
        onAddBus={() => setShowForm(true)}
        onEditBus={(bus) => {
          setEditingBus(bus);
          setShowForm(true);
        }}
        onDeleteBus={handleDelete}
      />
    </div>
  );
};

export default OperatorBuses;