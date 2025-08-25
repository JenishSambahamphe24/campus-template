import { useState } from 'react';
import {
    TextField, MenuItem, Select, InputLabel, Button, Grid, FormControl,
    Typography, Paper, FormLabel, Radio, RadioGroup, FormControlLabel
} from '@mui/material';
import { addGallery } from './galleryApii';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../../../../Components/ImageUpload';

function AddGallery() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        galleryType: '',
        galleryName: '',
        galleryDescription: '',
        thumbnailImage: null,
        videoUrl: '',
        status: true,
    });

    const handleImageSelect = (file) => {
        setFormData(prev => ({
            ...prev,
            thumbnailImage: file
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.galleryName || !formData.galleryType) {
            toast.error('Please fill all required fields');
            return;
        }

        const payload = new FormData();
        payload.append('galleryType', formData.galleryType);
        payload.append('galleryName', formData.galleryName);
        payload.append('galleryDescription', formData.galleryDescription);
        payload.append('thumbnailImage', formData.thumbnailImage);
        payload.append('videoUrl', formData.videoUrl);
        payload.append('status', formData.status);

        try {
            await addGallery(payload);
            toast.success('Gallery added successfully', { autoClose: 400 });
            setTimeout(() => {
                navigate('/admin/viewGallery');
            }, 1000);
        } catch (error) {
            if (error.response?.status === 413) {
                toast.error('The images are too large. Please reduce the size and try again.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h5" textAlign="center">
                Add New Gallery
            </Typography>

            <Grid
                container
                component={Paper}
                elevation={6}
                width="70%"
                mx="auto"
                my="2rem"
                spacing={2}
                pr={2}
                pt="1rem"
                pb="2rem"
            >
                <Grid item md={3}>
                    <FormControl size="small" fullWidth>
                        <InputLabel size="small">Gallery Type</InputLabel>
                        <Select
                            name="galleryType"
                            value={formData.galleryType}
                            onChange={handleChange}
                            label="Gallery Type"
                            size="small"
                        >
                            <MenuItem value="Image">Image</MenuItem>
                            <MenuItem value="Slider">Slider</MenuItem>
                            <MenuItem value="Video">Video</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item md={6}>
                    <TextField
                        fullWidth
                        required
                        size="small"
                        label={formData.galleryType === 'Slider' ? 'Slider Name' : 'Gallery Name'}
                        name="galleryName"
                        value={formData.galleryName}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item md={3}>
                    <ImageUpload
                        name="thumbnailImage"
                        label={formData.galleryType === 'Slider' ? 'Slider Image' : 'Thumbnail Image'}
                        disabled={
                            formData.galleryType !== 'Image' &&
                            formData.galleryType !== 'Slider' &&
                            formData.galleryType !== 'Logo'
                        }
                        required={formData.galleryType === 'Image'}
                        onImageSelect={handleImageSelect}
                    />
                </Grid>

                <Grid item md={12}>
                    <TextField
                        fullWidth
                        size="small"
                        label={formData.galleryType === 'Slider' ? 'Slider description' : 'Gallery description'}
                        name="galleryDescription"
                        value={formData.galleryDescription}
                        onChange={handleChange}
                        disabled={formData.galleryType !== 'Image' && formData.galleryType !== 'Slider'}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                {formData.galleryType === 'Video' && (
                    <Grid item md={8}>
                        <TextField
                            fullWidth
                            size="small"
                            name="videoUrl"
                            value={formData.videoUrl}
                            onChange={handleChange}
                            label="Video URL"
                            disabled={formData.galleryType !== 'Video'}
                        />
                    </Grid>
                )}

                <Grid item md={4} display="flex" justifyContent="center">
                    <FormControl>
                        <FormLabel id="status">Status</FormLabel>
                        <RadioGroup
                            row
                            value={formData.status}
                            onChange={handleChange}
                            name="status"
                        >
                            <FormControlLabel
                                value={true}
                                control={<Radio size="small" />}
                                label="Active"
                            />
                            <FormControlLabel
                                value={false}
                                control={<Radio size="small" />}
                                label="Inactive"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>

                <Grid item md={12} textAlign="center">
                    <Button type="submit" variant="contained">
                        Add Gallery
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default AddGallery;
