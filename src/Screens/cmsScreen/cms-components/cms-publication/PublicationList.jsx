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
                    createdAt: extractDate(item.createdAt),
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

    useEffect(() => {
        setRows(allRows[activeTab] || []);
    }, [activeTab, allRows]);

    const columns = [

        { field: 'sNo', headerName: 'S.No.', flex: 1 },
        { field: 'subCategoryName', headerName: 'Sub-category', flex: 2 },
        {
            field: 'title',
            headerName: 'Publication Title',
            flex: 6,
            renderCell: (params) => (
                <Box
                    sx={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        display: 'block',
                    }}
                >
                    <Tooltip arrow title={params.value}>
                        <Typography fontSize='14px' noWrap>{params.value}</Typography>
                    </Tooltip>
                </Box>
            ),
        },
        { field: 'displayStatus', headerName: 'Status', flex: 1.2 },
        { field: 'createdAt', headerName: 'Pub date', flex: 1.5 },
        { field: 'expiredAt', headerName: 'Exp date', flex: 1.5 },
        {
            field: 'action',
            headerName: 'Action',
            flex: 1.5,
            renderCell: (params) => (
                <Box display='flex' justifyContent='space-around' >
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
                </Box>
            ),
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
            <Typography mx='auto' variant='h4' >   List of Publications</Typography>
            <Box width='100%'>
                <Box display='flex' justifyContent='flex-end' marginBottom='.5rem'>
                    <Link to='/admin/addCategory'>
                        <Button sx={{ textTransform: 'none' }} size='small' variant='outlined'>  <AddIcon /> Create a new category</Button>
                    </Link>
                    <Link to='/admin/addPublication'>
                        <Button variant='outlined' size='small' sx={{ textTransform: 'none', marginLeft: '15px' }}> <AddIcon /> Add new Publication</Button>
                    </Link>
                </Box>
                <Tabs value={activeTab} >
                    <TabsHeader className='rounded-b-none' style={{ backgroundColor: '#0368B0', zIndex: '1' }}>
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
                        <Tab onClick={() => setActiveTab('Application')} value='Application' style={{ color: activeTab === 'Application' ? 'black' : 'white' }}>
                            Application
                        </Tab>
                        <Tab onClick={() => setActiveTab('Other')} value='Other' style={{ color: activeTab === 'Other' ? 'black' : 'white' }}>
                            Others
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
                                autosizeOnMount={true}
                                columnHeaderHeight={70}
                                showCellVerticalBorder={true}
                                pagination
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 10 } },
                                }}
                                sx={{
                                    minHeight: '300px',
                                    maxHeight: '464px',
                                    '.MuiDataGrid-footerContainer': {
                                        minHeight: '45px'
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
                                    '.MuiDataGrid-columnHeader': {
                                        border: '1px solid #e0e0e0',
                                    },
                                    '& .grid-header .MuiDataGrid-colCellTitle': {
                                        fontWeight: 'bold'
                                    },
                                    '& .MuiDataGrid-columnHeaderTitle': {
                                        fontWeight: '600',
                                        fontSize: '14px'
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
