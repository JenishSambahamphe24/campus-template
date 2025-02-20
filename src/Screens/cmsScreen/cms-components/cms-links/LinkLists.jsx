import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Grid,
    Stack,
    Typography,
    Button,
    Box,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import EditLinkDialog from './EditLinkDialog'
import { getAllLink } from './linkApi'
import CommonDeleteDialog from '../cms-team/components/CommonDeleteDialog'
import { deleteLink } from './linkApi'

function LinkLists() {
    const [link, setLink] = useState([])
    const [linkId, setLinkId] = useState(0)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const fetchData = async () => {
        try {
            const data = await getAllLink()
            setLink(data)
        } catch (error) {
            console.log('Error fetching links ')
        }
    };
    useEffect(() => {
        fetchData()
    }, [])

    const handleDeleteLinkDialogOpen = (id) => {
        setLinkId(id)
        setDeleteDialogOpen(true);
    };
    const handleDeleteTeamDialogClose = () => {
        setDeleteDialogOpen(false);
        fetchData()
    };
    const columns = [
        { field: 'sNo', headerName: 'S.No.', flex: 50 },
        {
            field: 'name',
            headerName: 'Link Name',
            flex: 150,
            editable: true,
        },
        {
            field: 'type',
            headerName: 'Link Type',
            flex: 150,
            editable: true,
        },
        {
            field: 'url',
            headerName: 'URL',
            flex: 110,
            editable: true,
        },

        {
            field: 'Action',
            flex: 150,
            renderHeader: () => {
                <div style={{ textAlign: 'center', fontWeight: '600' }}>
                    Action
                </div>
            },
            renderCell: (params) => (
                <Box display='flex' >
                    <Typography
                        fontSize='14px'
                        color='primary'
                        mt='7px'
                        onClick={() => handleEditDialogOpen(params.row.id)}
                    >
                        Edit
                    </Typography>
                    <Typography
                        fontSize='14px'
                        color='error'
                        mt='7px'
                        ml='20px'
                        onClick={() => handleDeleteLinkDialogOpen(params.row.id)}
                    >
                        Delete
                    </Typography>
                </Box>
            ),
        }
    ];
    const rows = link?.map((item, index) => ({
        id: item.id,
        sNo: index + 1,
        name: item.name,
        url: item.url,
        type: item.type
    }));


    const handleEditDialogOpen = (id) => {
        setLinkId(id)
        setEditDialogOpen(true);
    };
    const handleEditDialogClose = async () => {
        setEditDialogOpen(false);
        fetchData()
    };

    return (
        <Grid container mx='auto' md={11}>
            <Stack direction='column' gap='20px' sx={{ height: 'auto', flex: '100%', padding: '0 20px' }}>
                <Typography mx='auto' variant='h4' mb='.7rem'> List of External Links </Typography>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    density='compact'
                    disableColumnFilter={true}
                    rowsPerPageOptions={[]}
                    disableAutosize={true}
                    disableColumnMenu={true}
                    disableColumnSelector={true}
                    disableColumnSorting={true}
                    disableDensitySelector={true}
                    columnHeaderHeight={70}
                    showCellVerticalBorder={true}
                    pagination
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    sx={{
                        '.MuiDataGrid-columnHeader': {
                            backgroundColor: '#1169bf',
                            color: 'white',
                            fontWeight: '40px',
                            borderRight: '1px solid white',

                        },
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
                        '& .grid-header .MuiDataGrid-colCellpublicationTitle': {
                            fontWeight: 'bold'
                        },
                        '& .MuiDataGrid-columnHeaderpublicationTitle ': {
                            fontWeight: '600',
                            fontSize: '14px'
                        },
                        width: '100%',
                        marginTop: '0'
                    }}
                />
                <Link to='/admin/addLink'>
                    <Button variant='contained' size='small' sx={{ textTransform: 'none', flex: '12rem' }}>Add a new Link</Button>
                </Link>
                <Box>
                    <EditLinkDialog linkId={linkId} open={editDialogOpen} handleClose={handleEditDialogClose} setOpen={setEditDialogOpen} />
                    <CommonDeleteDialog
                        id={linkId}
                        open={deleteDialogOpen}
                        handleClose={handleDeleteTeamDialogClose}
                        deleteApi={deleteLink}
                        content='Link'
                    />
                </Box>
            </Stack>
        </Grid>
    )
}

export default LinkLists