import { useState, useEffect } from 'react'
import { useAxios } from '../../hooks/useAxios.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import {
  getAllOperators,
  createOperator,
  updateOperator,
  deleteOperator,
} from '../../api/operatorApi'
import {
  getBuses,
  createBus,
  updateBus,
  deleteBus,
} from '../../api/BusApi'
import Alert from '../../components/Common/Alert.jsx'
import LoadingSpinner from '../../components/Common/Spinner.jsx'
import CompanyList from '../../components/Operator/Companies/CompanyList.jsx'
import CompanyForm from '../../components/Operator/Companies/CompanyForm.jsx'
import BusList from '../../components/Operator/Buses/BusList.jsx'
import BusForm from '../../components/Operator/Buses/BusForm.jsx'
import './OperatorDashboard.css'

export default function OperatorDashboard() {
  const { user } = useAuth()
  const { execute, loading } = useAxios()

  const [companies, setCompanies] = useState([])
  const [showCompanyForm, setShowCompanyForm] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [companyFormData, setCompanyFormData] = useState({
    company_name: '',
    license_no: '',
    contact_email: '',
  })

  const [selectedCompany, setSelectedCompany] = useState(null)
  const [buses, setBuses] = useState([])
  const [showBusForm, setShowBusForm] = useState(false)
  const [editingBus, setEditingBus] = useState(null)
  const [busFormData, setBusFormData] = useState({
    bus_name: '',
    bus_no: '',
    bus_type: 'ac_seater',
    total_seats: 40,
  })

  const [alert, setAlert] = useState({ type: '', message: '' })

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      await execute(async () => {
        const response = await getAllOperators()
        const userCompanies = response.data.filter((c) => c.owner.id === user?.id)
        setCompanies(userCompanies)
      })
    } catch (error) {
      setAlert({
        type: 'danger',
        message: 'Failed to load companies',
      })
    }
  }

  const loadBuses = async (companyId) => {
    try {
      await execute(async () => {
        const response = await getBuses(companyId)
        setBuses(response.data || [])
      })
    } catch (error) {
      setAlert({
        type: 'danger',
        message: 'Failed to load buses',
      })
    }
  }

  const handleCreateUpdateCompany = async (data) => {
    try {
      await execute(async () => {
        if (editingCompany) {
          await updateOperator(editingCompany.id, data)
          setAlert({
            type: 'success',
            message: 'Company updated successfully',
          })
        } else {
          await createOperator(data)
          setAlert({
            type: 'success',
            message: 'Company created successfully',
          })
        }
        setShowCompanyForm(false)
        setEditingCompany(null)
        setCompanyFormData({
          company_name: '',
          license_no: '',
          contact_email: '',
        })
        loadCompanies()
      })
    } catch (error) {
      setAlert({
        type: 'danger',
        message: editingCompany
          ? 'Failed to update company'
          : 'Failed to create company',
      })
    }
  }

  const handleEditCompany = (company) => {
    setEditingCompany(company)
    setCompanyFormData({
      company_name: company.company_name,
      license_no: company.license_no,
      contact_email: company.contact_email,
    })
    setShowCompanyForm(true)
  }

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await execute(async () => {
          await deleteOperator(companyId)
          setAlert({
            type: 'success',
            message: 'Company deleted successfully',
          })
          loadCompanies()
          if (selectedCompany?.id === companyId) {
            setSelectedCompany(null)
            setBuses([])
          }
        })
      } catch (error) {
        setAlert({
          type: 'danger',
          message: 'Failed to delete company',
        })
      }
    }
  }

  const handleSelectCompany = (company) => {
    setSelectedCompany(company)
    loadBuses(company.id)
    setShowBusForm(false)
    setEditingBus(null)
    setBusFormData({
      bus_name: '',
      bus_no: '',
      bus_type: 'ac_seater',
      total_seats: 40,
    })
  }

  const handleCreateUpdateBus = async (data) => {
    if (!selectedCompany) return

    try {
      await execute(async () => {
        if (editingBus) {
          await updateBus(selectedCompany.id, editingBus.id, data)
          setAlert({
            type: 'success',
            message: 'Bus updated successfully',
          })
        } else {
          await createBus(selectedCompany.id, data)
          setAlert({
            type: 'success',
            message: 'Bus created successfully',
          })
        }
        setShowBusForm(false)
        setEditingBus(null)
        setBusFormData({
          bus_name: '',
          bus_no: '',
          bus_type: 'ac_seater',
          total_seats: 40,
        })
        loadBuses(selectedCompany.id)
      })
    } catch (error) {
      setAlert({
        type: 'danger',
        message: editingBus ? 'Failed to update bus' : 'Failed to create bus',
      })
    }
  }

  const handleEditBus = (bus) => {
    setEditingBus(bus)
    setBusFormData({
      bus_name: bus.bus_name,
      bus_no: bus.bus_no,
      bus_type: bus.bus_type,
      total_seats: bus.total_seats,
    })
    setShowBusForm(true)
  }

  const handleDeleteBus = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await execute(async () => {
          await deleteBus(selectedCompany.id, busId)
          setAlert({
            type: 'success',
            message: 'Bus deleted successfully',
          })
          loadBuses(selectedCompany.id)
        })
      } catch (error) {
        setAlert({
          type: 'danger',
          message: 'Failed to delete bus',
        })
      }
    }
  }

  return (
    <div className="py-4">
      <div className="container-fluid">
        <div className="dashboard-header mb-5">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="mb-2">Welcome, {user?.name}! 👋</h1>
              <p className="text-muted">Manage your bus companies and fleet</p>
            </div>
          </div>
        </div>

        {alert.message && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: '', message: '' })}
          />
        )}

        {loading && <LoadingSpinner message="Processing..." />}

        <div className="row">
          <div className="col-lg-4 mb-4">
            <CompanyList
              companies={companies}
              selectedCompany={selectedCompany}
              onSelectCompany={handleSelectCompany}
              onEditCompany={handleEditCompany}
              onDeleteCompany={handleDeleteCompany}
              onAddCompany={() => {
                setEditingCompany(null)
                setCompanyFormData({
                  company_name: '',
                  license_no: '',
                  contact_email: '',
                })
                setShowCompanyForm(true)
              }}
            />

            {showCompanyForm && (
              <CompanyForm
                initialData={companyFormData}
                isEditing={!!editingCompany}
                onSubmit={handleCreateUpdateCompany}
                onCancel={() => {
                  setShowCompanyForm(false)
                  setEditingCompany(null)
                }}
              />
            )}
          </div>

          <div className="col-lg-8 mb-4">
            {showBusForm && (
              <BusForm
                initialData={busFormData}
                isEditing={!!editingBus}
                onSubmit={handleCreateUpdateBus}
                onCancel={() => {
                  setShowBusForm(false)
                  setEditingBus(null)
                }}
              />
            )}

            <BusList
              buses={buses}
              selectedCompany={selectedCompany}
              onEditBus={handleEditBus}
              onDeleteBus={handleDeleteBus}
              onAddBus={() => {
                setEditingBus(null)
                setBusFormData({
                  bus_name: '',
                  bus_no: '',
                  bus_type: 'ac_seater',
                  total_seats: 40,
                })
                setShowBusForm(true)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
