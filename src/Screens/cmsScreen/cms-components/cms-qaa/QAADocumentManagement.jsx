import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../../../../context/AuthContextProvider'
import { FaCloudUploadAlt, FaTrash, FaEdit, FaEye, FaEyeSlash, FaFileDownload, FaEllipsisV, FaExternalLinkAlt } from 'react-icons/fa'

const BASE_URL = import.meta.env.VITE_API_URL;

function QAADocumentManagement() {
    const { token } = useAuth()
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [selectedDoc, setSelectedDoc] = useState(null)
    const [file, setFile] = useState(null)
    const [categories, setCategories] = useState([])
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        visibility: true,
        categoryId: ''
    })
    const [openDropdownId, setOpenDropdownId] = useState(null)
    const [deleteModalDocId, setDeleteModalDocId] = useState(null)
    const [page, setPage] = useState(0)
    const pageSize = 10

    useEffect(() => {
        fetchDocuments()
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
        }
    }

    const fetchDocuments = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/qaa/all`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            console.log('Fetched QAA documents:', response.data)
            setDocuments(Array.isArray(response.data) ? response.data : [])
            setPage(0)
        } catch (error) {
            console.error('Error fetching QAA documents:', error)
            toast.error('Failed to load QAA documents')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append('title', formData.title)
        data.append('description', formData.description)
        data.append('visibility', formData.visibility)
        if (formData.categoryId) data.append('categoryId', formData.categoryId)
        if (file) data.append('file', file)

        try {
            if (isEditing) {
                await axios.put(`${BASE_URL}/qaa/update/${selectedDoc.id}`, data, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                toast.success('Document updated successfully')
            } else {
                if (!file) return toast.error('Please select a file')
                await axios.post(`${BASE_URL}/qaa/upload`, data, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                toast.success('Document uploaded successfully')
            }
            fetchDocuments()
            closeModal()
        } catch (error) {
            toast.error('Action failed')
        }
    }

    const handleDeleteClick = (id) => {
        setDeleteModalDocId(id)
        setOpenDropdownId(null)
    }

    const confirmDelete = async () => {
        if (!deleteModalDocId) return
        try {
            await axios.delete(`${BASE_URL}/qaa/delete/${deleteModalDocId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success('Document deleted')
            fetchDocuments()
        } catch (error) {
            toast.error('Failed to delete document')
        } finally {
            setDeleteModalDocId(null)
        }
    }

    const toggleVisibility = async (doc) => {
        try {
            await axios.put(`${BASE_URL}/qaa/update/${doc.id}`, {
                ...doc,
                visibility: !doc.visibility
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success(`Visibility updated`)
            fetchDocuments()
        } catch (error) {
            toast.error('Failed to update visibility')
        }
    }

    const openEditModal = (doc) => {
        setSelectedDoc(doc)
        setFormData({
            title: doc.title,
            description: doc.description,
            visibility: doc.visibility === 1 || doc.visibility === true,
            categoryId: doc.categoryId || ''
        })
        setIsEditing(true)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setIsEditing(false)
        setSelectedDoc(null)
        setFile(null)
        setFormData({ title: '', description: '', visibility: true, categoryId: '' })
    }

    const handleDownload = async (doc) => {
        try {
            const response = await axios.get(`${BASE_URL}/qaa/download/${doc.id}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            })
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', doc.title + (doc.filePath.substring(doc.filePath.lastIndexOf('.'))))
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            toast.error('Download failed')
        }
    }

    const startIdx = page * pageSize;
    const endIdx = startIdx + pageSize;
    const pageCount = Math.ceil(documents.length / pageSize);
    const pageDocuments = documents.slice(startIdx, endIdx);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">QAA Document Management</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-[#1169bf] text-[#1169bf] rounded-md hover:bg-[#1169bf] hover:text-white transition-all text-sm font-medium"
                >
                    <FaCloudUploadAlt className="text-lg" /> Upload Document
                </button>
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm w-16 rounded-tl-xl">S.No.</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Title</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Category</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Visibility</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm">Upload Date</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-sm text-right rounded-tr-xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-8">Loading...</td></tr>
                        ) : documents.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-8">No documents found</td></tr>
                        ) : pageDocuments.map((doc, index) => (
                            <tr key={doc.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-800">{startIdx + index + 1}</td>
                                <td className="px-6 py-4 font-medium text-gray-800">
                                    <a href={`${import.meta.env.VITE_FILE_URL}/qaa/${doc.filePath}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#1169bf] hover:underline">
                                        {doc.title}
                                    </a>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm font-medium">
                                    {doc.categoryName || <span className="text-gray-400 italic">No Category</span>}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${doc.visibility ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {doc.visibility ? 'Public (UGC)' : 'Private'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm">{new Date(doc.uploadDate).toISOString().split('T')[0]}</td>
                                <td className="px-6 py-4 text-right relative">
                                    <button 
                                        onClick={() => setOpenDropdownId(openDropdownId === doc.id ? null : doc.id)}
                                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <FaEllipsisV />
                                    </button>
                                    
                                    {openDropdownId === doc.id && (
                                        <>
                                            <div 
                                                className="fixed inset-0 z-10" 
                                                onClick={() => setOpenDropdownId(null)}
                                            ></div>
                                            <div className="absolute right-10 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-20 py-2 text-left">
                                                <a 
                                                    href={`${import.meta.env.VITE_FILE_URL}/qaa/${doc.filePath}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                                                >
                                                    <FaExternalLinkAlt className="text-gray-400" /> View
                                                </a>
                                                <button 
                                                    onClick={() => { toggleVisibility(doc); setOpenDropdownId(null); }}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                                >
                                                    {doc.visibility ? <><FaEyeSlash className="text-orange-500" /> Hide (Private)</> : <><FaEye className="text-green-500" /> Show (Public)</>}
                                                </button>
                                                <button 
                                                    onClick={() => { handleDownload(doc); setOpenDropdownId(null); }}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                                >
                                                    <FaFileDownload className="text-blue-500" /> Download
                                                </button>
                                                <button 
                                                    onClick={() => { openEditModal(doc); setOpenDropdownId(null); }}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                                                >
                                                    <FaEdit className="text-indigo-500" /> Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(doc.id)}
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
                {documents.length > pageSize && (
                    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white">
                        <div className="text-sm text-gray-600">
                            Showing {startIdx + 1} to {Math.min(endIdx, documents.length)} of {documents.length}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(Math.max(0, page - 1))}
                                disabled={page === 0}
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            {Array.from({ length: pageCount }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`px-3 py-1 text-sm border rounded ${
                                        page === i
                                            ? 'bg-[#1169bf] text-white border-[#1169bf]'
                                            : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(Math.min(pageCount - 1, page + 1))}
                                disabled={page >= pageCount - 1}
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">{isEditing ? 'Edit Document' : 'Upload Document'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1169bf] focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1169bf] focus:border-transparent outline-none"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1169bf] focus:border-transparent outline-none bg-white"
                                >
                                    <option value="">Select Category (Optional)</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF/DOCX/IMG) {isEditing && <span className="text-gray-400 text-xs">(Leave empty to keep existing)</span>}</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#1169bf] hover:file:bg-blue-100"
                                    required={!isEditing}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="visibility"
                                    id="visibility"
                                    checked={formData.visibility}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-[#1169bf] rounded"
                                />
                                <label htmlFor="visibility" className="text-sm text-gray-700">Visible to UGC Users</label>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 border border-[#1169bf] text-[#1169bf] rounded-lg hover:bg-[#1169bf] hover:text-white transition-all font-semibold">
                                    {isEditing ? 'Update Document' : 'Upload Now'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteModalDocId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaTrash className="text-2xl text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Document</h3>
                        <p className="text-gray-500 text-sm mb-6">Are you sure you want to delete this document? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setDeleteModalDocId(null)} 
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

export default QAADocumentManagement
