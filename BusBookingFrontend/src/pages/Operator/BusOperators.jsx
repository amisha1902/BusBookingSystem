import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOperators, createOperator, updateOperator, deleteOperator } from '../../api/operatorApi';
import CompanyForm from '../../components/Operator/Companies/CompanyForm';
import CompanyList from '../../components/Operator/Companies/CompanyList';

const BusOperators = () => {
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await getAllOperators();
      setCompanies(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch operators');
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingCompany) {
        await updateOperator(editingCompany.id, formData);
        setSuccess('Bus operator updated successfully');
      } else {
        await createOperator(formData);
        setSuccess('Bus operator created successfully');
      }

      setShowForm(false);
      setEditingCompany(null);
      fetchCompanies();
    } catch (err) {
      setError(err.message || 'Failed to save operator');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this operator?')) {
      try {
        await deleteOperator(id);
        setSuccess('Bus operator deleted successfully');
        fetchCompanies();
      } catch (err) {
        setError(err.message || 'Failed to delete operator');
      }
    }
  };

  const handleOperatorClick = (company) => {
    navigate(`/operator/bus-operators/${company.id}/buses`);
  };

  return (
    <div style={{ background: '#f5f6f8', minHeight: '100vh', padding: '24px' }}>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold" style={{ color: '#2c3e50' }}>🚌 Bus Operators</h3>

        <button
          className="btn"
          style={{ background: '#0d6efd', color: '#fff' }}
          onClick={() => {
            setEditingCompany(null);
            setShowForm(true);
          }}
          disabled={loading}
        >
          + Add Operator
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {success && (
        <div className="alert alert-success">{success}</div>
      )}

      {showForm && (
        <CompanyForm
          initialData={editingCompany || {
            company_name: '',
            license_no: '',
            contact_email: '',
          }}
          isEditing={!!editingCompany}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCompany(null);
          }}
        />
      )}

      <CompanyList
        companies={companies}
        onSelectCompany={handleOperatorClick}
        onEditCompany={(company) => {
          setEditingCompany(company);
          setShowForm(true);
        }}
        onDeleteCompany={handleDelete}
      />
    </div>
  );
};

export default BusOperators;