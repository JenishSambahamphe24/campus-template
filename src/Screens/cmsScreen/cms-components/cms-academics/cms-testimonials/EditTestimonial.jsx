import React, { useState, useEffect } from 'react'
import {
    Typography,
    Stack,
    InputLabel,
    NativeSelect,
    Grid,
    Button,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    FormControlLabel,
    IconButton,
    Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestimonialById, updateTestimonialById } from './testimonialsApi';
import { extractDate } from '../../../../../Components/utilityFunctions';
import FileDroppable from '../../cms-gallery/FileDroppable';
import TipTapEditor from '../../../../../Components/Tiptap/TipTapEditor';

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

function EditTestimonial() {
    const { testimonialId } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        studentName: '',
        studentsFaculty: '',
        status: false,
        testimonials: '',
        pPsizePhoto: null
    });
    const [fetchedImage, setFetchedImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (testimonialId) {
                try {
                    const data = await getTestimonialById(testimonialId);
                    setFormData((prev) => ({
                        ...prev,
                        ...data,
                        pPsizePhoto: null,
                    }));
                    setFetchedImage(data.pPsizePhoto);
                } catch (error) {
                    console.error('Error fetching testimonial:', error);
                    toast.error('Failed to fetch testimonial');
                }
            }
        };
        fetchData();
    }, [testimonialId]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'status') {
            setFormData((prev) => ({
                ...prev,
                [name]: value === 'true',
            }));
        } else if (name === 'phoneNo' && !/^\d*$/.test(value)) {
            return;
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleImageChange = (updatedFile, type) => {
        setFormData((prev) => ({
            ...prev,
            [type]: updatedFile[0] || null,
        }));
        setFetchedImage(null);
    };

    const handleRemoveFetchedImage = () => {
        setFetchedImage(null);
        setFormData((prev) => ({
            ...prev,
            pPsizePhoto: null,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = new FormData();
        if (formData.pPsizePhoto) {
            updatedData.append('pPsizePhoto', formData.pPsizePhoto);
        } else if (fetchedImage) {
            updatedData.append('pPsizePhoto', fetchedImage);
        }
        updatedData.append('studentName', formData.studentName || '');
        updatedData.append('studentsFaculty', formData.studentsFaculty || '');
        updatedData.append('status', formData.status || false);
        updatedData.append('testimonials', formData.testimonials || '');

        updatedData.append('createdAt', extractDate(formData.createdAt));
        updatedData.append('updatedAt', extractDate(formData.updatedAt || new Date()));
        try {
            await updateTestimonialById(testimonialId, updatedData);
            toast.success('Testimonial updated successfully');
            setTimeout(() => {
                navigate('/admin/projects');
            }, 700);
        } catch (error) {
            console.error('Error updating testimonial:', error);
            toast.error('Failed to update testimonial');
        }
    };
    return (
        <Grid container className='lg:px-[15rem] pb-10'>
            <h1 className='text-center pb-3 text-2xl  mx-auto'> Edit Testimonial </h1>
            <Stack component={Paper} width='100%' elevation='5' padding='20px' direction='column' rowGap='10px'>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing='1rem'>
                        <Grid item xs={9}>
                            <TextField
                                fullWidth
                                size='small'
                                variant='standard'
                                label='Title of the project'
                                name='studentName'
                                value={formData.studentName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <InputLabel variant="standard" >
                                    Project Type
                                </InputLabel>
                                <NativeSelect
                                    defaultValue={formData.studentsFaculty}
                                    name='galleryType'
                                    value={formData.studentsFaculty}
                                    inputProps={{
                                        name: 'galleryType'
                                    }}
                                    size='small'
                                    onChange={handleChange}
                                >
                                    <option value='ongoing'>Ongoing</option>
                                    <option value='completed'>Completed</option>
                                </NativeSelect>
                            </FormControl>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                fullWidth
                                size='small'
                                variant='standard'
                                label='Implemented Districts'
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid px='5px' display='flex' justifyContent='center' item xs={4}>
                            <FormControl>
                                <FormLabel>Status</FormLabel>
                                <RadioGroup row value={formData.status} onChange={handleChange} name="status">
                                    <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
                                    <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid mt='.2rem' container justifyContent='flex-start' spacing='1rem'>
                        <Grid item xs={3}>
                            <TextField
                                fullWidth
                                size='small'
                                label='Start Date'
                                variant='standard'
                                type='date'
                                InputLabelProps={{
                                    shrink: true
                                }}
                                name="startDate"
                                value={extractDate(formData.startDate)}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                fullWidth
                                size='small'
                                label='End Date'
                                variant='standard'
                                InputLabelProps={{
                                    shrink: true
                                }}
                                type='date'
                                name="endDate"
                                value={extractDate(formData.endDate)}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                InputLabelProps={{ shrink: true }}
                                size='small'
                                type='number'
                                variant='standard'
                                fullWidth
                                label='Project duration in years'
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid border='1px solid #c2c2c2' borderRadius='8px' container width="100%" mt='10px' padding='10px'>
                        <Grid px='5px' item xs={6}>
                            <Typography>Project image</Typography>
                            <FileDroppable
                                placeholder='Thumbnail image'
                                name="pPsizePhoto"
                                allowMultiple={false}
                                onImagesChange={(updatedFiles) => handleImageChange(updatedFiles, 'pPsizePhoto')}
                            />
                            {fetchedImage && (
                                <div style={{ position: 'relative', marginTop: '5px', width: '60px', height: '60px' }}>
                                    <img src={`${IMAGE_URL}/${fetchedImage}`} alt="Fetched" style={{ width: '100%', height: '100%', borderRadius: '8px' }} />

                                    <IconButton
                                        size="small"
                                        onClick={handleRemoveFetchedImage}
                                        style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '-10px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            )}
                        </Grid>
                    </Grid>
                    <Grid md={12} mt='.5rem'>
                        <TipTapEditor
                            placeholder=""
                            name='testimonials'
                            value={formData.testimonials}
                            onChange={handleChange}
                            height='320px'
                        />
                    </Grid>
                    <Button sx={{ marginTop: '10px' }} type='submit' size='small' variant='contained' >
                        Update
                    </Button>
                </form>
            </Stack>
        </Grid>
    )
}

export default EditTestimonial