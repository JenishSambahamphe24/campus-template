import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import { addPublicationCategory } from './publicationApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { addFaculty } from './academicsApi';

function AddFaculty() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        level: '',
        facultyName: '',
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
            const newCategory = await addFaculty(formData);
            toast.success('Publication category added successfully');
            navigate('/admin/faculties')
        } catch (error) {
            console.error('Error adding publication category:', error);
            toast.error('Failed to add category');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography mb='20px' variant='h5' textAlign='center'>
                Add new faculty
            </Typography>
            <Grid component={Paper} elevation={4} container width='70%' mx='auto' spacing={2} padding='10px'>
                <Grid item md={6}>

                    <FormControl size='small' fullWidth>
                        <InputLabel size='small'> Level</InputLabel>
                        <Select
                            id="demo-simple-select"
                            size='small'
                            name='level'
                            value={formData.level}
                            label='Level'
                            required InputLabelProps={{
                                sx: {
                                    '& .MuiInputLabel-asterisk': {
                                        color: 'brown',
                                    },
                                },
                            }}
                            onChange={handleChange}
                        >
                            <MenuItem value='Bachelor'>Bachelor</MenuItem>
                            <MenuItem value='Master'>Masters</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                < Grid item md={6}>
                    <TextField
                        fullWidth
                        size='small'
                        name='facultyName'
                        value={formData.facultyName}
                        label='Faculty Name'
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item display='flex' justifyContent='center' md={12}>
                    <Button type='submit' size='small' variant='contained'>
                        Add New Faculty
                    </Button>
                </Grid>
            </Grid>
        </form >
    );
}

export default AddFaculty;
