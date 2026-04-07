import { useEffect, useState } from 'react'
import { useAdmin } from '../../hooks/useAdmin'

export default function AdminUsers() {

    const {
        fetchAllUsers,
        updateUserStatus,
        deleteUser,
        searchUsers,
        users,
        loading,
        error
    } = useAdmin()

    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [roleFilter, setRoleFilter] = useState('')

    useEffect(() => {
        fetchAllUsers(currentPage)
    }, [currentPage])

    const handleSearch = async (e) => {
        e.preventDefault()

        await searchUsers({
            search: searchTerm,
            role: roleFilter
        })
    }

    const handleStatusToggle = async (userId, currentStatus) => {
        const newStatus = !currentStatus
        await updateUserStatus(userId, newStatus)
    }

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId)
            } catch (err) {
                console.error('Failed to delete user:', err)
            }
        }
    }

    return (
        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Users Management</h3>
            </div>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                </div>
            )}

            {/* Search */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">

                    <form onSubmit={handleSearch} className="row g-2">
                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="operator">Operator</option>
                                <option value="passenger">Passenger</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <button type="submit" className="btn btn-primary w-100">
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Users Table */}

            <div className="card shadow-sm border-0">

                <div className="card-header bg-light">
                    <h5 className="mb-0">All Users ({users.length})</h5>
                </div>

                <div className="card-body p-0">

                    {loading ? (
                        <div className="p-4 text-center">
                            <div className="spinner-border"></div>
                        </div>
                    ) : users.length > 0 ? (

                        <div className="table-responsive">

                            <table className="table table-hover mb-0">

                                <thead className="table-light">
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Joined</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {users.map(user => (

                                        <tr key={user.id}>

                                            <td className="py-3 fw-bold">
                                                {user.name}
                                            </td>

                                            <td className="py-3 text-muted">
                                                {user.email}
                                            </td>

                                            <td className="py-3">
                                                <span className="badge bg-info">
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="py-3">
                                                <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>

                                            <td className="py-3 text-muted">
                                                {user.created_at?.split('T')[0]}
                                            </td>

                                            <td className="py-3">

                                                <div className="btn-group">

                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => handleStatusToggle(user.id, user.is_active)}
                                                    >
                                                        {user.is_active ? '🔒' : '🔓'}
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        🗑️
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    ) : (

                        <div className="p-4 text-center text-muted">
                            No users found
                        </div>

                    )}

                </div>

            </div>

        </div>
    )
}