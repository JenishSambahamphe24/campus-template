import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { addPublicationCategory } from './publicationApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function AddFaculties() {
    const navigate = useNavigate()
    
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newCategory = await addPublicationCategory(formData);
            toast.success('Publication category added successfully');
            navigate('/admin/publications')
        } catch (error) {
            console.error('Error adding publication category:', error);
            toast.error('Failed to add category');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography mb='20px' variant='h5' textAlign='center'>
                Add a new Faculty
            </Typography>
            <Grid component={Paper} elevation={4} container width='70%' mx='auto' spacing={2} padding='10px'>
                <Grid item md={6}>

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
                            <MenuItem value='Application'>Application</MenuItem>
                            <MenuItem value='Other'>Others</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                < Grid item md={6}>
                    <TextField
                        fullWidth
                        size='small'
                        name='subCategoryName'
                        value={formData.subCategoryName}
                        label='Subcategory Name'
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item display='flex' justifyContent='center' md={12}>
                    <Button type='submit' size='small' variant='contained'>
                        Add New Category
                    </Button>
                </Grid>
            </Grid>
        </form >
    );
}

export default AddFaculties;
