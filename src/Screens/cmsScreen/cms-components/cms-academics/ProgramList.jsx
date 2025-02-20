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
import {  deletePublication } from '../cms-publication/publicationApi';
import AddIcon from '@mui/icons-material/Add';
import CommonDeleteDialog from '../cms-team/components/CommonDeleteDialog';
import { deleteProgram, getAllPrograms } from './academicsApi';
import { extractDate, showStatus } from '../../../../Components/utilityFunctions';


function ProgramList() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('Bachelor');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [contentId, setContentId] = useState(0)
    const [allRows, setAllRows] = useState({});

    const [rows, setRows] = useState([]);

    const fetchPrograms = async () => {
        const allPrograms = await getAllPrograms();
        if (allPrograms) {
            const structuredPrograms = allPrograms.reduce((acc, program) => {
                const level = program.level;
                if (!acc[level]) acc[level] = [];
                const modifiedProgram = {
                    ...program,
                    runningFrom: extractDate(program.runningFrom) ,
                    status: showStatus(program.status) 
                };
    
                acc[level].push(modifiedProgram); 
                return acc;
            }, {});
            setAllRows(structuredPrograms);
        } else {
            setAllRows({});
        }
    };
 
    useEffect(() => {
        fetchPrograms();
    }, []);

    useEffect(() => {
        setRows(allRows[activeTab] || []);
    }, [activeTab, allRows]);

    const columns = [

        { field: 'programName', headerName: 'Program Name', flex: 3 },
        { field: 'facultyName', headerName: 'Faculty Name', flex: 2 },
        { field: 'status', headerName: 'Status', flex: 1.2 },
        { field: 'runningFrom', headerName: 'Running From', flex: 1.5 },
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
                        onClick={() => navigate(`/admin/editProgram/${params.row.id}`)}
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
        fetchPrograms()
    }
    return (
        <Grid container className='px-20 pb-10' mx='auto'>
            <Typography mx='auto' variant='h4' >   List of Programs</Typography>
            <Box width='100%'>
                <Box display='flex' justifyContent='flex-end' marginBottom='.5rem'>
                    <Link to='/admin/addFaculty'>
                        <Button sx={{ textTransform: 'none' }} size='small' variant='outlined'>  <AddIcon /> Create a new Faculty</Button>
                    </Link>
                    <Link to='/admin/addProgram'>
                        <Button variant='outlined' size='small' sx={{ textTransform: 'none', marginLeft: '15px' }}> <AddIcon /> Add new Program</Button>
                    </Link>
                </Box>
                <Tabs value={activeTab} >
                    <TabsHeader className='rounded-b-none' style={{ backgroundColor: '#1169bf', zIndex: '1' }}>
                        <Tab onClick={() => setActiveTab('Bachelor')} value='Bachelor' style={{ color: activeTab === 'Bachelor' ? 'black' : 'white' }}>
                            Bachelor
                        </Tab>
                      
                        <Tab onClick={() => setActiveTab('Master')} value='Master' style={{ color: activeTab === 'Master' ? 'black' : 'white' }}>
                            Masters
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
                    deleteApi={deleteProgram}
                    content='content'
                />
            </Box>
        </Grid>
    );
}

export default ProgramList;
