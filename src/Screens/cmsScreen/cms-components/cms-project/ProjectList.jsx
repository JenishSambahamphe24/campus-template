import { useState, useEffect } from 'react'
import { Typography, Box } from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { getAllProjects, deleteProject } from './projectApi';
import { extractDate, showStatus } from '../../../../Components/utilityFunctions';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CommonDeleteDialog from '../cms-team/components/CommonDeleteDialog';


function ProjectList() {
    const [allProjects, setAllProjects] = useState([])
    const [projectId, setProjecId] = useState(0)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const navigate = useNavigate()

    const handleDeleteTeamDialogOpen = (id) => {
        setDeleteDialogOpen(true);
        setProjecId(id)
    };

    const handleClose = () => {
        setDeleteDialogOpen(false)
        fetchData()
    }

    const fetchData = async () => {
        try {
            const data = await getAllProjects()
            setAllProjects(data)
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    const columns = [
        { field: 'sNo', headerName: 'SNo', flex: .7 },
        {
            field: 'projectTitle',
            headerName: 'Project Title',
            flex: 4,
        },
        {
            field: 'projectCategory',
            headerName: 'Category',
            flex: 1.5,
        },
        {
            field: 'location',
            headerName: 'location',
            flex: 3,
        },
        {
            field: 'startDate',
            headerName: 'Start Date',
            flex: 1.2,
        },
        {
            field: 'endDate',
            headerName: 'End Date',
            flex: 1.2,
        },
        {
            field: 'duration',
            headerName: 'Duration',
            flex: 1,
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
        },
        {
            field: 'Action',
            flex: 2,
            renderHeader: () => {
                <div style={{ textAlign: 'center', fontWeight: '600' }}>
                    Action
                </div>
            },
            renderCell: (params) => (
                <Box display='flex' justifyContent='space-around' mt='3px' >
                    <Button
                        size='small'
                        color='primary'
                        sx={{ textTransform: 'none' }}
                        onClick={() => navigate(`/admin/editProject/${params.row.id}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        size='small'
                        color='error'
                        sx={{ textTransform: 'none' }}
                        onClick={() => handleDeleteTeamDialogOpen(params.row.id)}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        }
    ];

    const rows = allProjects?.sort((a, b) => b.id - a.id).map((project, index) => ({
        sNo: index + 1,
        id: project.id,
        projectTitle: project.title,
        projectCategory: project.projectCategory,
        location: project.location,
        startDate: extractDate(project.startDate),
        status: showStatus(project.status),
        endDate: extractDate(project.endDate),
        duration: project.duration
    }))

    return (
        <Grid container className='px-20 pb-10' mx='auto'>
            <Typography mx='auto' variant='h4' >   List of projects</Typography>
            <Box width='100%'>
                <Link to='/admin/addProject'>
                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', float: 'right', marginBottom: '10px' }}>
                        <AddIcon />
                        Add a new Project
                    </Button>
                </Link>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    density='compact'
                    pagination
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    disableColumnFilter={true}
                    disableColumnMenu={true}
                    disableColumnSelector={true}
                    disableColumnSorting={true}
                    disableDensitySelector={true}
                    columnHeaderHeight={70}
                    showCellVerticalBorder={true}
                    components={{
                        NoRowsOverlay: () => (
                            <GridOverlay>
                                <Typography variant='h5' align='center'>
                                    No rows
                                </Typography>
                            </GridOverlay>
                        ),
                    }}

                    sx={{
                        minHeight: '360px',
                        maxHeight: '464px',
                        '.MuiDataGrid-columnHeader': {
                            backgroundColor: '#0368b0',
                            color: 'white',
                            fontWeight: '40px',
                            borderRight: '1px solid white',

                        },

                        '.MuiDataGrid-footerContainer': {
                            minHeight: '45px',
                        },
                        '.MuiDataGrid-columnSeparator': {
                            display: 'none',
                        },
                        '& .MuiDataGrid-row:hover': {
                            cursor: 'pointer',
                        },
                        '& .MuiDataGrid-cell:focus-within': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-columnHeader': {
                            fontWeight: '600',
                            fontSize: '14px',
                        },
                        '& .MuiDataGrid-selectedRowCount': {
                            visibility: 'hidden',
                        },
                        width: '100%',
                        marginTop: '0',
                    }}
                />
                <Box>
                    <CommonDeleteDialog id={projectId} open={deleteDialogOpen} handleClose={handleClose} deleteApi={deleteProject} content='Project' />
                </Box>
            </Box>
        </Grid>
    )
}

export default ProjectList