import { useState, useEffect } from 'react'
import { Typography, Box } from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { getAllTestimonials, deleteTestimonial } from './testimonialsApi';
import { extractDate, showStatus } from '../../../../../Components/utilityFunctions';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CommonDeleteDialog from '../../cms-team/components/CommonDeleteDialog';


function TestimonialsList() {
    const [allTestimonials, setAllTestimonials] = useState([])
    const [testimonialId, setTestimonialId] = useState(0)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const navigate = useNavigate()

    const handleDeleteTeamDialogOpen = (id) => {
        setDeleteDialogOpen(true);
        setTestimonialId(id)
    };

    const handleClose = () => {
        setDeleteDialogOpen(false)
        fetchData()
    }

    const fetchData = async () => {
        try {
            const data = await getAllTestimonials()
            setAllTestimonials(data)
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])

    const columns = [
        { field: 'sNo', headerName: 'SNo', flex: .5 },
        {
            field: 'studentName',
            headerName: 'Student Name',
            flex: 1,
        },
        {
            field: 'program',
            headerName: 'Program',
            flex: 1,
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: .8,
        },
        {
          field: 'testimonials',
          headerName: 'Testimonials',
          flex: 4,
      },
        {
            field: 'Action',
            flex: 1.5,
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
                        onClick={() => navigate(`/admin/editTestimonial/${params.row.id}`)}
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

    const rows = allTestimonials?.sort((a, b) => b.id - a.id).map((item, index) => ({
        sNo: index + 1,
        id: item.id,
        studentName: item.studentName,
        program: item.studentsFaculty,
        testimonials: item.testimonials,
        status: showStatus(item.status)
    }))

    return (
        <Grid container className='px-20 pb-10' mx='auto'>
            <Typography mx='auto' variant='h4'>List of Testimonials</Typography>
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
                    <CommonDeleteDialog id={testimonialId} open={deleteDialogOpen} handleClose={handleClose} deleteApi={deleteTestimonial} content='Project' />
                </Box>
            </Box>
        </Grid>
    )
}

export default TestimonialsList