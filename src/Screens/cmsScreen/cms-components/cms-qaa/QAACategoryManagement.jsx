import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../../../../context/AuthContextProvider'
import { FaPlus, FaTrash, FaEdit, FaEllipsisV } from 'react-icons/fa'

const BASE_URL = import.meta.env.VITE_API_URL;

function QAACategoryManagement() {
    const { token } = useAuth()
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [openDropdownId, setOpenDropdownId] = useState(null)
    const [formData, setFormData] = useState({
        name: ''
    })

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/qaaCategories`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCategories(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            console.error('Error fetching QAA categories:', error)
            toast.error('Failed to load categories')
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
                await axios.put(`${BASE_URL}/qaaCategories/${selectedCategory.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                toast.success('Category updated successfully')
            } else {
                await axios.post(`${BASE_URL}/qaaCategories`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                toast.success('Category created successfully')
            }
            fetchCategories()
            closeModal()
        } catch (error) {
            toast.error(error.response?.data || 'Action failed')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category? All associated documents will lose this category reference.')) return
        try {
            await axios.delete(`${BASE_URL}/qaaCategories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success('Category deleted')
            fetchCategories()
        } catch (error) {
            toast.error('Failed to delete category')
        }
    }

    const openEditModal = (cat) => {
        setSelectedCategory(cat)
        setFormData({
            name: cat.name
        })
        setIsEditing(true)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setIsEditing(false)
        setSelectedCategory(null)
        setFormData({ name: '' })
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">QAA Category Management</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-[#1169bf] text-[#1169bf] rounded-md hover:bg-[#1169bf] hover:text-white transition-all text-sm font-medium"
                >
                    <FaPlus className="text-sm" /> Add Category
                </button>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm w-16 rounded-tl-xl">S.No.</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Category Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Created Date</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right rounded-tr-xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="4" className="text-center py-8">Loading...</td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-8">No categories found</td></tr>
                        ) : categories.map((cat, index) => (
                            <tr key={cat.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-800">{index + 1}</td>
                                <td className="px-6 py-4 font-medium text-gray-800">{cat.name}</td>
                                <td className="px-6 py-4 text-gray-600 text-sm">{cat.createdDate ? new Date(cat.createdDate).toISOString().split('T')[0] : 'N/A'}</td>
                                <td className="px-6 py-4 text-right relative">
                                    <button
                                        onClick={() => setOpenDropdownId(openDropdownId === cat.id ? null : cat.id)}
                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <FaEllipsisV />
                                    </button>

                                    {openDropdownId === cat.id && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setOpenDropdownId(null)}
                                            ></div>
                                            <div className="absolute right-10 top-12 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-2 text-left">
                                                <button
                                                    onClick={() => { openEditModal(cat); setOpenDropdownId(null); }}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                                >
                                                    <FaEdit className="text-indigo-500" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => { handleDelete(cat.id); setOpenDropdownId(null); }}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                                >
                                                    <FaTrash className="text-red-500" /> Delete
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

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Category' : 'Create New QAA Category'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Policies, Annual Reports, PRT"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1169bf] focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 border border-[#1169bf] text-[#1169bf] rounded-lg hover:bg-[#1169bf] hover:text-white transition-all font-semibold">
                                    {isEditing ? 'Update Category' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QAACategoryManagement
