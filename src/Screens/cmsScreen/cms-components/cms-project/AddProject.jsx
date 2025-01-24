import React, { useState } from 'react';
import { TextField, MenuItem, Select, InputLabel, Grid, FormControl, Paper, Typography, Button, RadioGroup, FormControlLabel, Radio, FormLabel } from '@mui/material';
import RichEditor from './components/RichEditor';
import { addProject } from './projectApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../../../../Components/FileUpload';
import ImageUpload from '../../../../Components/ImageUpload';

function AddProject() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: '',
        projectCategory: '',
        location: '',
        startDate: '',
        endDate: '',
        duration: 0,
        file: null,
        content: '',
        thumbnailImage: null,
        status: false
    });

    const handleImageSelect = (file) => {
        setFormData(prev => ({
            ...prev,
            thumbnailImage: file
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
            const newProject = await addProject(formDataToSend);
            toast.success('Project added successfully');
            setTimeout(() => {
                navigate('/admin/projects')
            }, 400);
        } catch (error) {
            console.error('Error adding project:', error);
            toast.error('Error adding project');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='pb-16'>
            <Typography mb='20px' variant='h5' textAlign='center'>
                Add new project
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
                        label='Title of the Project'
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item sm={12} md={3}>
                    <FormControl size='small' fullWidth>
                        <InputLabel>Project Category</InputLabel>
                        <Select
                            required InputLabelProps={{
                                sx: {
                                    '& .MuiInputLabel-asterisk': {
                                        color: 'brown',
                                    },
                                },
                            }}
                            name="projectCategory"
                            value={formData.projectCategory}
                            onChange={handleChange}
                            label='Project Category'
                        >
                            <MenuItem value='completed'> completed</MenuItem>
                            <MenuItem value='ongoing'>Ongoing</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item sm={12} md={6}>
                    <TextField
                        fullWidth
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        size='small'
                        required
                        InputLabelProps={{
                            sx: {
                                '& .MuiInputLabel-asterisk': {
                                    color: 'brown',
                                },
                            },
                        }}
                        label='Implemented Areas'
                    />
                </Grid>
                <Grid item sm={12} md={6}>
                    <ImageUpload
                        name='thumbnailImage'
                        label='Project thumbnail Image'
                        disabled={false}
                        required={false}
                        onImageSelect={handleImageSelect}
                    />
                </Grid>
                <Grid item sm={12} md={3}>
                    <TextField
                        size='small'
                        fullWidth
                        label='Project Start Date'
                        type='date'
                        required
                        InputLabelProps={{
                            shrink: true,
                            sx: {
                                '& .MuiInputLabel-asterisk': {
                                    color: 'brown',
                                },
                            },
                        }}
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item sm={12} md={3}>
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        size='small'
                        fullWidth
                        label='Project End Date'
                        type='date'
                        disabled={formData.projectCategory === 'ongoing'}
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item sm={12} md={3}>
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        disabled={formData.projectCategory === 'ongoing'}
                        size='small'
                        type='number'
                        fullWidth
                        label='Project Duration (Years)'
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
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
                <Grid item sm={12} md={6}>
                    <FileUpload
                        disabled={false}
                        required={false}
                        name='file'
                        label='Upload a file'
                        onFileSelect={handleFileSelect}
                    />
                </Grid>
            
                <Grid item sm={12} md={12}>
                    <RichEditor
                        height='400px'
                        placeholder="Enter project description"
                        name='content'
                        value={formData.content}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item sm={12} md={12}>
                    <Button type='submit' size='small' variant='contained'>Add Project</Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default AddProject;
