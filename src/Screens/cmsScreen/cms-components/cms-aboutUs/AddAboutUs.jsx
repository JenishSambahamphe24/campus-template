import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio, InputLabel, MenuItem, Select } from '@mui/material';
import RichEditor from '../../../../Components/RichEditor';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addAboutUs } from './aboutsAPI';

function AddAboutUs() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        aboutUsImage: null,
        heading: '',
        description: '',
        workingAreaImage: '',
        status: true
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'status') {
            setFormData(prev => ({
                ...prev,
                [name]: value === 'true'
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleFileUpload = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        let errorMsg = '';

        if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
            errorMsg = 'Only JPEG and PNG image files are allowed';
        }

        setErrors((prev) => ({
            ...prev,
            [name]: errorMsg,
        }));

        if (!errorMsg) {
            setFormData((prev) => ({
                ...prev,
                [name]: file,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            await addAboutUs(formDataToSend);
            toast.success('Content added successfully', { autoClose: 700 });
            setTimeout(() => {
                navigate('/admin/aboutUs')
            }, 1000);
        } catch (error) {
            toast.error('Error adding content');
            console.error('Error adding content:', error);
        }
    };

    return (
        <form className='mb-8' onSubmit={handleSubmit}>
            <Typography mb="20px" variant="h5" textAlign="center">
                Add Institutional content
            </Typography>
            <Grid component={Paper} container width="70%" mx="auto" spacing="10px" padding="10px">
                <Grid item md={6}>
                    <FormControl size='small' fullWidth>
                        <InputLabel size='small'>Content-Type</InputLabel>
                        <Select
                            size='small'
                            label='Content-Type'
                            name='heading'
                            required
                            value={formData.heading}
                            InputLabelProps={{
                                sx: {
                                    '& .MuiInputLabel-asterisk': {
                                        color: 'brown',
                                    },
                                },
                            }}
                            onChange={handleChange}
                        >
                            <MenuItem value='Introduction'>Introduction</MenuItem>
                            <MenuItem value='Message-chairman'>Message From Chairman</MenuItem>
                            <MenuItem value='Message-campus-chief'>Message From Campus Chief</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={6}>
                    <TextField
                        required
                        InputLabelProps={{
                            shrink: true,
                            sx: {
                                '& .MuiInputLabel-asterisk': {
                                    color: 'brown',
                                },
                            },
                        }}
                        fullWidth
                        size="small"
                        label="Upload a content image"
                        name="aboutUsImage"
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={handleFileUpload}
                        error={!!errors.aboutUsImage}
                        helperText={errors.aboutUsImage}
                    />
                </Grid>

                <Grid display='flex' item md={12}>
                    <FormControl>
                        <FormLabel id="status">Status</FormLabel>
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
                    <RichEditor
                        height="320px"
                        placeholder="Enter introduction"
                        name="description"
                        value={formData.description}
                        onChange={(content) => {
                            setFormData(prev => ({ ...prev, description: content }));
                        }}
                    />
                </Grid>

                <Grid item md={12}>
                    <Button type="submit" size="small" variant="contained">
                        Add Content
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default AddAboutUs;