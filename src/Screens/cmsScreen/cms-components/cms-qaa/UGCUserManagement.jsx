import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../../../../context/AuthContextProvider'
import { FaUserPlus, FaTrash, FaEdit, FaUserSlash, FaUserCheck, FaEllipsisV } from 'react-icons/fa'
import { UGC_USER } from '../../../../utils/constants'

const BASE_URL = import.meta.env.VITE_API_URL;


function UGCUserManagement() {
    const { token } = useAuth()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        role: UGC_USER
    })
    const [deleteModalUserId, setDeleteModalUserId] = useState(null)
    const [openDropdownId, setOpenDropdownId] = useState(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/ugc-users`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            console.error('Error fetching users:', error)
            toast.error('Failed to load UGC users')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (isEditing) {
                await axios.put(`${BASE_URL}/admin/ugc-user/${selectedUser.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                toast.success('User updated successfully')
            } else {
                await axios.post(`${BASE_URL}/admin/signUp`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                toast.success('User created successfully')
            }
            fetchUsers()
            closeModal()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed')
        }
    }

    const handleDeleteClick = (id) => {
        setDeleteModalUserId(id)
    }

    const confirmDelete = async () => {
        if (!deleteModalUserId) return
        try {
            await axios.delete(`${BASE_URL}/admin/ugc-user/${deleteModalUserId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success('User deleted')
            fetchUsers()
        } catch (error) {
            toast.error('Failed to delete user')
        } finally {
            setDeleteModalUserId(null)
        }
    }

    const toggleStatus = async (user) => {
        try {
            await axios.patch(`${BASE_URL}/admin/ugc-user/toggle-status/${user.id}`, {
                isActive: !user.isActive
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success(`User ${!user.isActive ? 'activated' : 'inactivated'}`)
            fetchUsers()
        } catch (error) {
            toast.error('Failed to update status')
        }
    }

    const openEditModal = (user) => {
        setSelectedUser(user)
        setFormData({
            userName: user.userName,
            email: user.email,
            password: '',
            role: UGC_USER
        })
        setIsEditing(true)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setIsEditing(false)
        setSelectedUser(null)
        setFormData({ userName: '', email: '', password: '', role: UGC_USER })
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">UGC User Management</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-[#1169bf] text-[#1169bf] rounded-md hover:bg-[#1169bf] hover:text-white transition-all text-sm font-medium"
                >
                    <FaUserPlus className="text-lg" /> Create UGC User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-visible border border-gray-200">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm w-16">S.No.</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Username</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Email</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8">No UGC users found</td></tr>
                        ) : users.map((user, index) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-800">{index + 1}</td>
                                <td className="px-6 py-4 font-medium text-gray-800">{user.userName}</td>
                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right relative">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdownId(openDropdownId === user.id ? null : user.id);
                                        }}
                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <FaEllipsisV />
                                    </button>
                                    
                                    {openDropdownId === user.id && (
                                        <>
                                            <div 
                                                className="fixed inset-0 z-10" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdownId(null);
                                                }}
                                            ></div>
                                            <div className="absolute right-10 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-2 text-left">
                                                <button 
                                                    onClick={(e) => { 
                                                        e.stopPropagation();
                                                        openEditModal(user); 
                                                        setOpenDropdownId(null); 
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                                >
                                                    <FaEdit className="text-blue-500" /> Edit User
                                                </button>
                                                <button 
                                                    onClick={(e) => { 
                                                        e.stopPropagation();
                                                        toggleStatus(user); 
                                                        setOpenDropdownId(null); 
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                                >
                                                    {user.isActive ? (
                                                        <><FaUserSlash className="text-orange-500" /> Deactivate</>
                                                    ) : (
                                                        <><FaUserCheck className="text-green-500" /> Activate</>
                                                    )}
                                                </button>
                                                <button 
                                                    onClick={(e) => { 
                                                        e.stopPropagation();
                                                        handleDeleteClick(user.id); 
                                                        setOpenDropdownId(null); 
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                                >
                                                    <FaTrash className="text-red-500" /> Delete User
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create/Edit User Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit User' : 'Create New UGC User'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1169bf] focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1169bf] focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                            {!isEditing && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1169bf] focus:border-transparent outline-none"
                                        required
                                    />
                                </div>
                            )}
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 border border-[#1169bf] text-[#1169bf] rounded-lg hover:bg-[#1169bf] hover:text-white transition-all font-semibold">
                                    {isEditing ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalUserId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaTrash className="text-2xl text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Delete User</h3>
                        <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setDeleteModalUserId(null)} 
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete} 
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UGCUserManagement