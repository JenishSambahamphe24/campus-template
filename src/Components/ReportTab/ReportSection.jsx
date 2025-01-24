import React, { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Typography, Button, Grid, Divider } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { Link } from 'react-router-dom';
import { getAllpublication } from '../../Screens/cmsScreen/cms-components/cms-publication/publicationApi';
const FILE_URL = import.meta.env.VITE_FILE_URL


function ReportSection() {
    const [reports, setReports] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllpublication();
            const filteredData = data.filter(item => item.categoryName === 'Report')
            setReports(filteredData)
        };
        fetchData()
    }, [])

    const reportColumns = [
        { field: 'sNo', headerName: 'S.No.', flex: .4 },
        { field: 'fileName', headerName: 'Title', flex: 3.5 },
        { field: 'subcategoryName', headerName: 'Type', flex: 1 },
        { field: 'publishedDate', headerName: 'Published Date', flex: .8 },
        {
            field: 'action',
            headerName: 'Action',
            flex: .6,
            renderHeader: () => (
                <div style={{ textAlign: 'center', fontWeight: '600' }}>
                    Download
                </div>
            ),
            renderCell: (params) => (
                <Box >
                    <a href={`${FILE_URL}${params.row.file}`} download target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <Button sx={{ textTransform: 'none', display: 'flex' }} size='small' variant="Link" className=" gap-1 ">
                            <DownloadIcon sx={{
                                fontSize: '16px',
                                color: '#0368B0',
                                '&:hover': {
                                    color: 'black',
                                    fontSize: '20px',
                                },
                                '&:active': {
                                    color: 'black',
                                },
                            }} />
                        </Button>
                    </a>
                </Box>
            ),
        },
    ];

    const reportRows = reports.slice(0, 6).map((item, index) => ({
        id: item.id,
        sNo: index + 1,
        fileName: item.title,
        file:item.file,
        publishedDate: item.createdDate,
        subcategoryName: item.subCategoryName

    }))
console.log(reports)
    return (
        <Grid item lg={12}>
            <Grid item xs={12} display='flex' justifyContent='space-between'>
                <Button
                    variant='contained'
                    size='small'
                    sx={{
                        bgcolor: '#0368b0',
                        ':hover': {
                            bgcolor: '#0368b0'
                        },
                        textTransform:'none'
                    }}
                    color='primary'
                >
                    <Typography>
                        Other Publications
                    </Typography>
                </Button>
                <Box  >
                    <Button size="small" variant="outlined" sx={{ textTransform: 'none' }} className="flex items-center gap-2">
                        <Link to='/report'>
                            <Typography >
                                View all
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
            <DataGrid
                rows={reportRows}
                columns={reportColumns}
                density='compact'
                disableColumnFilter={true}
                rowsPerPageOptions={[]}
                disableAutosize={true}
                disableColumnMenu={true}
                disableColumnSelector={true}
                disableColumnSorting={true}
                disableDensitySelector={true}
                autosizeOnMount={true}
                columnHeaderHeight={70}
                hideFooterPagination={true}
                showCellVerticalBorder={true}
                sx={{
                    minHeight: '230px',
                    '.MuiDataGrid-columnSeparator': {
                        display: 'none',
                    },
                    '.MuiDataGrid-footerContainer': {
                        minHeight: '35px',
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
                        fontSize: '14px',
                    },
                    '.MuiDataGrid-columnHeader': {
                        backgroundColor: '#0368b0',
                        color: 'white',
                        fontWeight: '40px',
                        borderRight: '1px solid white',
                    },

                    '& .MuiDataGrid-selectedRowCount': {
                        visibility: 'hidden'
                    },
                    width: '100%',
                    marginTop: '0'
                }}
            />
        </Grid>
    )
}

export default ReportSection