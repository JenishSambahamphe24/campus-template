import React, { useState, useEffect } from 'react'
import { TextField, FormControl, Button, Grid, TextareaAutosize, Typography, Paper, FormControlLabel, RadioGroup, Radio, FormLabel } from '@mui/material'
import { toast } from 'react-toastify';
import { addLink } from './linkApi';
import { useNavigate } from 'react-router-dom';


function AddLink() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        url: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const newFaq = await addLink(formData);
            toast.success('Link added successfully');
            navigate('/admin/links')
        } catch (error) {
            console.error('Error adding team:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography mb='20px' variant='h5' textAlign='center'>
                Add a new Link
            </Typography>
            <Grid component={Paper} container width='70%' mx='auto' spacing='10px' paddingRight='10px' paddingBottom='10px'>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        size='small'
                        variant='standard'
                        label='Link Name'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        size='small'
                        variant='standard'
                        label='URL'
                        name='url'
                        value={formData.url}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item md={12}>
                    <Button
                        type='submit'
                        size='small'
                        variant='contained'
                    >
                        Add a new FAQ
                    </Button>
                </Grid>

            </Grid>
        </form>
    )
}

export default AddLink