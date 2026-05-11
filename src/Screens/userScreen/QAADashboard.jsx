import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../../context/AuthContextProvider'
import { FaDownload, FaSearch } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { getAllFaculties, getAllPrograms } from '../cmsScreen/cms-components/cms-academics/academicsApi'
import { getAllTeams } from '../cmsScreen/cms-components/cms-team/teamApi'
import { getAllpublication } from '../cmsScreen/cms-components/cms-publication/publicationApi'
import { DataGrid } from '@mui/x-data-grid'
import { 
    Tabs, 
    TabsHeader, 
    TabsBody,
    Tab,
    TabPanel
} from "@material-tailwind/react"
import { Grid, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

import adminImage from '../../../public/admin1.png'

const BASE_URL = import.meta.env.VITE_API_URL;
const collegeName = import.meta.env.VITE_COLLEGE_NAME;

function QAADashboard() {
    const { token, userName } = useAuth()
    const { tab: activeTab } = useParams()
    const navigate = useNavigate()
    const [subTab, setSubTab] = useState(() => {
        if (activeTab === 'programs') return 'Bachelor'
        if (activeTab === 'publications') return 'Publication'
        if (activeTab === 'faculties') return 'All'
        return ''
    })
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        if (activeTab === 'programs') setSubTab('Bachelor')
        else if (activeTab === 'publications') setSubTab('Publication')
        else if (activeTab === 'faculties') setSubTab('All')
        else setSubTab('')
        
        if (activeTab) fetchData(activeTab)
    }, [activeTab])

    const fetchData = async (tab) => {
        setLoading(true)
        setSearchQuery('')
        try {
            let result = []
            if (tab === 'qaa') {
                const response = await axios.get(`${BASE_URL}/qaa/list`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                result = response.data
            } else if (tab === 'faculties') {
                result = await getAllFaculties()
            } else if (tab === 'programs') {
                result = await getAllPrograms()
            } else if (tab === 'publications') {
                result = await getAllpublication()
            } else if (tab === 'team') {
                result = await getAllTeams()
            }
            
            console.log(`Fetched result for ${tab}:`, result);
            setData(Array.isArray(result) ? result : [])
        } catch (error) {
            console.error(`Error fetching ${tab}:`, error)
            toast.error(`Failed to load ${tab}`)
        } finally {
            setLoading(false)
        }
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
            link.setAttribute('download', doc.title + (doc.filePath?.substring(doc.filePath.lastIndexOf('.')) || ''))
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            toast.error('Download failed')
        }
    }

    const rows = useMemo(() => {
        console.log('QAADashboard Data:', data);
        if (!data || !Array.isArray(data)) return []
        
        let filtered = data
        if (activeTab === 'faculties' && subTab !== 'All') {
            filtered = data.filter(item => item.level === subTab)
        } else if (activeTab === 'programs') {
            filtered = data.filter(item => item.level === subTab)
        } else if (activeTab === 'publications') {
            filtered = data.filter(item => item.category === subTab)
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            filtered = filtered.filter(item => 
                Object.values(item || {}).some(val => String(val).toLowerCase().includes(q))
            )
        }

        if (!Array.isArray(filtered)) return []

        return filtered.map((item, index) => ({
            ...item,
            id: item._id || item.id || index,
            sno: index + 1,
            runningFrom: item.runningFrom?.split('T')[0] || item.runningFrom,
            publishedAt: item.publishedAt?.split('T')[0] || item.publishedAt,
            expiredAt: item.expiredAt?.split('T')[0] || item.expiredAt,
            uploadDate: item.uploadDate?.split('T')[0] || item.uploadDate
        }))
    }, [data, activeTab, subTab, searchQuery])

    const getHeaderStyle = () => ({
        '.MuiDataGrid-columnHeader': {
            backgroundColor: (activeTab === 'faculties' || activeTab === 'team' || activeTab === 'qaa') ? '#1169bf' : 'white',
            color: (activeTab === 'faculties' || activeTab === 'team' || activeTab === 'qaa') ? 'white' : '#333',
            fontWeight: '600',
            fontSize: '14px',
            borderRight: (activeTab === 'faculties' || activeTab === 'team' || activeTab === 'qaa') ? '1px solid #f0f0f033' : '1px solid #f0f0f0',
            borderBottom: (activeTab === 'faculties' || activeTab === 'team' || activeTab === 'qaa') ? 'none' : '1px solid #e0e0e0',
        },
        '.MuiDataGrid-footerContainer': { minHeight: '45px', borderTop: '1px solid #e0e0e0' },
        '.MuiDataGrid-columnSeparator': { display: 'none' },
        '& .MuiDataGrid-row:hover': { cursor: 'pointer', backgroundColor: '#f9fafb' },
        '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
        '.MuiDataGrid-columnHeaderTitle': { 
            fontWeight: '600',
            fontSize: '14px'
        },
        '& .MuiDataGrid-cell': {
            fontSize: '14px',
            color: '#444'
        },
        width: '100%',
        minHeight: '400px',
        backgroundColor: 'white'
    })

    const columns = useMemo(() => {
        if (activeTab === 'faculties') {
            return [
                { field: 'sno', headerName: 'S.No.', width: 70 },
                { field: 'facultyName', headerName: 'Faculty Name', flex: 1.5 },
                { field: 'level', headerName: 'level', flex: 1 },
            ]
        }
        if (activeTab === 'programs') {
            return [
                { field: 'sno', headerName: 'S.No.', width: 70 },
                { field: 'programName', headerName: 'Program Name', flex: 2.5 },
                { field: 'facultyName', headerName: 'Faculty Name', flex: 2 },
                { field: 'status', headerName: 'Status', flex: 1, renderCell: (p) => (p.value === true || p.value === 'true') ? 'Active' : 'Inactive' },
                { field: 'runningFrom', headerName: 'Running From', flex: 1.5 },
            ]
        }
        if (activeTab === 'publications') {
            return [
                { field: 'sno', headerName: 'S.No.', width: 70 },
                { field: 'category', headerName: 'Sub-category', flex: 1.2 },
                { field: 'publicationTitle', headerName: 'Publication Title', flex: 3 },
                { field: 'status', headerName: 'Status', flex: 0.8, renderCell: (p) => (p.value === true || p.value === 'true') ? 'Active' : 'Inactive' },
                { field: 'publishedAt', headerName: 'Pub date', flex: 1.2 },
                { field: 'expiredAt', headerName: 'Exp date', flex: 1.2 },
            ]
        }
        if (activeTab === 'team') {
            return [
                { field: 'sno', headerName: 'S.No.', width: 70 },
                { field: 'fullName', headerName: 'Full Name', flex: 2, valueGetter: (params, row) => `${row.firstName || ''} ${row.lastName || ''}` },
                { field: 'index', headerName: 'Index', width: 100 },
                { field: 'subCategory', headerName: 'Position', flex: 1.5 },
                { field: 'email', headerName: 'Email', flex: 2 },
                { field: 'phoneNo', headerName: 'Contact Number', flex: 1.5 },
                { field: 'status', headerName: 'Status', flex: 1, renderCell: (p) => p.value === true || p.value === 'true' ? 'Active' : 'Inactive' },
            ]
        }
        if (activeTab === 'qaa') {
            return [
                { field: 'sno', headerName: 'S.No.', width: 70 },
                { field: 'title', headerName: 'Document Title', flex: 2 },
                { field: 'description', headerName: 'Description', flex: 3 },
                { field: 'uploadDate', headerName: 'Upload Date', flex: 1.5 },
                {
                    field: 'download',
                    headerName: 'Download',
                    width: 100,
                    renderCell: (params) => (
                        <a href={`${BASE_URL}/uploads/qaa/${params.row.filePath}`} target="_blank" rel="noreferrer">
                            <FaDownload className="text-[#1169bf] mt-3 cursor-pointer" size={18} />
                        </a>
                    )
                }
            ]
        }
        return []
    }, [activeTab])

    const renderBreadcrumbs = () => {
        if (!activeTab) return null;

        const crumbs = [
            { label: 'QAA', tab: 'qaa' }
        ];

        if (activeTab === 'faculties' || activeTab === 'programs') {
            crumbs.push({ label: 'Academics', tab: null });
            crumbs.push({ label: activeTab === 'faculties' ? 'Faculties' : 'Programs', tab: activeTab });
        } else if (activeTab === 'publications') {
            crumbs.push({ label: 'Contents', tab: 'publications' });
        } else if (activeTab === 'team') {
            crumbs.push({ label: 'Team', tab: 'team' });
        } else if (activeTab === 'qaa') {
            // Already added as root
        }

        return (
            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1.5, px: 1 }}>
                {crumbs.map((crumb, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Typography 
                            onClick={() => crumb.tab && navigate(`/qaa/${crumb.tab}`)}
                            sx={{ 
                                color: index === crumbs.length - 1 ? '#1169bf' : '#666',
                                fontWeight: index === crumbs.length - 1 ? '600' : '400',
                                cursor: crumb.tab ? 'pointer' : 'default',
                                '&:hover': { color: crumb.tab ? '#1169bf' : 'inherit' },
                                fontSize: '14px',
                                textDecoration: crumb.tab ? 'underline' : 'none'
                            }}
                        >
                            {crumb.label}
                        </Typography>
                        {index < crumbs.length - 1 && <Typography sx={{ color: '#ccc', fontSize: '14px' }}>/</Typography>}
                    </div>
                ))}
            </Box>
        );
    };

    const isSubTabValid = 
        (activeTab === 'programs' && (subTab === 'Bachelor' || subTab === 'Master')) ||
        (activeTab === 'publications' && ['Report', 'Publication', 'News and Events', 'Notices', 'Downloads', 'Thesis', 'Research', 'Curriculum', 'Other'].includes(subTab));

    return (
        <Box sx={{ py: 2, px: { xs: 2, md: 10 }, minHeight: '80vh', backgroundColor: 'white', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
            <Box sx={{ maxWidth: '1600px', mx: 'auto' }}>
                {renderBreadcrumbs()}
                {!activeTab && (
                    <Box sx={{ position: 'relative', mb: 8 }}>
                        <img src={adminImage} alt="admin dashboard" style={{ width: '100%', height: '460px', objectFit: 'contain' }} />
                        <Box sx={{ position: 'absolute', top: 40, left: { xs: 20, md: 60 } }}>
                            <Typography sx={{ fontWeight: '700', fontSize: '32px', color: '#1169bf', lineHeight: 1.2, mb: 3 }}> 
                                Hello {userName || 'User'}, <br /> 
                                Welcome to the QAA Portal of {collegeName} 
                            </Typography>
                            <button 
                                onClick={() => navigate('/qaa/qaa')}
                                className="px-8 py-3 border-2 border-[#1169bf] text-[#1169bf] rounded-lg font-bold hover:bg-[#1169bf] hover:text-white transition-all text-sm shadow-sm"
                            >
                                Browse Contents
                            </button>
                        </Box>
                    </Box>
                )}

                {activeTab && (
                    <Grid container sx={{ px: 0, pb: 4, mx: 'auto' }}>
                        <Typography sx={{ mx: 'auto', mb: 2, fontWeight: '400', fontSize: '32px', color: '#000' }}>
                            List of {activeTab === 'publications' ? 'contents' : activeTab === 'qaa' ? 'QAA Documents' : activeTab === 'programs' ? 'Programs' : activeTab === 'faculties' ? 'Faculties' : activeTab === 'team' ? 'team members' : activeTab}
                        </Typography>

                        <Box sx={{ width: '100%' }}>
                            {(activeTab === 'programs' || activeTab === 'publications' || activeTab === 'faculties') && (
                                <Box sx={{ p: 2, backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                                    {activeTab === 'faculties' && (
                                        <Box sx={{ mb: 4 }}>
                                            <FormControl sx={{ maxWidth: "300px" }} size="small" fullWidth>
                                                <InputLabel id="select-level-label">Select Level</InputLabel>
                                                <Select 
                                                    labelId="select-level-label"
                                                    value={subTab} 
                                                    onChange={(e) => setSubTab(e.target.value)} 
                                                    label="Select Level"
                                                    sx={{ backgroundColor: 'white' }}
                                                >
                                                    <MenuItem value="All">All Faculty</MenuItem>
                                                    <MenuItem value="Bachelor">Bachelor</MenuItem>
                                                    <MenuItem value="Master">Master</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    )}

                                    {isSubTabValid && (
                                        <Tabs key={activeTab} value={subTab} className="p-0 mb-0">
                                            <TabsHeader 
                                                className="rounded-t-lg rounded-b-none h-[50px] p-1" 
                                                style={{ 
                                                    backgroundColor: '#1169bf',
                                                    zIndex: 1
                                                }}
                                                indicatorProps={{
                                                    className: "bg-white shadow-none rounded-md",
                                                }}
                                            >
                                                {activeTab === 'programs' ? (
                                                    <>
                                                        <Tab onClick={() => setSubTab('Bachelor')} value="Bachelor" className={`font-bold transition-colors ${subTab === 'Bachelor' ? 'text-black' : 'text-white'}`}>
                                                            Bachelor
                                                        </Tab>
                                                        <Tab onClick={() => setSubTab('Master')} value="Master" className={`font-bold transition-colors ${subTab === 'Master' ? 'text-black' : 'text-white'}`}>
                                                            Masters
                                                        </Tab>
                                                    </>
                                                ) : (
                                                    ['Report', 'Publication', 'News and Events', 'Notices', 'Downloads', 'Thesis', 'Research', 'Curriculum', 'Other'].map(cat => (
                                                        <Tab 
                                                            key={cat} 
                                                            onClick={() => setSubTab(cat)} 
                                                            value={cat} 
                                                            className={`font-bold transition-colors text-[13px] ${subTab === cat ? 'text-black' : 'text-white'}`}
                                                        >
                                                            {cat === 'News and Events' ? 'News & Events' : cat === 'Other' ? 'Others' : cat === 'Report' ? 'Reports' : cat}
                                                        </Tab>
                                                    ))
                                                )}
                                            </TabsHeader>
                                        </Tabs>
                                    )}

                                    <Box sx={{ 
                                        backgroundColor: 'white', 
                                        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                                        borderRadius: activeTab === 'faculties' ? '8px' : '0 0 8px 8px',
                                        overflow: 'hidden',
                                        border: '1px solid #e0e0e0',
                                    }}>
                                        <DataGrid
                                            rows={rows}
                                            columns={columns}
                                            loading={loading}
                                            density="compact"
                                            autoHeight
                                            sx={getHeaderStyle()}
                                            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                                        />
                                    </Box>
                                </Box>
                            )}

                            {(activeTab === 'team' || activeTab === 'qaa') && (
                                <Box sx={{ p: 2, backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                                        <div className="relative w-full md:w-96">
                                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder={`Search ${activeTab}...`}
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-[#1169bf] focus:outline-none transition-all shadow-sm"
                                            />
                                        </div>
                                    </Box>
                                    <Box sx={{ 
                                        backgroundColor: 'white', 
                                        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <DataGrid
                                            rows={rows}
                                            columns={columns}
                                            loading={loading}
                                            density="compact"
                                            autoHeight
                                            sx={getHeaderStyle()}
                                            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                                        />
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                )}
            </Box>
        </Box>
    )
}

export default QAADashboard
