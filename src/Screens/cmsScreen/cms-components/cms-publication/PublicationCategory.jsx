import { useEffect, useState } from 'react';
import { TextField, Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { addPublicationCategory, deletePublicationCategoryById, getPublicationCategory } from './publicationApi';
import { toast } from 'react-toastify';
import { DataGrid } from '@mui/x-data-grid';
import EditCategoryDialog from './EditCategoryDialog';
import CommonDeleteDialog from '../cms-team/components/CommonDeleteDialog';

function PublicationCategory() {
    const [category, setCategory] = useState([])
    const [categoryId, setCategoryId] = useState(0)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const [formData, setFormData] = useState({
        categoryName: '',
        subCategoryName: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchData = async () => {
        try {
            const data = await getPublicationCategory()
            setCategory(data)
        } catch (error) {
            console.log('Error fetching category Data')
        }
    };
    useEffect(() => {
        fetchData()
    }, [])

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
            console.error('Error fetching categories:', error);
        }
    };
    const handleDeleteDialogOpen = (id) => {
        setCategoryId(id)
        setDeleteDialogOpen(true)
    }
    const handleDeleteDialogClose = () => {
        setDeleteDialogOpen(false);
        fetchData()
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newCategory = await addPublicationCategory(formData);
            toast.success('Publication category added successfully');
            await fetchData();
            setFormData({ categoryName: '', subCategoryName: '' });

        } catch (error) {
            console.error('Error adding publication category:', error);
            toast.error('Failed to add category');
        }
    };
    const columns = [
        { field: 'sNo', headerName: 'S.No.', flex: 50 },
        {
            field: 'categoryName',
            headerName: 'Category Name ',
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
                <Box display='flex' justifyContent='space-around' >
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
                        onClick={() => handleDeleteDialogOpen(params.row.id)}
                    >
                        Delete
                    </Typography>
                </Box>
            ),
        }
    ];
    const rows = category?.sort((a,b) => b.id-a.id).map((item, index) => ({
        id: item.id,
        sNo: index + 1,
        categoryName: item.categoryName,
        subCategoryName: item.subCategoryName
    }));
    return (
        <Grid container justifyContent='center' className='pb-8'>
            <Grid item sm={10}>
                <form onSubmit={handleSubmit}>
                    <Typography mb='20px' variant='h5' textAlign='center'>
                        Add a new content category
                    </Typography>
                    <div className='flex justify-between my-4'>
                        <div className='w-[39%]' >
                            <FormControl size='small' fullWidth>
                                <InputLabel size='small'> Category Name</InputLabel>
                                <Select
                                    id="demo-simple-select"
                                    size='small'
                                    name='categoryName'
                                    value={formData.categoryName}
                                    label='Category Name'
                                    required InputLabelProps={{
                                        sx: {
                                            '& .MuiInputLabel-asterisk': {
                                                color: 'brown',
                                            },
                                        },
                                    }}
                                    onChange={handleChange}
                                >
                                    <MenuItem value='Publication'>Publication</MenuItem>
                                    <MenuItem value='News and Events'>News & Events</MenuItem>
                                    <MenuItem value='Report'>Reports</MenuItem>
                                    <MenuItem value='Notices'>Notices</MenuItem>
                                    <MenuItem value='Downloads'>Downloads</MenuItem>
                                    <MenuItem value='Curriculum'>Curriculum</MenuItem>
                                    <MenuItem value='Thesis'>Thesis</MenuItem>
                                    <MenuItem value='Other'>Others</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className='w-[40%]' >
                            {
                                formData.categoryName === 'News and Events' ?
                                    (
                                        <FormControl size='small' fullWidth>
                                            <InputLabel size='small'>Subcategory Name</InputLabel>
                                            <Select
                                                size='small'
                                                name='subCategoryName'
                                                value={formData.subCategoryName}
                                                label='Subcategory Name'
                                                required InputLabelProps={{
                                                    sx: {
                                                        '& .MuiInputLabel-asterisk': {
                                                            color: 'brown',
                                                        },
                                                    },
                                                }}
                                                onChange={handleChange}
                                            >
                                                <MenuItem value='News'>News</MenuItem>
                                                <MenuItem value='Events'>Events</MenuItem>
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <TextField
                                            fullWidth
                                            size='small'
                                            name='subCategoryName'
                                            value={formData.subCategoryName}
                                            label='Subcategory Name'
                                            onChange={handleChange}
                                        />
                                    )
                            }

                        </div>
                        <div className='w-[20%]'>
                            <Button type='submit' fullWidth variant='contained'>
                                Add New Category
                            </Button>
                        </div>
                    </div>
                </form >
            </Grid>
            <Grid item sm={10}>
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

                {['Notices', 'Thesis'].includes(formData.categoryName) && category.length === 0 && (
                    <Box textAlign="center" mt={4}>
                        <img
                            src="/assets/empty-state-icon.svg" // Replace with your actual image path
                            alt="No content"
                            style={{ width: '120px', marginBottom: '16px' }}
                        />
                        <Typography variant="h6" color="textSecondary" fontWeight={600}>
                            No {formData.categoryName} available yet.
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Add a new one to get things rolling!
                        </Typography>
                    </Box>
                )}

                <Box>
                    <EditCategoryDialog categoryId={categoryId} open={editDialogOpen} handleClose={handleEditDialogClose} setOpen={setEditDialogOpen} />
                    <CommonDeleteDialog
                        id={categoryId}
                        open={deleteDialogOpen}
                        handleClose={handleDeleteDialogClose}
                        deleteApi={deletePublicationCategoryById}
                        content='Publication Category'
                    />
                </Box>
            </Grid>
        </Grid>
    );
}

export default PublicationCategory;
