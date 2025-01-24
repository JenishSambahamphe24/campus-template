import { useState, useEffect } from 'react'
import { Typography, Stack, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Grid, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { GridOverlay } from '@mui/x-data-grid';
import { getAllaboutUs } from './aboutsAPI';
import { cleanDescription, showStatus } from '../../../../Components/utilityFunctions';



function AboutUsList() {
    const navigate = useNavigate()
    const [allItems, setAllItems] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllaboutUs()
                const addedData = data.map((item, index) => ({
                    ...item,
                    sNo: index + 1
                }))
                setAllItems(addedData)
            }
            catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchData()
    }, [])



    const columns = [
        { field: 'sNo', headerName: 'SNo', flex: .5 },
        {
            field: 'heading',
            headerName: 'Heading',
            flex: 2,
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,

        },
        {
            field: 'description',
            headerName: 'Description',
            flex: 3,
            renderCell: (params) => (
                <div
                    style={{ fontSize: '16px' }}
                    dangerouslySetInnerHTML={{ __html: cleanDescription(params.row.description) }}
                />
            ),
        },
        {
            field: 'Action',
            flex: 1,
            renderHeader: () => (
                <div style={{ textAlign: 'center', fontWeight: '600' }}>
                    Action
                </div>
            ),
            renderCell: (params) => (
                <Box display='flex' >
                    <Typography
                        fontSize='14px'
                        color='primary'
                        mt='7px'
                        onClick={() => navigate(`/admin/editAboutUs/${params.row.id}`)}
                    >
                        Edit
                    </Typography>
                </Box>
            ),
        }
    ];

    const rows = allItems?.sort((a, b) => b.id - a.id).map((item, index) => ({
        sNo: index + 1,
        id: item.id,
        heading: item.heading,
        description: item.description,
        status: showStatus(item.status),
    }));
    return (
        <Grid container mx='auto' mb='2rem' md={11}>
            <Stack direction='column' gap='20px' sx={{ height: 'auto', flex: '100%', padding: '0 20px' }}>
                <Typography mx='auto' variant='h4' mb='1rem'> About us Content</Typography>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    density='compact'
                    pagination
                    rowsPerPageOptions={[10, 20, 50]}
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
                        '.MuiDataGrid-columnHeader': {
                            backgroundColor: '#0368b0',
                            color: 'white',
                            fontWeight: '40px',
                            borderRight: '1px solid white',

                        },
                        minHeight: '340px',
                        '.MuiDataGrid-footerContainer': {
                            minHeight: '35px',
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
                <Link to='/admin/addAboutUs'>
                    <Button variant='contained' size='small' sx={{ textTransform: 'none', flex: '12rem' }}>Add a new content</Button>
                </Link>
                {/* <Box>
                    <EditAboutUs itemId={itemId} open={editDialogOpen} handleClose={handleEditDialogClose} setOpen={setEditDialogOpen} />
                </Box> */}
            </Stack>
        </Grid>
    )
}

export default AboutUsList