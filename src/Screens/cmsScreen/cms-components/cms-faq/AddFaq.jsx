import React, { useState, useEffect } from 'react'
import { TextField, FormControl, Button, Grid, TextareaAutosize, Box, Typography, Paper, FormControlLabel, RadioGroup, Radio, FormLabel } from '@mui/material'
import { addFaq } from './faqApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function AddFaq() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        status: false
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
            const newFaq = await addFaq(formData);
            toast.success('Faq added successfully');
            navigate('/admin/faq')
        } catch (error) {
            console.error('Error adding team:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography mb='20px' variant='h5' textAlign='center'>
                Add a new Faq
            </Typography>
            <Grid component={Paper} container width='70%' mx='auto' spacing='10px' paddingRight='10px' paddingBottom='10px'>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        size='small'
                        variant='standard'
                        label='Question'
                        name='question'
                        value={formData.question}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextareaAutosize
                        className='bg-gray-100'
                        fullWidth
                        minRows={3}
                        size='small'
                        placeholder='Answer'
                        style={{ width: "100%", padding: '5px 10px' }}
                        value={formData.answer}
                        name='answer'
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item md={12}>
                    <FormControl>
                        <FormLabel>Active Status</FormLabel>
                        <RadioGroup
                            row
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
                            <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
                        </RadioGroup>
                    </FormControl>
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

export default AddFaq