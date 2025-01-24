import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Stack, Typography, Button, Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { getPublicationCategory } from './publicationApi'
import EditCategoryDialog from './EditCategoryDialog'

function PubCatList() {
    const [category, setCategory] = useState([])
    const [categoryId, setCategoryId] = useState(0)
    const [editDialogOpen, setEditDialogOpen] = useState(false)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPublicationCategory()
                setCategory(data)
            } catch (error) {
                console.log('Error fetching category Data')
            }
        };
        fetchData()
    }, [])
    console.log(category)

    const columns = [
        { field: 'sNo', headerName: 'S.No.', flex: 50 },
        {
            field: 'categoryName',
            headerName: 'Category Name',
            flex: 150,
            editable: true,
        },

        {
            field: 'subCategoryName',
            headerName: 'Subcategories',
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
                </Box>
            ),
        }
    ];
    const rows = category?.map((item, index) => ({
        id: item.id,
        sNo: index + 1,
        categoryName: item.categoryName,
        subCategoryName: item.subCategoryName
    }));


    const handleEditDialogOpen = (id) => {
        setCategoryId(id)
        setEditDialogOpen(true);
    };
    const handleEditDialogClose = async () => {
        setEditDialogOpen(false);
        try {
            const updateCategory = await getPublicationCategory();
            setCategory(updateCategory);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    return (
        <Grid container mx='auto' md={11}>
            <Stack direction='column' gap='20px' sx={{ height: 'auto', flex: '100%', padding: '0 20px' }}>
                <Typography mx='auto' variant='h4' mb='1rem'> Publication Categories</Typography>
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
                            backgroundColor: '#0368b0',
                            color: 'white',
                            fontWeight:'40px',
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
                <Link to='/admin/addCategory'>
                    <Button variant='contained' size='small' sx={{ textTransform: 'none', flex: '12rem' }}>Add a new category</Button>
                </Link>
                <Box>
                    <EditCategoryDialog categoryId={categoryId} open={editDialogOpen} handleClose={handleEditDialogClose} setOpen={setEditDialogOpen} />
                </Box>
            </Stack>
        </Grid>
    )
}

export default PubCatList