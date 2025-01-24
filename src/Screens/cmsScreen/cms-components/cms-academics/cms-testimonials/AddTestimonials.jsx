import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, InputLabel, Grid, FormControl, Paper, Typography, Button, RadioGroup, FormControlLabel, Radio, FormLabel } from '@mui/material';
import RichEditor from '../../cms-project/components/RichEditor';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../../../../../Components/ImageUpload';
import { addTestimonial } from './testimonialsApi';
import FileUpload from '../../../../FileUpload';
import { getAllPrograms } from '../academicsApi';

function AddTestimonials() {
  const [programs, setPrograms] = useState([])

  const fetchPrograms = async() => {
    const response = await getAllPrograms()
     const uniqueProgram = [... new Set(response.map(item => item.shortName))]
    setPrograms(uniqueProgram)
  }

  useEffect(() => {
   fetchPrograms()
  }, [])
  
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        studentName: '',
        testimonials: '',
        pPsizePhoto: null,
        status: false,
        studentsFaculty: ''
    });

    const handleImageSelect = (file) => {
        setFormData(prev => ({
            ...prev,
            pPsizePhoto: file
        }))
    }
    const handleFileSelect = (file) => {
        setFormData(prev => ({
            ...prev,
            file: file
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'status') {
            setFormData(prev => ({
                ...prev,
                [name]: e.target.value === 'true' ? true : false
            }));
        }
        setFormData(prev => ({
            ...prev,
            [name]: name === 'status' ? (value === 'true') : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formDataToSend = new FormData()
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key])
        })
        try {
            const newTestimonial = await addTestimonial(formDataToSend);
            toast.success('Testimonial added successfully');
            setTimeout(() => {
                navigate('/admin/testimonials')
            }, 400);
        } catch (error) {
            console.error('Error adding Testimonial:', error);
            toast.error('Error adding Testimonial');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='pb-16'>
            <Typography mb='20px' variant='h5' textAlign='center'>
                Add a new Testimonial
            </Typography>
            <Grid component={Paper} elevation={3} container width='70%' mx='auto' spacing={1} padding='20px 20px 20px 15px'>
                <Grid item sm={12} md={9}>
                    <TextField
                        required
                        InputLabelProps={{
                            sx: {
                                '& .MuiInputLabel-asterisk': {
                                    color: 'brown',
                                },
                            },
                        }}
                        fullWidth
                        size='small'
                        label='Student Name'
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item sm={12} md={3}>
                    <FormControl size='small' fullWidth>
                        <InputLabel>Enrolled Program</InputLabel>
                        <Select
                            required InputLabelProps={{
                                sx: {
                                    '& .MuiInputLabel-asterisk': {
                                        color: 'brown',
                                    },
                                },
                            }}
                            name="studentsFaculty"
                            value={formData.studentsFaculty}
                            onChange={handleChange}
                            label='Project Category'
                        >
                          {
                            programs.map((item, index) => (
                              <MenuItem key={index} value={item}>{item}</MenuItem>

                            ))
                          }
                        </Select>
                    </FormControl>
                </Grid>
                
                <Grid item sm={12} md={6}>
                    <ImageUpload
                        name='pPsizePhoto'
                        label='Student Image'
                        disabled={false}
                        required={false}
                        onImageSelect={handleImageSelect}
                    />
                </Grid>
              
                <Grid display='flex' justifyContent='flex-start' item sm={12} md={3}>
                    <FormControl size='small'>
                        <FormLabel sx={{ marginTop: '-7px' }} >Set status</FormLabel>
                        <RadioGroup
                            row
                            sx={{ padding: 0, marginTop: '-6px' }}
                            onChange={handleChange}
                            name='status'
                            value={formData.status}
                        >
                            <FormControlLabel control={<Radio name='status' value={true} required InputLabelProps={{
                                sx: {
                                    '& .MuiInputLabel-asterisk': {
                                        color: 'brown',
                                    },
                                },
                            }} size='small' onChange={handleChange} />} label="Active" />
                            <FormControlLabel control={<Radio name='status' value={false} required InputLabelProps={{
                                sx: {
                                    '& .MuiInputLabel-asterisk': {
                                        color: 'brown',
                                    },
                                },
                            }} size='small' onChange={handleChange} />} label="Inactive" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            
                <Grid item sm={12} md={12}>
                    <RichEditor
                        height='400px'
                        placeholder="Add estimonial"
                        name='testimonials'
                        value={formData.testimonials}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item sm={12} md={12}>
                    <Button type='submit' size='small' variant='contained'>Add Testimonial</Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default AddTestimonials;
