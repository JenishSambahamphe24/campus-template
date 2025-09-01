import React, { useState, useEffect } from 'react';
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import { Grid, Box, Typography, Button, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link, useNavigate } from 'react-router-dom';
import { getAllpublication, deletePublication } from './publicationApi';
import { extractDate } from '../../../../Components/utilityFunctions';
import AddIcon from '@mui/icons-material/Add';
import { showStatus } from '../../../../Components/utilityFunctions';
import CommonDeleteDialog from '../cms-team/components/CommonDeleteDialog';


function PublicationList() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('Publication');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [contentId, setContentId] = useState(0)
    const [allRows, setAllRows] = useState({});
    const [rows, setRows] = useState([]);

    const fetchPublicationRows = async () => {
        const allPublications = await getAllpublication();
        const filteredPublication = allPublications
            .sort((a, b) => b.id - a.id)
            .reduce((acc, item, index) => {
                const { categoryName } = item;

                const itemWithSNoAndDate = {
                    ...item,
                    sNo: (acc[categoryName]?.length || 0) + 1,
                    publishedAt: extractDate(item.publishedAt),
                    expiredAt: extractDate(item.expiredAt),
                    displayStatus: showStatus(item.displayStatus)
                };

                if (!acc[categoryName]) {
                    acc[categoryName] = [];
                }
                acc[categoryName].push(itemWithSNoAndDate);
                return acc;
            }, {});
        setAllRows(filteredPublication);
    };

    useEffect(() => {
        fetchPublicationRows();
    }, []);

    console.log(allRows)

    useEffect(() => {
        setRows(allRows[activeTab] || []);
    }, [activeTab, allRows]);

    const columns = [
        { field: 'sNo', headerName: 'S.No.', flex: .8 },
        {
            field: 'subCategoryName',
            headerName: 'Sub-category',
            flex: 2,
            renderCell: (params) => (
                <div className='flex h-full items-center'>
                    <h1 className='text-sm'>{params.value}</h1>
                </div>
            )
        },
        {
            field: 'title',
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
                    {params.value}
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
        {
            field: 'action',
            headerName: 'Action',
            flex: 1.5,
            renderCell: (params) => (
                <div className='flex h-full items-center justify-between'>
                    <Typography
                        fontSize='14px'
                        color='primary'
                        mt='7px'
                        onClick={() => navigate(`/admin/editPublication/${params.row.id}`)}
                    >
                        Edit
                    </Typography>
                    <Typography
                        fontSize='14px'
                        color='error'
                        mt='7px'
                        onClick={() => handleDeleteDialogOpen(params.row.id)}
                    >
                        Delete
                    </Typography>
                </div>
            )
        },
    ];

    const handleDeleteDialogOpen = (id) => {
        setContentId(id)
        setDeleteDialogOpen(true)
    }
    const handleClose = () => {
        setDeleteDialogOpen(false)
        fetchPublicationRows()
    }
    return (
        <Grid container className='px-20 pb-10' mx='auto'>
            <Typography mx='auto' variant='h4' >   List of contents </Typography>
            <Box width='100%'>
                <Box display='flex' justifyContent='flex-end' marginBottom='.5rem'>
                    <Link to='/admin/addCategory'>
                        <Button sx={{ textTransform: 'none' }} size='small' variant='outlined'>  <AddIcon /> Create a new category</Button>
                    </Link>
                    <Link to='/admin/addPublication'>
                        <Button variant='outlined' size='small' sx={{ textTransform: 'none', marginLeft: '15px' }}> <AddIcon /> Add new content</Button>
                    </Link>
                </Box>
                <Tabs value={activeTab} >
                    <TabsHeader className='rounded-b-none' style={{ backgroundColor: '#1169bf', zIndex: '1' }}>
                        <Tab onClick={() => setActiveTab('Report')} value='Report' style={{ color: activeTab === 'Report' ? 'black' : 'white' }}>
                            Reports
                        </Tab>
                        <Tab onClick={() => setActiveTab('Publication')} value='Publication' style={{ color: activeTab === 'Publication' ? 'black' : 'white' }}>
                            Publication
                        </Tab>
                        <Tab onClick={() => setActiveTab('News and Events')} value='News and Events' style={{ color: activeTab === 'News and Events' ? 'black' : 'white' }}>
                            News & Events
                        </Tab>
                        <Tab onClick={() => setActiveTab('Notices')} value='Notices' style={{ color: activeTab === 'Notices' ? 'black' : 'white' }}>
                            Notices
                        </Tab>
                        <Tab onClick={() => setActiveTab('Downloads')} value='Downloads' style={{ color: activeTab === 'Downloads' ? 'black' : 'white' }}>
                            Downloads
                        </Tab>
                        <Tab onClick={() => setActiveTab('Other')} value='Other' style={{ color: activeTab === 'Other' ? 'black' : 'white' }}>
                            Others
                        </Tab>
                        <Tab onClick={() => setActiveTab('Curriculum')} value='Curriculum' style={{ color: activeTab === 'Curriculum' ? 'black' : 'white' }}>
                            Curriculum
                        </Tab>
                    </TabsHeader>
                    <TabsBody className='bg-gray-100'>
                        <TabPanel key={activeTab} value={activeTab}>
                                <DataGrid
                                    rows={rows}
                                    columns={columns}
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
                                    sx={{
                                      
                                        '.MuiDataGrid-footerContainer': {
                                            minHeight: '20px'
                                        },
                                        '.MuiDataGrid-columnSeparator': {
                                            display: 'none',
                                        },
                                        '& .MuiDataGrid-row:hover': {
                                            cursor: 'pointer'
                                        },
                                        '& .MuiDataGrid-row': {
                                            maxHeight: 'none !important',
                                            height: 'auto'
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
                                        '& .MuiDataGrid-cell': {
                                            whiteSpace: 'normal',
                                            overflow: 'visible',
                                            height: 'auto',
                                            padding: '8px',
                                            alignItems: 'flex-start'
                                        },
                                        width: '100%',
                                        marginTop: '0'
                                    }}
                                />
                        </TabPanel>
                    </TabsBody>
                </Tabs>

            </Box>
            <Box>
                <CommonDeleteDialog
                    id={contentId}
                    open={deleteDialogOpen}
                    handleClose={handleClose}
                    deleteApi={deletePublication}
                    content='content'
                />
            </Box>
        </Grid>
    );
}

export default PublicationList;