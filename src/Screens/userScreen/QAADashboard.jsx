import { useState, useEffect, useMemo, useCallback } from 'react'
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
    TabPanel,
} from "@material-tailwind/react"
import { Grid, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { extractDate, showStatus } from '../../Components/utilityFunctions'

import adminImage from '../../../public/admin1.png'
import OurTeam from './about-us/OurTeam'

const BASE_URL = import.meta.env.VITE_API_URL;
const collegeName = import.meta.env.VITE_COLLEGE_NAME;

const stripHtml = (html) => {
    if (!html) return '';
    let clean = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    clean = clean.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    clean = clean.replace(/<[^>]*>/g, '');
    clean = clean
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'");
    return clean.trim();
};

const formatDescription = (desc) => {
    const clean = stripHtml(desc);
    if (clean.length > 100) {
        return clean.substring(0, 100) + '.....';
    }
    return clean;
};

function QAADashboard() {
    const { token, userName } = useAuth()
    const { tab: activeTab } = useParams()
    const navigate = useNavigate()
    const [subTab, setSubTab] = useState(() => {
        if (activeTab === 'programs') return 'Bachelor'
        if (activeTab === 'publications') return 'Publication'
        if (activeTab === 'faculties') return 'All'
        if (activeTab === 'qaa') return 'All'
        return ''
    })
    const [allRows, setAllRows] = useState({})
    const [programsAll, setProgramsAll] = useState([])
    const [rows, setRows] = useState([])
    const [qaaCategories, setQaaCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    // Reset subTab when activeTab changes
    useEffect(() => {
        if (activeTab === 'programs') setSubTab('Bachelor')
        else if (activeTab === 'publications') setSubTab('Publication')
        else if (activeTab === 'faculties') setSubTab('All')
        else if (activeTab === 'qaa') setSubTab('All')
        else setSubTab('')
        
        // Clear data when switching tabs
        setRows([])
        setAllRows({})
        setSearchQuery('')
        
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
                
                // Organize QAA documents by category ID (for tab filtering)
                const categorizedQAA = result.reduce((acc, item, index) => {
                    const catKey = String(item.categoryId) || 'null';
                    const itemWithSNo = {
                        ...item,
                        sno: (acc[catKey]?.length || 0) + 1,
                        uploadDate: extractDate(item.uploadDate)
                    };
                    if (!acc[catKey]) {
                        acc[catKey] = [];
                    }
                    acc[catKey].push(itemWithSNo);
                    return acc;
                }, {});
                
                setAllRows(categorizedQAA);

                try {
                    const catResponse = await axios.get(`${BASE_URL}/qaaCategories`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    setQaaCategories(Array.isArray(catResponse.data) ? catResponse.data : [])
                } catch (catError) {
                    console.error('Error fetching QAA categories:', catError)
                }
            } else if (tab === 'faculties') {
                result = await getAllFaculties()
                setRows(Array.isArray(result) ? result.map((item, index) => ({ 
                    ...item, 
                    id: item.id || index,
                    sno: index + 1 
                })) : [])
            } else if (tab === 'programs') {
                result = await getAllPrograms()
                const programRows = Array.isArray(result) ? result.map((item, index) => ({ 
                    ...item, 
                    id: item.id || index,
                    sno: index + 1,
                    runningFrom: item.runningFrom ? item.runningFrom.split('T')[0] : item.runningFrom
                })) : []
                setProgramsAll(programRows)
                setRows(programRows.filter(item => !subTab || subTab === 'All' ? true : item.level === subTab))
            } else if (tab === 'publications') {
                result = await getAllpublication()
                const filteredPublication = result
                    .sort((a, b) => b.id - a.id)
                    .reduce((acc, item, index) => {
                        const { categoryName } = item;
                        const itemWithSNoAndDate = {
                            ...item,
                            sno: (acc[categoryName]?.length || 0) + 1,
                            publishedAt: extractDate(item.publishedAt),
                            expiredAt: extractDate(item.expiredAt),
                            displayStatus: showStatus(item.displayStatus),
                            category: item.subCategoryName,
                            publicationTitle: item.title,
                            status: item.displayStatus
                        };
                        if (!acc[categoryName]) {
                            acc[categoryName] = [];
                        }
                        acc[categoryName].push(itemWithSNoAndDate);
                        return acc;
                    }, {});
                setAllRows(filteredPublication);
            } else if (tab === 'team') {
                result = await getAllTeams()
                setRows(Array.isArray(result) ? result : [])
            }
        } catch (error) {
            console.error(`Error fetching ${tab}:`, error)
            toast.error(`Failed to load ${tab}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (activeTab === 'programs') {
            setRows(programsAll.filter(item => !subTab || subTab === 'All' ? true : item.level === subTab));
        } else if (activeTab === 'publications' || activeTab === 'qaa') {
            // For category-based data, filter by subTab
            if (subTab === 'All') {
                // Flatten all categories
                const allData = Object.values(allRows).flat();
                setRows(allData);
            } else {
                setRows(allRows[subTab] || []);
            }
        }
    }, [subTab, allRows, activeTab, programsAll]);

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

    const filteredRows = useMemo(() => {
        if (!rows || !Array.isArray(rows)) return []
        
        let filtered = rows;
        
        // Apply search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            filtered = filtered.filter(item => 
                Object.values(item || {}).some(val => String(val).toLowerCase().includes(q))
            )
        }

        return filtered;
    }, [rows, searchQuery])

    const getHeaderStyle = () => ({
        '.MuiDataGrid-columnHeader': {
            backgroundColor: '#1169bf',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            borderRight: '1px solid #f0f0f033',
            borderBottom: '1px solid #e0e0e0',
        },
        '.MuiDataGrid-footerContainer': { 
            minHeight: '20px',
            borderTop: '1px solid #e0e0e0' 
        },
        '.MuiDataGrid-columnSeparator': { display: 'none' },
        '& .MuiDataGrid-row:hover': { cursor: 'pointer', backgroundColor: '#f9fafb' },
        '& .MuiDataGrid-cell:focus-within': { outline: 'none' },
        '.MuiDataGrid-columnHeaderTitle': { 
            fontWeight: '600',
            fontSize: '14px',
            color: 'white'
        },
        '& .MuiDataGrid-cell': {
            whiteSpace: 'normal',
            overflow: 'visible',
            height: 'auto',
            padding: '8px',
            alignItems: 'flex-start',
            fontSize: '14px',
            color: '#444'
        },
        '& .MuiDataGrid-row': {
            maxHeight: 'none !important',
            height: 'auto'
        },
        '& .MuiDataGrid-selectedRowCount': {
            visibility: 'hidden'
        },
        width: '100%',
        minHeight: '400px',
        backgroundColor: 'white'
    })

    const columns = useMemo(() => {
        if (activeTab === 'faculties') {
            return [
                { field: 'sno', headerName: 'S.No.', flex: 0.8 },
                { 
                    field: 'facultyName', 
                    headerName: 'Faculty Name', 
                    flex: 1.5,
                    renderCell: (params) => (
                        <div className='flex h-full items-center'>
                            <h1 className='text-sm'>{params.value}</h1>
                        </div>
                    )
                },
                { 
                    field: 'level', 
                    headerName: 'Level', 
                    flex: 1,
                    renderCell: (params) => (
                        <div className='flex h-full items-center'>
                            <h1 className='text-sm'>{params.value}</h1>
                        </div>
                    )
                },
            ]
        }
        if (activeTab === 'programs') {
            return [
                { field: 'sno', headerName: 'S.No.', flex: 0.8 },
                { 
                    field: 'programName', 
                    headerName: 'Program Name', 
                    flex: 2.5,
                    renderCell: (params) => (
                        <div style={{
                            whiteSpace: 'normal',
                            lineHeight: 'normal',
                            wordBreak: 'break-word',
                            width: '100%',
                            paddingTop: '8px',
                            paddingBottom: '8px'
                        }}>
                            <span className='text-sm'>{params.value}</span>
                        </div>
                    )
                },
                { 
                    field: 'facultyName', 
                    headerName: 'Faculty Name', 
                    flex: 2,
                    renderCell: (params) => (
                        <div className='flex h-full items-center'>
                            <span className='text-sm'>{params.value}</span>
                        </div>
                    )
                },
                { 
                    field: 'status', 
                    headerName: 'Status', 
                    flex: 1, 
                    renderCell: (params) => (
                        <div className='flex h-full items-center'>
                            <span className='text-sm'>{params.value ? 'Active' : 'Inactive'}</span>
                        </div>
                    )
                },
                { 
                    field: 'runningFrom', 
                    headerName: 'Running From', 
                    flex: 1.5,
                    renderCell: (params) => (
                        <div className='flex h-full items-center'>
                            <span className='text-sm'>{params.value}</span>
                        </div>
                    )
                },
            ]
        }
        if (activeTab === 'publications') {
            return [
                { field: 'sno', headerName: 'S.No.', flex: 0.8 },
                { 
                    field: 'category', 
                    headerName: 'Sub-category', 
                    flex: 2,
                    renderCell: (params) => (
                        <div className='flex h-full items-center'>
                            <h1 className='text-sm'>{params.value}</h1>
                        </div>
                    )
                },
                { 
                    field: 'publicationTitle', 
                    headerName: 'Publication Title', 
                    flex: 6,
                    renderCell: (params) => (
                        <div style={{
                            whiteSpace: 'normal',
                            lineHeight: 'normal',
                            wordBreak: 'break-word',
                            width: '100%',
                            paddingTop: '8px',
                            paddingBottom: '8px'
                        }}>
                            {params.row.isFile && params.row.file ? (
                                <a 
                                    href={`${BASE_URL}/uploads/content/${params.row.file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[#1169bf] hover:underline font-semibold"
                                >
                                    {params.value}
                                </a>
                            ) : (
                                <span className="font-semibold">{params.value}</span>
                            )}
                        </div>
                    )
                },
                { 
                    field: 'displayStatus', 
                    headerName: 'Status', 
                    flex: 1.2,
                    renderCell: (params) => (
                        <div className='flex h-full items-center'>
                            <h1 className='text-sm'>{params.value}</h1>
                        </div>
                    )
                },
                { 
                    field: 'publishedAt', 
                    headerName: 'Pub date', 
                    flex: 1.5,
                    renderCell: (params) => (
                        <div className='flex h-full items-center'>
                            <h1 className='text-sm'>{params.value}</h1>
                        </div>
                    )
                },
                { 
                    field: 'expiredAt', 
                    headerName: 'Exp date', 
                    flex: 1.5,
                    renderCell: (params) => (
                        <div className='flex h-full items-center'>
                            <h1 className='text-sm'>{params.value}</h1>
                        </div>
                    )
                },
            ]
        }
        if (activeTab === 'team') {
            return [
                { field: 'sno', headerName: 'S.No.', flex: 0.8 },
                { 
                    field: 'fullName', 
                    headerName: 'Full Name', 
                    flex: 2, 
                    valueGetter: (params, row) => `${row.firstName || ''} ${row.lastName || ''}` 
                },
                { field: 'index', headerName: 'Index', flex: 1 },
                { field: 'subCategory', headerName: 'Position', flex: 1.5 },
                { field: 'email', headerName: 'Email', flex: 2 },
                { field: 'phoneNo', headerName: 'Contact Number', flex: 1.5 },
                { 
                    field: 'status', 
                    headerName: 'Status', 
                    flex: 1, 
                    renderCell: (params) => (
                        <div className='flex h-full items-center'>
                            <span className='text-sm'>{params.value ? 'Active' : 'Inactive'}</span>
                        </div>
                    )
                },
            ]
        }
        if (activeTab === 'qaa') {
            return [
                { field: 'sno', headerName: 'S.No.', flex: 0.8 },
                { 
                    field: 'title', 
                    headerName: 'Document Title', 
                    flex: 3,
                    renderCell: (params) => (
                        <div style={{
                            whiteSpace: 'normal',
                            lineHeight: 'normal',
                            wordBreak: 'break-word',
                            width: '100%',
                            paddingTop: '8px',
                            paddingBottom: '8px'
                        }}>
                            <a 
                                href={`${BASE_URL}/uploads/qaa/${params.row.filePath}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:text-[#1169bf] hover:underline font-semibold"
                            >
                                {params.value}
                            </a>
                        </div>
                    )
                },
                { 
                    field: 'description', 
                    headerName: 'Description', 
                    flex: 4,
                    renderCell: (params) => (
                        <div style={{
                            whiteSpace: 'normal',
                            lineHeight: 'normal',
                            wordBreak: 'break-word',
                            width: '100%',
                            paddingTop: '8px',
                            paddingBottom: '8px'
                        }}>
                            {formatDescription(params.value)}
                        </div>
                    )
                },
                { 
                    field: 'uploadDate', 
                    headerName: 'Upload Date', 
                    flex: 1.5,
                    renderCell: (params) => (
                        <div className='flex h-full items-center'>
                            <h1 className='text-sm'>{params.value}</h1>
                        </div>
                    )
                },
                {
                    field: 'download',
                    headerName: 'Download',
                    flex: 1,
                    renderCell: (params) => (
                        <div className='flex h-full items-center justify-center'>
                            <a href={`${BASE_URL}/uploads/qaa/${params.row.filePath}`} target="_blank" rel="noreferrer">
                                <FaDownload className="text-[#1169bf] cursor-pointer hover:text-blue-700" size={16} />
                            </a>
                        </div>
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
        (activeTab === 'publications' && ['Report', 'Publication', 'News and Events', 'Notices', 'Downloads', 'Thesis', 'Research', 'Curriculum', 'Other'].includes(subTab)) ||
        (activeTab === 'qaa');

    // Handle tab change with useCallback to prevent unnecessary re-renders
    const handleTabChange = useCallback((value) => {
        setSubTab(value);
    }, []);

    // Render search bar
    const renderSearchBar = () => {
        const showSearch = activeTab === 'qaa' || activeTab === 'team';
        if (!showSearch) return null;

        return (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'qaa' ? 'QAA Documents' : activeTab}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:border-[#1169bf] focus:outline-none transition-all shadow-sm"
                    />
                </div>
            </Box>
        );
    };

    // Render level selector for faculties
    const renderLevelSelector = () => {
        if (activeTab !== 'faculties') return null;

        return (
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
        );
    };

    // Important: Add key prop to force re-render when activeTab changes
    const tabKey = `${activeTab}-${subTab}`;

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
                        {activeTab !== 'team' && (
                            <Typography sx={{ mx: 'auto', mb: 2, fontWeight: '400', fontSize: '32px', color: '#000' }}>
                                List of {activeTab === 'publications' ? 'contents' : activeTab === 'qaa' ? 'QAA Documents' : activeTab === 'programs' ? 'Programs' : activeTab === 'faculties' ? 'Faculties' : activeTab}
                            </Typography>
                        )}

                        <Box sx={{ width: '100%' }}>
                            {activeTab === 'team' ? (
                                <OurTeam />
                            ) : isSubTabValid ? (
                                <Box className='bg-gray-100' key={tabKey}>
                                    {renderLevelSelector()}
                                    
                                    <Tabs value={subTab}>
                                        <TabsHeader className='rounded-b-none' style={{ backgroundColor: '#1169bf', zIndex: '1' }}>
                                            {activeTab === 'qaa' ? (
                                                <>
                                                    <Tab onClick={() => handleTabChange('All')} value="All" style={{ color: subTab === 'All' ? 'black' : 'white' }}>
                                                        All Documents
                                                    </Tab>
                                                    {qaaCategories.map(cat => (
                                                        <Tab 
                                                            key={cat.id} 
                                                            onClick={() => handleTabChange(String(cat.id))} 
                                                            value={String(cat.id)}
                                                            style={{ color: subTab === String(cat.id) ? 'black' : 'white' }}
                                                        >
                                                            {cat.name}
                                                        </Tab>
                                                    ))}
                                                </>
                                            ) : activeTab === 'programs' ? (
                                                <>
                                                    <Tab onClick={() => handleTabChange('Bachelor')} value="Bachelor" style={{ color: subTab === 'Bachelor' ? 'black' : 'white' }}>
                                                        Bachelor
                                                    </Tab>
                                                    <Tab onClick={() => handleTabChange('Master')} value="Master" style={{ color: subTab === 'Master' ? 'black' : 'white' }}>
                                                        Masters
                                                    </Tab>
                                                </>
                                            ) : (
                                                ['Report', 'Publication', 'News and Events', 'Notices', 'Downloads', 'Thesis', 'Research', 'Curriculum', 'Other'].map(cat => (
                                                    <Tab 
                                                        key={cat} 
                                                        onClick={() => handleTabChange(cat)} 
                                                        value={cat}
                                                        style={{ color: subTab === cat ? 'black' : 'white' }}
                                                    >
                                                        {cat === 'News and Events' ? 'News & Events' : cat === 'Other' ? 'Others' : cat === 'Report' ? 'Reports' : cat}
                                                    </Tab>
                                                ))
                                            )}
                                        </TabsHeader>
                                        <TabsBody className='bg-gray-100'>
                                            <TabPanel key={subTab} value={subTab}>
                                                {renderSearchBar()}
                                                <DataGrid
                                                    rows={filteredRows}
                                                    columns={columns}
                                                    loading={loading}
                                                    density='compact'
                                                    disableColumnFilter={true}
                                                    disableAutosize={true}
                                                    disableColumnMenu={true}
                                                    disableColumnSelector={true}
                                                    disableColumnSorting={true}
                                                    disableDensitySelector={true}
                                                    autoHeight={true}
                                                    rowHeight="auto"
                                                    getRowHeight={() => 'auto'}
                                                    columnHeaderHeight={70}
                                                    showCellVerticalBorder={true}
                                                    pagination
                                                    initialState={{
                                                        pagination: { paginationModel: { pageSize: 10 } },
                                                    }}
                                                    sx={getHeaderStyle()}
                                                />
                                            </TabPanel>
                                        </TabsBody>
                                    </Tabs>
                                </Box>
                            ) : (
                                <Box sx={{ p: 2, backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                                    {renderLevelSelector()}
                                    {renderSearchBar()}
                                    <Box sx={{ 
                                        backgroundColor: 'white', 
                                        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <DataGrid
                                            rows={filteredRows}
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