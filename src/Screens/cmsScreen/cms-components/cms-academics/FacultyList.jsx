import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Grid,
    Stack,
    Typography,
    Button,
    Box,
    Select,
    InputLabel,
    FormControl,
    MenuItem
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { getAllFaculties } from './academicsApi'
import EditFaculty from './EditFaculty'

function FacultyList() {
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [category, setCategory] = useState([])
    const [categoryId, setCategoryId] = useState(0)
    const [uniquelevel, setUniqueLevel] = useState([])

    const [editDialogOpen, setEditDialogOpen] = useState(false)
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllFaculties()
                setCategory(data)
                const unuqueLevel = [...new Set(data.map(item => item.level))];
                setUniqueLevel(unuqueLevel)
            } catch (error) {
                console.log('Error fetching category Data')
            }
        };
        fetchData()
    }, [])

    const filteredCategories = category.filter((row) => {
        return (
            selectedLevel === "All" || row.level === selectedLevel
        );
    });
    const columns = [
        { field: 'sNo', headerName: 'S.No.', flex: 50 },
        {
            field: 'facultyName',
            headerName: 'Category Name',
            flex: 150,
            editable: true,
        },

        {
            field: 'level',
            headerName: 'level',
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
    const rows = filteredCategories?.map((item, index) => ({
        id: item.id,
        sNo: index + 1,
        facultyName: item.facultyName,
        level: item.level
    }));


    const handleEditDialogOpen = (id) => {
        setCategoryId(id)
        setEditDialogOpen(true);
    };
    const handleEditDialogClose = async () => {
        setEditDialogOpen(false);
        try {
            const updateCategory = await getAllFaculties();
            setCategory(updateCategory);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    return (
        <Grid container mx='auto' md={11}>
            <Stack direction='column' gap='20px' sx={{ height: 'auto', flex: '100%', padding: '0 20px' }}>
                <Typography mx='auto' variant='h4' mb='.7rem'> List of Faculties </Typography>
                <FormControl fullWidth sx={{ maxWidth: "30%" }} size="small">
                    <InputLabel>Select Faculty</InputLabel>
                    <Select
                        size="small"
                        sx={{
                            backgroundColor: "#fff",
                            borderRadius: 2,
                        }}
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        label="Select Level"
                    >
                        <MenuItem value="All">All Faculty</MenuItem>
                        {
                            uniquelevel.map((item, index) => (
                                <MenuItem key={index} value={item}>{item}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
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
                <Link to='/admin/addFaculty'>
                    <Button variant='contained' size='small' sx={{ textTransform: 'none', flex: '12rem' }}>Add a new Faculty</Button>
                </Link>
                <Box>
                    <EditFaculty categoryId={categoryId} open={editDialogOpen} handleClose={handleEditDialogClose} setOpen={setEditDialogOpen} />
                </Box>
            </Stack>
        </Grid>
    )
}

export default FacultyList