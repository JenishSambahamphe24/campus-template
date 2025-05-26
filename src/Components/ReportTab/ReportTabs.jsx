import { useState, useEffect } from 'react';
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import { Grid, Box, Button, Typography, Divider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import { getAllpublication } from '../../Screens/cmsScreen/cms-components/cms-publication/publicationApi';
import { formatDate } from '../utilityFunctions';
import { Link } from 'react-router-dom';

const FILE_URL = import.meta.env.VITE_FILE_URL;

function ReportTabs() {
    const [allReports, setAllReports] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllpublication();
            const filteredData = data.filter(item => item.categoryName === 'Report');
            const uniqueSubCategories = Array.from(new Set(filteredData.map(item => item.subCategoryName)));
            if (uniqueSubCategories) {
                setSubCategories(uniqueSubCategories);
            } else {
                setSubCategories('')
            }

            const dataWithSno = filteredData.map((item, index) => ({
                ...item,
                sNo: index + 1
            }));
            if (dataWithSno) {
                setAllReports(dataWithSno)
            } else {
                setAllReports([])
            }
            setActiveTab(uniqueSubCategories[0]);
        };
        fetchData();
    }, []);

    const reportColumns = [
        { field: 'sNo', headerName: 'S.No.', flex: .4 },
        { field: 'fileName', headerName: 'File Name', flex: 4 },
        { field: 'publishedDate', headerName: 'Published Date', flex: 2.5 },
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
                <Box textAlign='center'>
                    <a className='text-blue-600 ' href={`${FILE_URL}content/${params.row.file}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <DownloadIcon fontSize="14px" />
                    </a>
                </Box>
            ),
        },
    ];

    const getCurrentRows = () => {
        return allReports
            .filter(item => item.subCategoryName === activeTab)
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .map((item, index) => ({
                sNo: index + 1,
                id: item.id,
                fileName: item.title,
                file: item.file,
                publishedDate: formatDate(item.publishedAt),
            }));
    };

    return (
        <Grid container rowGap='20px'>
            <Divider style={{ width: '100%', backgroundColor: '#c2c2c2' }} />
            <h1 className='text-2xl'>
                Reports
            </h1>
            <Grid item mx='auto' xs={12}>
                {
                    allReports.length > 0 ? (
                        <Tabs value={activeTab}>
                            <TabsHeader
                                style={{
                                    background: '#1169bf',
                                    color: 'white',
                                    zIndex: '1',
                                    height: '35px',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    gap: '10px',
                                }}
                                className="rounded-b-none"
                            >
                                {subCategories.map((subCategory, index) => (
                                    <Tab
                                        key={index}
                                        style={{
                                            color: activeTab === subCategory ? 'black' : 'white',
                                            padding: '0 16px',
                                            minWidth: 'auto',
                                            width: 'auto',
                                            textAlign: 'center',
                                            whiteSpace: 'nowrap',
                                        }}
                                        value={subCategory}
                                        onClick={() => setActiveTab(subCategory)}
                                    >
                                        <h1 className='xs:text-xs'>
                                            {subCategory}
                                        </h1>
                                    </Tab>
                                ))}
                            </TabsHeader>

                            <TabsBody className="bg-gray-100">
                                <TabPanel key={activeTab} value={activeTab}>
                                    <DataGrid
                                        rows={getCurrentRows()}
                                        columns={reportColumns}
                                        hideFooterPagination
                                        hideFooter
                                        density='compact'
                                        disableColumnFilter={true}
                                        disableAutosize={true}
                                        disableColumnMenu={true}
                                        disableColumnSelector={true}
                                        disableColumnSorting={true}
                                        disableDensitySelector={true}
                                        autosizeOnMount={true}
                                        columnHeaderHeight={40}
                                        rowHeight={30}
                                        showCellVerticalBorder={true}
                                        pagination
                                        initialState={{
                                            pagination: { paginationModel: { pageSize: 10 } },
                                        }}
                                        sx={{
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
                                                fontSize: '14px'
                                            },
                                            '& .MuiDataGrid-selectedRowCount': {
                                                visibility: 'hidden'
                                            },
                                            '.MuiDataGrid-columnHeader': {
                                                border: '1px solid #e0e0e0',
                                            },
                                            width: '100%',
                                            maxHeight: '158px',
                                            minHeight: '158px'
                                        }}
                                    />
                                </TabPanel>
                            </TabsBody>
                        </Tabs>
                    )
                        : (
                            <DataGrid
                                rows={[]}
                                columns={reportColumns}
                                hideFooterPagination
                                hideFooter
                                density='compact'
                                disableColumnFilter={true}
                                disableAutosize={true}
                                disableColumnMenu={true}
                                disableColumnSelector={true}
                                disableColumnSorting={true}
                                disableDensitySelector={true}
                                autosizeOnMount={true}
                                columnHeaderHeight={40}
                                rowHeight={30}
                                showCellVerticalBorder={true}
                                pagination
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 10 } },
                                }}
                                sx={{
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
                                        fontSize: '14px'
                                    },
                                    '& .MuiDataGrid-selectedRowCount': {
                                        visibility: 'hidden'
                                    },
                                    '.MuiDataGrid-columnHeader': {
                                        border: '1px solid #e0e0e0',
                                    },
                                    width: '100%',
                                    maxHeight: '158px',
                                    minHeight: '158px'
                                }}
                            />
                        )
                }
            </Grid>
            <div className='w-full flex justify-center'>
                <Button sx={{ textTransform: 'none' }} size="small" variant="outlined" className="flex items-center gap-2">
                    <Link to='/report'>
                        <Typography >
                            All reports
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

            </div>
        </Grid>
    );
}

export default ReportTabs;
