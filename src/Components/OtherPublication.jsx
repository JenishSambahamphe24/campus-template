import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import { Box, Typography, Button, Grid, Divider } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { Link } from 'react-router-dom';
import { getAllpublication } from '../Screens/cmsScreen/cms-components/cms-publication/publicationApi';
import { extractDate } from './utilityFunctions';
const FILE_URL = import.meta.env.VITE_FILE_URL


function OtherPublication() {
    const [publications, setPublications] = useState([])
    const [category, setCategory] = useState([])
    const [activeTab, setActiveTab] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllpublication();
            const filteredData = data.filter(item => item.categoryName === 'Other')
            const uniqueCategories = Array.from(new Set(filteredData.map(item => item.subCategoryName)))
            setCategory(uniqueCategories)
            const dataWithSno = filteredData.map((item, index) => ({
                ...item,
                sNo: index + 1
            }))
            setPublications(dataWithSno)
            setActiveTab(uniqueCategories[0])
        };
        fetchData()
    }, [])

    console.log(activeTab)

    const reportColumns = [
        { field: 'sNo', headerName: 'S.No.', flex: 0.6 },
        { field: 'fileName', headerName: 'Title', flex: 5 },
        { field: 'subcategory', headerName: 'Type', flex: 1.5 },
        { field: 'publishedDate', headerName: 'Published Date', flex: 1.2 },
        { field: 'expiredAt', headerName: 'Expired At', flex: 1 },

        {
            field: 'action',
            headerName: 'Action',
            flex: 1.5,
            renderHeader: () => (
                <div style={{ textAlign: 'center', fontWeight: '600' }}>
                    Action
                </div>
            ),
            renderCell: (params) => (
                <Box>
                    <a href={`${FILE_URL}${params.row.file}`} download target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <Button sx={{ textTransform: 'none', display: 'flex' }} size="small" variant="Link" className="gap-1">
                            Download file
                            <DownloadIcon fontSize="14px" />
                        </Button>
                    </a>
                </Box>
            ),
        },
    ];

    const getCurrentRows = () => {
        return publications.filter(item => item.subCategoryName === activeTab).slice(0, 6).map((item, index) => ({
            sNo: index + 1,
            id: index + 1,
            fileName: item.title,
            subcategory: item.subCategoryName,
            file: item.file,
            publishedDate: extractDate(item.publishedAt),
            expiredAt: extractDate(item.expiredAt)

        }))
    }

    return (
        <Grid container>
            <Grid item xs={12} display='flex' justifyContent='space-between'>
                <Button
                    variant='contained'
                    size='small'
                    sx={{
                        bgcolor: '#0368b0',
                        ':hover': {
                            bgcolor: '#0368b0'
                        }
                    }}
                    color='primary'
                >
                    <Typography>
                        Others
                    </Typography>
                </Button>
                <Box  >
                    <Button size="small" variant="outlined" sx={{ textTransform: 'none' }} className="flex items-center gap-2">
                        <Link to='/other'>
                            <Typography >
                                Other reports
                            </Typography>
                        </Link>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-4 w-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                            />
                        </svg>
                    </Button>
                </Box>
            </Grid>
            <Divider style={{ width: '100%', marginTop: '7px', backgroundColor: '#c2c2c2', marginBottom: '10px' }} />
            <Grid item lg={12}>
                {
                    publications.length > 0 && (
                        <Tabs value={activeTab}>
                            <TabsHeader style={{ background: '#0368b0', color: 'white', zIndex: '1' }} className="rounded">
                                {
                                    category.map((category, index) => (
                                        <Tab key={index}
                                            style={activeTab === category ? { color: 'black' } : { color: 'white' }}
                                            value={category}
                                            onClick={() => setActiveTab(category)}
                                        >
                                            {category}
                                        </Tab>

                                    ))}
                            </TabsHeader>
                            <TabsBody className="bg-gray-100">
                                <TabPanel key={activeTab} value={activeTab}>
                                    <DataGrid
                                        rows={getCurrentRows()}
                                        columns={reportColumns}
                                        density='compact'
                                        disableColumnFilter={true}
                                        disableAutosize={true}
                                        disableColumnMenu={true}
                                        disableColumnSelector={true}
                                        disableColumnSorting={true}
                                        disableDensitySelector={true}
                                        autosizeOnMount={true}
                                        columnHeaderHeight={70}
                                        showCellVerticalBorder={true}
                                        hideFooterPagination
                                        sx={{
                                            '.MuiDataGrid-footerContainer': {
                                                minHeight: '25px'
                                            },
                                            '.MuiDataGrid-columnSeparator': {
                                                display: 'none',
                                            },
                                            '& .MuiDataGrid-row:hover': {
                                                cursor: 'pointer'
                                            },
                                            '& .MuiDataGrid-cell:focus-within': {
                                                outline: 'none'
                                            },
                                            '& .grid-header .MuiDataGrid-colCellTitle': {
                                                fontWeight: 'bold'
                                            },
                                            '& .MuiDataGrid-columnHeaderTitle ': {
                                                fontWeight: '600',
                                                fontSize: '13px',
                                            },
                                            '.MuiDataGrid-columnHeader': {
                                                border: '1px solid #e0e0e0',
                                            },
                                            '& .MuiDataGrid-selectedRowCount': {
                                                visibility: 'hidden'
                                            },
                                            width: '100%',
                                            marginTop: '0'
                                        }}
                                    />
                                </TabPanel>

                            </TabsBody>
                        </Tabs>
                    )
                }
            </Grid>

        </Grid >
    )
}

export default OtherPublication