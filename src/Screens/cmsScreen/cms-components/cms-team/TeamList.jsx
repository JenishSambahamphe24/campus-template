import React, { useState, useEffect } from 'react'
import { Typography,  Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { getAllTeams, getAllUsers } from './teamApi';
import { GridOverlay } from '@mui/x-data-grid';
import AdminRoleDialog from './components/AdminRoleDialog';
import RemoveRole from './components/RemoveRole';
import { useAuth } from '../../../../context/AuthContextProvider';
import { showStatus } from '../../../../Components/utilityFunctions';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteDialog from './components/DeleteDialog';


function TeamList() {
    const [allTeams, setAllTeams] = useState([])
    const [teamWithRole, setTeamWithRole] = useState([])
    const [teamId, setTeamId] = useState(0)
    const { role } = useAuth()
    const navigate = useNavigate()

    const [makeAdminDialogOpen, setMakeAdminDialogOpen] = useState(false)
    const [removeAdminDialogOpen, setRemoveAdminDialogOpen] = useState(false)

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const handleMakeAdminDialogOpen = (id) => {
        setTeamId(id)
        setMakeAdminDialogOpen(true);
    };
    const handleRemoveAdminDialogOpen = (id) => {
        setTeamId(id)
        setRemoveAdminDialogOpen(true);
    };

    const handleDeleteTeamDialogOpen = (id) => {
        setTeamId(id)
        setDeleteDialogOpen(true);
    };

    const handleDeleteTeamDialogClose = () => {
        setDeleteDialogOpen(false);
        fetchData()
    };

    const handleMakeAdminDialogClose = async () => {
        setMakeAdminDialogOpen(false);

    };
    const handleRemoveAdminDialogClose = async () => {
        setRemoveAdminDialogOpen(false);
    };
    
    const fetchData = async () => {
        try {
            const data = await getAllTeams()
            const addedData = data.map((item, index) => ({
                ...item,
                sNo: index + 1
            }))
            setAllTeams(addedData)
        }
        catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    useEffect(() => {
        fetchData(allTeams)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllUsers()
                setTeamWithRole(data)
            }
            catch (error) {
                console.error('Error fetching teams:', error);
            }
        };
        fetchData()
    }, [])

    const columns = [
        { field: 'sNo', headerName: 'SNo', flex: .7 },
        {
            field: 'fullName',
            headerName: 'Full Name',
            flex: 2.5,
        },
        {
            field: 'index',
            headerName: 'Emp. Index',
            flex: 1.4,
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 2,
        },
        {
            field: 'contactNumber',
            headerName: 'Contact Number',
            flex: 1.7,
        },


        {
            field: 'status',
            headerName: 'Status',
            flex: 1.7,
        },
        {
            field: 'Action',
            flex: 2,
            renderHeader: () => {
                <div style={{ textAlign: 'center', fontWeight: '600' }}>
                    Action
                </div>
            },
            renderCell: (params) => {
                const teamMemberEmail = params.row.email;
                const hasRole = teamWithRole.some((user) => user.email === teamMemberEmail);

                return (
                    <Box display='flex' justifyContent='space-around' >
                        <Typography
                            fontSize='14px'
                            color='primary'
                            mt='7px'
                            onClick={() => navigate(`/admin/editTeam/${params.row.id}`)}
                        >
                            Edit
                        </Typography>
                        {
                            role === 'admin' && (
                                <>
                                    <Typography
                                        fontSize='14px'
                                        color='primary'
                                        mt='7px'
                                        onClick={() => handleMakeAdminDialogOpen(params.row.id)}
                                    >
                                        Assign role
                                    </Typography>
                                    <Typography
                                        fontSize='14px'
                                        color='error'
                                        mt='7px'
                                        onClick={() => handleDeleteTeamDialogOpen(params.row.id)}
                                    >
                                        Delete
                                    </Typography>

                                    {hasRole && (
                                        <Typography
                                            fontSize='14px'
                                            color='primary'
                                            mt='7px'
                                            onClick={() => handleRemoveAdminDialogOpen(params.row.id)}
                                        >
                                            Remove role
                                        </Typography>
                                    )}
                                </>
                            )
                        }
                    </Box>
                );
            },
        }
    ];
    const rows = allTeams?.sort((a, b) => b.id - a.id).map((team, index) => ({
        status: showStatus(team.status),
        index: team.index,
        sNo: index + 1,
        id: team.id,
        fullName: `${team.firstName || ''} ${team.middleName || ''} ${team.lastName || ''}`,
        email: team.email,
        contactNumber: team.phoneNo,
        position: team.position,
    }));

    return (
        <Grid container className='px-20 pb-10' mx='auto'>
            <Typography mx='auto' variant='h4' >   List of team members</Typography>
            <Box width='100%'>
                <Link to='/admin/addTeam'>
                    <Button variant='outlined' size='small' sx={{ textTransform: 'none', float: 'right', marginBottom: '10px' }}>
                        <AddIcon />
                        Add a new team Member
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
                    <AdminRoleDialog itemId={teamId} open={makeAdminDialogOpen} handleClose={handleMakeAdminDialogClose} setOpen={setMakeAdminDialogOpen} />
                    <RemoveRole itemId={teamId} open={removeAdminDialogOpen} handleClose={handleRemoveAdminDialogClose} setOpen={setRemoveAdminDialogOpen} />
                    <DeleteDialog id={teamId} open={deleteDialogOpen} handleClose={handleDeleteTeamDialogClose} />
                </Box>
            </Box>
        </Grid>
    )
}

export default TeamList